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
      { role: 'user', content: content }
    ],
    max_tokens: Number(max_token) || 512
  }

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
  return json.choices?.[0]?.message?.content?.trim() || ''
}
