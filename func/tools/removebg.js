import fetch from 'node-fetch'
import crypto from 'crypto'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'
import axios from 'axios'

const randomBytes = crypto.randomBytes(8).toString('base64').replace(/[/+=]/g, '')

const removebg = async input => {
  try {
    let media, mime
    if (Buffer.isBuffer(input)) {
      media = input
      ;({ mime } = (await fileTypeFromBuffer(input)) || { mime: 'image/jpg' })
    } else {
      const response = await fetch(input)
      media = await response.arrayBuffer()
      ;({ mime } = (await fileTypeFromBuffer(media)) || { mime: 'image/jpg' })
    }

    const formData = new FormData()
    formData.append('image', new Blob([media], { type: mime }), `${randomBytes}.jpg`)

    const result = await axios.post('https://api.pixian.ai/api/v2/remove-background', formData, {
      auth: {
        username: 'px3j2tc79h56pfg',
        password: 't01ahvv1cl98liqfa5ac57csf6seho8b47spe4v7kt57hmhr6527',
      },
      responseType: 'arraybuffer',
    })

    return result.data
  } catch (error) {
    console.error('Error:', error)
    throw new Error('An error occurred while processing the image.')
  }
}

export { removebg }
