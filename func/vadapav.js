import fetch from 'node-fetch'
import cheerio from 'cheerio'

async function tinyurl(url) {
  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    )
    return await response.text()
  } catch (error) {
    console.error('Error shortening URL:', error)
    return null
  }
}

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  },
}

class Vadapav {
  constructor() {
    this.baseUrl = 'https://vadapav.mov'
  }

  async search(query) {
    try {
      const response = await fetch(`${this.baseUrl}/api/s/${query}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const json = await response.json()
      return json
    } catch (error) {
      console.error(`Failed to search: ${error}`)
      return null
    }
  }

  async download(id) {
    try {
      const url = `${this.baseUrl}/${id}`
      const response = await fetch(url, options)
      const data = await response.text()
      const $ = cheerio.load(data)

      const results = []

      const anchorTags = $('a[href^="/f/"]')

      for (const element of anchorTags.toArray()) {
        const href = $(element).attr('href')
        const title = $(element).text().trim()

        if (href && title) {
          const fullUrl = `${this.baseUrl}${href}`
          const shortenedUrl = await tinyurl(fullUrl)

          if (shortenedUrl) {
            results.push({ title, dl_url: shortenedUrl })
          }
        }
      }
      return results
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

export default Vadapav
