import fetch from 'node-fetch'
import _ from 'lodash'

const Quotly = async data => {
  const headers = {
    'Content-Type': 'application/json',
  }
  const urls = ['https://quotly.netorare.codes/generate', 'https://btzqc.betabotz.eu.org/generate']

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        console.log(`Quotly Error: ${url} failed`)
        continue
      }

      const result = await response.json()

      if (result?.result?.image) {
        return Buffer.from(result.result.image, 'base64')
      }
    } catch (error) {
      console.error(`Quotly Error at ${url}:`, error)
    }
  }

  try {
    const fallbackResponse = await fetch('https://widipe.com/quotely', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: new URLSearchParams({
        avatar: data.messages[0]?.from.photo.url,
        name: data.messages[0]?.from.name,
        text: data.messages[0]?.text,
      }),
    })

    const arrayBuffer = await fallbackResponse.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('Quotly Fallback Error:', error)
    return null
  }
}

export default Quotly
