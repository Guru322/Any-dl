import fetch from 'node-fetch'

async function bitly(url) {
  try {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 7e22401ef9e6777813e43a52dfef0ade98c6d3f9',
      },
      body: JSON.stringify({
        long_url: url,
      }),
    })
    return (await response.json()).link
  } catch (error) {
    return console.error(error), null
  }
}

async function tinyurl(url) {
  try {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
    return await response.text()
  } catch (error) {
    return console.error(error), null
  }
}

export { bitly, tinyurl }
