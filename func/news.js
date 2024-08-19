import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function ndtv() {
    const response = await fetch('https://www.ndtv.com/latest#pfrom=home-ndtv_nav_wap', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Referer': 'https://www.ndtv.com/',
            'Connection': 'keep-alive',
            'Priority': 'u=0, i'
        }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const news = [];

    $(".news_Itm").each((i, el) => {
        const title = $(el).find("a").text().trim();
        const link = $(el).find("a").attr("href");
        const description = $(el).find(".newsCont").text().trim(); 
        news.push({ title, link, description });
    });

    return news;
}

export default ndtv;