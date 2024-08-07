import { fetch as fetchUndici } from 'undici'
import FormData from 'form-data'
import fakeUserAgent from 'fake-useragent'

const BING_URL = 'https://www.bing.com',
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  generateRandomIP = () => {
    const octet = () => Math.floor(256 * Math.random())
    return `${octet()}.${octet()}.${octet()}.${octet()}`
  },
  generateRandomUserAgent = () => {
    const androidVersions = [
        '4.0.3',
        '4.1.1',
        '4.2.2',
        '4.3',
        '4.4',
        '5.0.2',
        '5.1',
        '6.0',
        '7.0',
        '8.0',
        '9.0',
        '10.0',
        '11.0',
      ],
      deviceModels = [
        'M2004J19C',
        'S2020X3',
        'Xiaomi4S',
        'RedmiNote9',
        'SamsungS21',
        'GooglePixel5',
      ],
      buildVersions = [
        'RP1A.200720.011',
        'RP1A.210505.003',
        'RP1A.210812.016',
        'QKQ1.200114.002',
        'RQ2A.210505.003',
      ],
      selectedModel = deviceModels[Math.floor(Math.random() * deviceModels.length)],
      selectedBuild = buildVersions[Math.floor(Math.random() * buildVersions.length)],
      chromeVersion = `Chrome/${Math.floor(80 * Math.random()) + 1}.${Math.floor(999 * Math.random()) + 1}.${Math.floor(9999 * Math.random()) + 1}`
    return `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(9 * Math.random()) + 1}.${Math.floor(9 * Math.random()) + 1}`
  },
  getValidIPv4 = ip => {
    const match =
      !ip ||
      ip.match(
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/
      )
    if (match) {
      if (match[5]) {
        const mask = parseInt(match[5], 10)
        let [a, b, c, d] = ip.split('.').map(x => parseInt(x, 10))
        const max = (1 << (32 - mask)) - 1
        return (
          (d += Math.floor(Math.random() * max)),
          (c += Math.floor(d / 256)),
          (d %= 256),
          (b += Math.floor(c / 256)),
          (c %= 256),
          (a += Math.floor(b / 256)),
          (b %= 256),
          `${a}.${b}.${c}.${d}`
        )
      }
      return ip
    }
  }
export class BingImageCreator {
  static HEADERS = {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'content-type': 'application/x-www-form-urlencoded',
    referrer: 'https://www.bing.com/images/create/',
    origin: 'https://www.bing.com',
    'user-agent': fakeUserAgent() || generateRandomUserAgent(),
    'x-forwarded-for': getValidIPv4(generateRandomIP()) || generateRandomIP(),
  }
  constructor({ cookie }) {
    if (((this._cookie = `_U=${cookie}`), !this._cookie)) throw new Error('Bing cookie is required')
  }
  async fetchRedirectUrl(url, formData) {
    const response = await fetchUndici(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        cookie: this._cookie,
        ...BingImageCreator.HEADERS,
      },
      body: formData,
      redirect: 'manual',
    })
    if (response.ok) throw new Error('Request failed')
    {
      const redirect_url = response.headers.get('location').replace('&nfy=1', ''),
        request_id = redirect_url.split('id=')[1]
      return {
        redirect_url: redirect_url,
        request_id: request_id,
      }
    }
  }
  async fetchResult(encodedPrompt, redirect_url, request_id) {
    console.log('redirect_url is ', redirect_url), console.log('request_id is ', request_id)
    const cookie = this._cookie
    try {
      await fetchUndici(`${BING_URL}${redirect_url}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          cookie: cookie,
          ...BingImageCreator.HEADERS,
        },
      })
    } catch (e) {
      throw new Error(`Request redirect_url failed" ${e.message}`)
    }
    const getResultUrl = `${BING_URL}/images/create/async/results/${request_id}?q=${encodedPrompt}`,
      start_wait = Date.now()
    let result = ''
    for (;;) {
      if ((console.log('Waiting for result...'), Date.now() - start_wait > 2e5))
        throw new Error('Timeout')
      if ((await sleep(1e3), (result = await this.getResults(getResultUrl)), result)) break
    }
    return this.parseResult(result)
  }
  async getResults(getResultUrl) {
    const response = await fetchUndici(getResultUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        cookie: this._cookie,
        ...BingImageCreator.HEADERS,
      },
    })
    if (200 !== response.status) throw new Error('Bad status code')
    const content = await response.text()
    return !content || content.includes('errorMessage') ? null : content
  }
  parseResult(result) {
    console.log('Parsing result...')
    const normal_image_links = [...result.matchAll(/src="([^"]*)"/g)]
        .map(match => match[1])
        .map(link => link.split('?w=')[0]),
      safe_image_links = normal_image_links.filter(link => !/r.bing.com\/rp/i.test(link))
    safe_image_links.length !== normal_image_links.length &&
      console.log('Detected & Removed bad images')
    const unique_image_links = [...new Set(safe_image_links)]
    if (0 === unique_image_links.length) throw new Error('error_no_images')
    return unique_image_links
  }
  async fetchRedirectUrlWithRetry(url, formData, retries = 30) {
    for (let i = 0; i < retries; i++)
      try {
        return await this.fetchRedirectUrl(url, formData)
      } catch (error) {
        if ((console.log(`retry ${i + 1} time`), i === retries - 1))
          throw new Error(`Max retries reached: ${error.message}`)
      }
  }
  async fetchResultWithRetry(encodedPrompt, redirect_url, request_id, retries = 30) {
    for (let i = 0; i < retries; i++)
      try {
        return await this.fetchResult(encodedPrompt, redirect_url, request_id)
      } catch (error) {
        if ((console.log(`retry ${i + 1} time`), i === retries - 1))
          throw new Error(`Max retries reached: ${error.message}`)
      }
  }
  async getResultsWithRetry(getResultUrl, retries = 30) {
    for (let i = 0; i < retries; i++)
      try {
        return await this.getResults(getResultUrl)
      } catch (error) {
        if ((console.log(`retry ${i + 1} time`), i === retries - 1))
          throw new Error(`Max retries reached: ${error.message}`)
      }
  }
  async createImage(prompt) {
    const encodedPrompt = encodeURIComponent(prompt)
    let formData = new FormData()
    formData.append('q', encodedPrompt),
      formData.append('qa', 'ds'),
      console.log('Sending request...')
    const url = `${BING_URL}/images/create?q=${encodedPrompt}&rt=3&FORM=GENCRE`
    try {
      const { redirect_url, request_id } = await this.fetchRedirectUrlWithRetry(url, formData)
      return this.fetchResultWithRetry(encodedPrompt, redirect_url, request_id)
    } catch (e) {
      return (
        console.log('retry 1 time'),
        this.fetchRedirectUrlWithRetry(url, formData)
          .then(res => this.fetchResultWithRetry(encodedPrompt, res.redirect_url, res.request_id))
          .catch(e => {
            throw new Error(`${e.message}`)
          })
      )
    }
  }
}

export default BingImageCreator
