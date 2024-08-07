import { getVideo, getTrending } from '../func/hanime.js'
import express from 'express'

const router = express.Router()

router.get('/trend', async (req, res) => {
  const time = req.query.time || 'week'
  const page = req.query.page || 1
  const trending = await getTrending(time, page)
  res.json(trending)
})

router.get('/video', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ creator: 'Guru sensei', status: false, msg: 'url is required' })
  const video = await getVideo(url)
  res.json(video)
})

export default router
