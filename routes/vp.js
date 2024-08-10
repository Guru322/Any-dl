import Vadapav from '../func/vadapav.js'
import express from 'express'

const router = express.Router()
let vadapav = new Vadapav()

router.get('/search', async (req, res) => {
  const query = req.query.query
  if (!query)
    return res.json({
      creator: 'Guru sensei',
      status: false,
      msg: 'query is required',
    })
  const result = await vadapav.search(query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/download', async (req, res) => {
  const id = req.query.id
  if (!id)
    return res.json({
      creator: 'Guru sensei',
      status: false,
      msg: 'id is required',
    })
  const result = await vadapav.download(id)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

export default router
