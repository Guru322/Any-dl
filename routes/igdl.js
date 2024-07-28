import igdl from "../func/igdl.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const query = req.query.url;
    if (!query) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" });
    const igdownload = await igdl(query);
    res.json(igdownload);
})

export default router;