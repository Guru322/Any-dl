import xnxxDownloader from "../func/xnxx.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const query = req.query.url;
    if (!query) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" });
    const xdownload = await xnxxDownloader(query);
    res.json(xdownload);
}
)

export default router;