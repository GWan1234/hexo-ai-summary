module.exports = function strip(content, config) {
  // 获取配置中的 ignore_rules
  const ignoreRules = config.ignoreRules || [];

  // 遍历配置规则并应用正则匹配忽略内容
  if (Array.isArray(ignoreRules) && ignoreRules.length > 0) {
    ignoreRules.forEach(rule => {
      const regex = new RegExp(rule, 'g');
      content = content.replace(regex, '');  // 替换匹配到的部分为空字符串
    });
  } else {
    if (config.logger) console.warn('[Hexo-AI-Summary-LiuShen] ignore_rules 似乎没有设置或者无效，跳过处理');
  }

  if (config.logger) console.log('[Hexo-AI-Summary-LiuShen] 处理前字符串长度：', content.length);

  // 去掉图片链接中的地址（保留 alt 文本）
  content = content.replace(/!\[.*?\]\(.*?\)/g, '![]');

  // 去掉超链接中的地址（保留文本）
  content = content.replace(/\[.*?\]\(.*?\)/g, '[]');

  // 去掉所有 HTML 标签
  content = content.replace(/<[^>]+>/g, '');

  // 去掉 &nbsp;
  content = content.replace(/&nbsp;/g, ''); 

  // 去掉代码块
  content = content.replace(/```[\s\S]*?```/g, '');

  // 去掉代码行
  content = content.replace(/`.*?`/g, '');

  // 去掉换行符
  content = content.replace(/\n/g, '');

  // 去掉多余的空格
  content = content.replace(/\s+/g, ' ');

  if (config.logger) console.log('[Hexo-AI-Summary-LiuShen] 处理后字符串长度：', content.length);

  return content.trim();
}
