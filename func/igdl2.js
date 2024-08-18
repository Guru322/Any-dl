import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import querystring from 'querystring'

async function igdl2(instaUrl) {
  const url = 'https://indownloader.app/request'
  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: 'https://indownloader.app',
    Connection: 'keep-alive',
    Referer: 'https://indownloader.app/',
    Cookie: 'PHPSESSID=n5nj64la8r4atsirs29oukcna3',
    Priority: 'u=0',
  }

  const body = querystring.stringify({
    link: instaUrl,
    downloader: 'photo',
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })
    const data = await response.json()

    if (data.error) {
      throw new Error('Error in API response')
    }

    const $ = cheerio.load(data.html)

    const thumbnail = $('.post-thumb img').attr('src')

    const downloadLinks = []
    $('.download-options a').each((index, element) => {
      downloadLinks.push({
        label: $(element).text().trim(),
        url: $(element).attr('href'),
      })
    })

    return {
      creator: 'Guru sensei',
      thumbnail,
      downloadLinks,
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export default igdl2