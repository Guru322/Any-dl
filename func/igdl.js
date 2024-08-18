import axios from 'axios'
import cheerio from 'cheerio'

const igdl = async url => {
  const payload = new URLSearchParams({
    url: url,
    host: 'instagram',
  })

  try {
    const response = await axios.request({
      method: 'POST',
      baseURL: 'https://saveinsta.io/core/ajax.php',
      data: payload,
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        cookie: 'PHPSESSID=ihp48pmbr4cjgckula7qipjkko',
        'user-agent':
          'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
      },
    })

    const $ = cheerio.load(response.data)
    const mediaURL = $('div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom')
      .map((_, el) => 'https://saveinsta.io/' + $(el).find('div.col-md-8.mx-auto > a').attr('href'))
      .get()

    return {
      creator: 'Guru sensei',
      status: 200,
      media: mediaURL,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 400,
      message: 'error',
    }
  }
}

export default igdl
