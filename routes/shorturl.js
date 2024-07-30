import { bitly, tinyurl } from "../func/tools/shortenlink.js";
import express from "express";

const router = express.Router();

router.get("/bitly", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" });
    const result = await bitly(url);
    res.json({ creator: "Guru sensei", status: true, result });
});

router.get("/tinyurl", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" });
    const result = await tinyurl(url);
    res.json({ creator: "Guru sensei", status: true, result });
});

export default router;

