import ndtv from "../func/news.js";
import express from 'express';

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const result = await ndtv()
        res.json({ creator: 'Guru sensei', result })
    } catch (error) {
        res.status(500).json({ creator: 'Guru sensei', status: false, msg: 'Internal Server Error' })
    }
});
export default router