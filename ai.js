const fetch = require('node-fetch')

module.exports = async function ai(token, api, model, content, prompt, max_token) {
  const url = api || 'https://api.openai.com/v1/chat/completions'

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const body = {
    model: model || 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: content + prompt }
    ],
    max_tokens: Number(max_token) || 512  // 使用512作为默认值
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`AI 请求失败 (${res.status}): ${errText}`)
    }

    const json = await res.json()

    // 如果返回格式不正确，抛出错误
    if (!json.choices || json.choices.length === 0 || !json.choices[0].message?.content) {
      throw new Error('OpenAI 返回的响应格式不正确')
    }

    return json.choices[0].message.content.trim()

  } catch (error) {
    // 捕获并抛出请求中的任何错误
    throw new Error(`AI 请求失败: ${error.message}`)
  }
}
