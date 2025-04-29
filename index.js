const strip = require('./strip')
const log = require('hexo-log')()
const ai = require('./ai')
const fs = require('hexo-fs')
const fm = require('hexo-front-matter')

const config = hexo.config.aisummary || {}
if (!config.api) {
    log.error('请在配置文件中设置 api')
    return
}

hexo.extend.filter.register('before_post_render', async function (data) {
    if (config.default_enable) data.aiexcerpt = data.aiexcerpt || true
    if (!data.aisummary || data.summary) return data

    const content = strip(data.content, config.ignoreRules)

    if (content.length > config.max_token) {
        log.info(`文章 ${data.title} 超过max_token限制`)
        return data
    }

    log.info(`摘要 ${data.title} 完成`)

    const path = this.source_dir + data.source
    const frontMatter = fm.parse(await fs.readFile(path))

    // 将摘要赋值给 summary 字段
    frontMatter.summary = data.summary = await ai(
        config.token,
        config.api,
        config.model,
        content,
        config.prompt,
        config.max_token
    )

    await fs.writeFile(path, `---\n${fm.stringify(frontMatter)}\n---\n\n${data.content}`)

    return data
})
