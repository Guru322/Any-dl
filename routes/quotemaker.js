import express from 'express'
import _ from 'lodash'
import Quotly from '../func/tools/quotly.js'

const router = express.Router()

const validateRequestBody = body => {
  return body && typeof body.senderId === 'string' && typeof body.senderName === 'string'
}

router.post('/', async (req, res) => {
  if (!validateRequestBody(req.body)) {
    return res.status(400).send('Invalid request data.')
  }

  const { senderId, senderName, senderPhotoUrl, messageText, replyMessage } = req.body

  const messageObject = {
    entities: [],
    avatar: true,
    from: {
      id: senderId,
      name: senderName,
      photo: {
        url: senderPhotoUrl,
      },
    },
    text: messageText,
    replyMessage: replyMessage || undefined,
  }

  if (replyMessage && replyMessage.photo && replyMessage.photo.url) {
    messageObject.replyMessage.photo = {
      url: `https://wsrv.nl/?url=${encodeURIComponent(replyMessage.photo.url)}&output=png`,
    }
  }

  const json = {
    type: 'quote',
    format: 'png',
    backgroundColor: '#e7ffdd',
    width: 512,
    height: 768,
    scale: 2,
    messages: [_.omitBy(messageObject, _.isUndefined)],
  }

  try {
    const buffer = await Quotly(json)
    if (buffer) {
      res.set('Content-Type', 'image/png')
      res.send(buffer)
    } else {
      res.status(500).send('Failed to generate image.')
    }
  } catch (error) {
    console.error('Quotly Error:', error.message)
    res.status(500).send('Internal Server Error')
  }
})

export default router
