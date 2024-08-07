import axios from 'axios'
import cheerio from 'cheerio'

async function PlayStore(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`),
        result = [],
        $ = cheerio.load(data)
      if (
        ($(
          '.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a'
        ).each((i, u) => {
          const linkk = $(u).attr('href'),
            name = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text(),
            developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text(),
            img = $(u).find('.j2FCNc > img').attr('src'),
            rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label'),
            rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text(),
            link = `https://play.google.com${linkk}`
          result.push({
            creator: 'Guru sensei',
            link: link,
            name: name || 'No name',
            developer: developer || 'No Developer',
            img: img || 'https://i.ibb.co/G7CrCwN/404.png',
            rating: rate || 'No Rate',
            rating_Num: rate2 || 'No Rate',
            link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(' ').join('+')}`,
          })
        }),
        result.every(x => void 0 === x))
      )
        return resolve({
          creator: 'Guru sensei',
          text: 'no result found',
        })
      resolve(result)
    } catch (err) {
      console.error(err)
    }
  })
}

export default PlayStore
