import { removebg } from "../func/tools/removebg.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ creator: "Guru sensei", status: false, msg: "url is required" });

    try {
        const imageBuffer = await removebg(url);
        res.set("Content-Type", "image/png");  
        res.send(imageBuffer); 
    } catch (error) {
        res.status(500).json({ creator: "Guru sensei", status: false, msg: "Failed to process the image", error: error.message });
    }
});

export default router;
