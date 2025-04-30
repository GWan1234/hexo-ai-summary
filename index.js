const strip = require('./strip')
const ai = require('./ai')
const fs = require('hexo-fs')
const fm = require('hexo-front-matter')
const pLimit = require('p-limit')

const config = hexo.config.aisummary || {}
if (!config.api) {
    console.error('请在配置文件中设置 api')
    return
}

const limit = pLimit(config.concurrency || 2)  // 设置最大并发数，比如 2
const fieldName = config.summary_field || 'summary'   // 👈 默认为 'summary'
const defaultPrompt = config.prompt || '请为以下内容生成一个简短的摘要：'

hexo.extend.filter.register('before_post_render', async function (data) {
    
    // 检查是否为文章页面
    if (data.layout != 'post' || !data.source.startsWith('_posts/')) {
        if (config.logger) console.info(`跳过 ${data.title}，不是文章页面`)
        return data
    }

    return await limit(async () => {
        if (!config.enable && !data.is_summary) {
            if (config.logger) console.info(`文章 ${data.title} 被标记为不进行摘要，跳过`)
            return data
        }
        if (data[fieldName] && data[fieldName].length > 0 && config.cover_all !== true) {
            if (config.logger) console.info(`文章 ${data.title} 已经有摘要，跳过`)
            return data
        }

        const content = strip(data.content, config.ignoreRules)

        if (content.length > config.max_token) {
            if (config.logger) console.info(`文章 ${data.title} 超过 max_token 限制`)
            return data
        }

        const path = this.source_dir + data.source
        const frontMatter = fm.parse(await fs.readFile(path))
        // 去掉 frontMatter 中的 _content
        const MdContent = frontMatter._content
        delete frontMatter._content

        try {
            const ai_content = await ai(
                config.token,
                config.api,
                config.model,
                content,
                defaultPrompt,
                config.max_token
            )

            // 检测内容是否为空，是否有换行，是否有#,$,%之类的特殊字符
            if (!ai_content || ai_content.length < 10 || /[\n#$%]/.test(ai_content)) {
                if (config.logger) console.info(`文章 ${data.title} 的摘要内容不符合要求，跳过`)
                return data
            }

            frontMatter[fieldName] = data[fieldName] = ai_content

            await fs.writeFile(path, `---\n${fm.stringify(frontMatter)}\n${MdContent}`)
            if (config.logger) console.info(`摘要 ${data.title} 完成`)
        } catch (err) {
            if (config.logger) console.error(`生成摘要失败：${data.title}\n${err.message}`)
        }

        return data
    })
})
