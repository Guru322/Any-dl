import YTDL from '../func/ytdl.js'
import Ytdl2 from '../func/y2mate.js'
import express from 'express'
import ytsearch from '../func/search/yts.js'

let ytdl = new YTDL()
let ytdl2 = new Ytdl2()

const router = express.Router()

router.get('/ytmp3', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ creator: 'Guru sensei', status: false, msg: 'URL is required' })
  const search = await ytdl.ytaudio(url)
  res.json(search)
})

router.get('/ytmp4', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ creator: 'Guru sensei', status: false, msg: 'URL is required' })
  const search = await ytdl.ytvideo(url)
  res.json(search)
})

router.get('/ytsearch', async (req, res) => {
  const query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await ytsearch(query)
  res.json(result)
})

router.get('/v2/ytmp3', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ creator: 'Guru sensei', status: false, msg: 'URL is required' })
  const search = await ytdl2.ytaud(url)
  res.json(search)
});

router.get('/v2/ytmp4', async (req, res) => {
  const url = req.query.url
  if (!url) return res.json({ creator: 'Guru sensei', status: false, msg: 'URL is required' })
  const search = await ytdl2.ytvid(url)
  res.json(search)
});

export default router
