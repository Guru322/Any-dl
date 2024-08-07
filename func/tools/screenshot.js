import axios from 'axios'

async function ssweb(url) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${url}`
    )
    const siteData = response.data
    const dataURL = siteData.lighthouseResult?.fullPageScreenshot?.screenshot?.data
    const base64Data = dataURL.replace(/^data:image\/webp;base64,/, '')
    return Buffer.from(base64Data, 'base64')
  } catch (e) {
    throw new Error('Failed to fetch Buffer')
  }
}

export default ssweb
