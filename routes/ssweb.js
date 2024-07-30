import ssweb from "../func/tools/screenshot.js";
import express from 'express';

const router = express.Router();

router.get("/", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" });
    const result = await ssweb(url);
    res.setHeader('Content-Type', 'image/png');
    res.send(result);
})

export default router;