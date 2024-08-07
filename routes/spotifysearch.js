import Spotify from '../func/spotify.js'
import express from 'express'

const router = express.Router()
const spotify = new Spotify()

router.get('/', async (req, res) => {
  const query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'Query is required' })
  const search = await spotify.func4(query)
  res.json(search)
})

export default router
