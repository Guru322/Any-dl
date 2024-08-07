import PlayStore from '../func/search/playstore.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await PlayStore(query)
  res.json(result)
})

export default router
