import igdl from '../func/igdl.js'
import express from 'express'
import igdl2 from '../func/igdl2.js'

const router = express.Router()

router.get('/v1/igdl', async (req, res) => {
  const query = req.query.url
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'url is required' })
  const igdownload = await igdl(query)
  res.json(igdownload)
})

router.get('/v2/igdl', async (req, res) => {
  const query = req.query.url
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'url is required' })
  const igdownload = await igdl2(query)
  res.json(igdownload)
})


export default router
