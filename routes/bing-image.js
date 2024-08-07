import BingImageCreator from '../func/bing.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.query
  if (!query)
    return res.json({
      creator: 'Guru sensei',
      status: false,
      msg: 'query is required',
    })
  const bingImage = new BingImageCreator({
    cookie: process.env.BING_COOKIE,
  })
  let results = await bingImage.createImage(query)
  res.json({
    creator: 'Guru sensei',
    status: true,
    results,
  })
})

export default router
