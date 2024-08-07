import axios from 'axios'
import cheerio from 'cheerio'

async function apkmirror(query) {
  return new Promise(async (resolve, reject) => {
    await axios
      .get('https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=' + query)
      .then(({ data }) => {
        const $ = cheerio.load(data)
        let title = new Array()
        let developer = new Array()
        let update = new Array()
        let size = new Array()
        let downCount = new Array()
        let version = new Array()
        let url = new Array()
        let result = new Array()
        $('div#content > div > div > div.appRow > div > div').each(function (a, b) {
          let judul = $(this).find('div > h5 > a').text()
          let dev = $(this).find('div > a').text().replace(/\n/g, '')
          let link = $(this).find('div > div.downloadIconPositioning > a').attr('href')
          if (judul !== '') title.push(judul)
          if (dev !== '') developer.push(dev)
          if (link !== undefined) url.push(link)
        })
        $('div#content > div > div > div.infoSlide > p > span.infoSlide-value').each(
          function (c, d) {
            let serialize = $(this).text()
            if (serialize.match('MB')) {
              size.push(serialize.trim())
            } else if (serialize.match('UTC')) {
              update.push(serialize.trim())
            } else if (!isNaN(serialize) || serialize.match(',')) {
              downCount.push(serialize.trim())
            } else {
              version.push(serialize.trim())
            }
          }
        )
        for (let i = 0; i < url.length; i++) {
          result.push({
            title: title[i],
            developer: developer[i],
            version: version[i],
            updated: update[i],
            downloadCount: downCount[i] || '1,000',
            size: size[i],
            url: 'https://www.apkmirror.com' + url[i],
          })
        }
        resolve(result)
      })
      .catch(reject)
  })
}

export default apkmirror
