import express from 'express';
import _ from 'lodash';
import Quotly from '../func/tools/quotly.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { mediaUrl, senderId, senderName, senderPhotoUrl, messageText, replyMessage } = req.body;

  const json = {
    type: 'quote',
    format: 'png',
    backgroundColor: '#e7ffdd',
    width: 512,
    height: 768,
    scale: 2,
    messages: [_.omitBy({
      entities: [],
      avatar: true,
      from: {
        id: senderId,
        name: senderName,
        photo: {
          url: senderPhotoUrl
        }
      },
      text: messageText,
      replyMessage: replyMessage || undefined,
      media: {
        url: `https://wsrv.nl/?url=${encodeURIComponent(mediaUrl)}&output=png`
      }
    }, _.isUndefined)]
  };

  try {
    const buffer = await Quotly(json);
    if (buffer) {
      const base64Image = buffer.toString('base64');
      res.json({ image: base64Image });
    } else {
      res.status(500).send('Failed to generate image.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
