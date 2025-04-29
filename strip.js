module.exports = function strip(content, ignoreRules) {
  // 遍历配置规则并应用正则匹配忽略内容
  ignoreRules.forEach(rule => {
    const regex = new RegExp(rule, 'g');
    content = content.replace(regex, '');  // 替换匹配到的部分为空字符串
  });

  // 去掉图片链接中的地址（保留 alt 文本）
  content = content.replace(/!\[.*?\]\(.*?\)/g, '![]');

  // 去掉超链接中的地址（保留文本）
  content = content.replace(/\[.*?\]\(.*?\)/g, '[]');

  // 去掉所有 HTML 标签
  content = content.replace(/<[^>]+>/g, '');

  return content.trim();
}
