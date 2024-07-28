import fbvdl from '../func/fbvideo.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
    const query = req.query.url
    if (!query) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" })
    const fbdownload = await fbvdl(query)
    res.json(fbdownload)
})

export default router