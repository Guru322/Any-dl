import getipdetails from '../func/search/ipsearch.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  const ip = req.query.ip
  if (!ip) return res.json({ creator: 'Guru sensei', status: false, msg: 'ip is required' })
  try {
    const result = await getipdetails(ip)
    res.json({ creator: 'Guru sensei', result })
  } catch (error) {
    res.status(500).json({ creator: 'Guru sensei', status: false, msg: 'Internal Server Error' })
  }
})

export default router
