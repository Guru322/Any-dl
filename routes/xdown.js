import { xdown } from '../func/xdl.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.url
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'url is required' })
  const xdownload = await xdown(query)
  res.json(xdownload)
})

export default router
