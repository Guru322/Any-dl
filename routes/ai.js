import {bing, gpt4} from '../func/ai.js';
import express from 'express';

const router = express.Router();

router.get('/bing', async (req, res) => {
    let username = req.query.username
    let query = req.query.query;
    if (!username) return res.json({creator: "Guru sensei", status: false, msg: "username is required"})
    if (!query) return res.json({ creator: "Guru sensei", status: false, msg: "query is required" });
    const result = await bing(username,query);
    res.json({creator: "Guru sensei", status: true, msg: result})
});

router.get('/gpt4', async(req, res) => {
    let username = req.query.username
    let query = req.query.query;
    if (!username) return res.json({creator: "Guru sensei", status: false, msg: "username is required"})
    if (!query) return res.json({ creator: "Guru sensei", status: false, msg: "query is required" });
    const result = await gpt4(username,query)
    res.json({creator: "Guru sensei", status: true, msg: result})
})

export default router