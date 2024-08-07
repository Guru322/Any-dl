import Spotify from '../func/spotify.js'
import express from 'express'

const router = express.Router()
const spotify = new Spotify()

router.get('/', async (req, res) => {
  const query = req.query.url
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'url is required' })
  const spotdl = await spotify.func5(query)
  res.json(spotdl)
})

export default router
