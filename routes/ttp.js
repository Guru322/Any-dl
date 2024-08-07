import express from 'express'
import { ttp } from '../func/tools/text.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { text, color } = req.query
  const results = await ttp(text, color)
  res.json({ creater: 'Guru Sensei', results })
})

export default router
