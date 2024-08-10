import fetch from 'node-fetch'

function generateLogHash() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let hash = ''
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    hash += characters[randomIndex]
  }
  return hash
}

const url = 'https://www.blackbox.ai/api/chat'

const headers = {
  accept: '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'application/json',
  origin: 'https://www.blackbox.ai',
  priority: 'u=1, i',
  referer: 'https://www.blackbox.ai/chat/lqUeb20',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
}

async function blackbox(prompt, logHash = generateLogHash()) {
  const body = JSON.stringify({
    messages: [{ id: logHash, content: prompt, role: 'user' }],
    id: logHash,
    previewToken: null,
    userId: null,
    codeModelMode: true,
    agentMode: {},
    trendingAgentMode: {},
    isMicMode: false,
    maxTokens: 1024,
    isChromeExt: false,
    githubToken: null,
    clickedAnswer2: false,
    clickedAnswer3: false,
    clickedForceWebSearch: false,
    visitFromDelta: null,
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.text()
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export default blackbox
