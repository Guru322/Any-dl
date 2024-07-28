import cheerio from "cheerio";
import fetch from "node-fetch";

async function xnxxSearch(t) {
    return new Promise((n, e) => {
      const r = "https://www.xnxx.health";
      fetch(`${r}/search/${t}/${Math.floor(3 * Math.random()) + 1}`, {
        method: "get"
      }).then(t => t.text()).then(t => {
        let e = cheerio.load(t, {
            xmlMode: !1
          }),
          o = [],
          a = [],
          i = [],
          s = [];
        e("div.mozaique").each(function(t, n) {
          e(n).find("div.thumb").each(function(t, n) {
            a.push(r + e(n).find("a").attr("href").replace("/THUMBNUM/", "/"));
          });
        }), e("div.mozaique").each(function(t, n) {
          e(n).find("div.thumb-under").each(function(t, n) {
            i.push(e(n).find("p.metadata").text()), e(n).find("a").each(function(t, n) {
              o.push(e(n).attr("title"));
            });
          });
        });
        for (let t = 0; t < o.length; t++) s.push({
          title: o[t],
          info: i[t],
          link: a[t]
        });
        n({
          creator: "Guru sensei",
          status: !0,
          result: s
        });
      }).catch(t => e({
        status: !1,
        result: t
      }));
    });
  }
  
export default xnxxSearch;