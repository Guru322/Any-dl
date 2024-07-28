import fetch from "node-fetch";
import cheerio from "cheerio";


export default function fbvdl(url) {
    return new Promise(async (e, a) => {
      const i = await fetch("https://www.getfvid.com/downloader", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "https://www.getfvid.com/"
          },
          body: new URLSearchParams(Object.entries({
            url: url
          }))
        }),
        o = cheerio.load(await i.text());
      e({
        result: {
          creator: "Guru sensei",
          url: url,
          title: o("body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a").text(),
          time: o("#time").text(),
          hd: o("body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a").attr("href"),
          sd: o("body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a").attr("href"),
          audio: o("body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(3) > a").attr("href")
        }
      });
    });
  }

