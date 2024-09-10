import axios from "axios";

/*
  Created by https://github.com/ztrdiamond !
  Source: https://whatsapp.com/channel/0029VagFeoY9cDDa9ulpwM0T
  "Aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/

async function igdl(url) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!/^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[a-zA-Z0-9_-]+\/?.*/.test(url)) reject("invalid url input!");
      const headers = { headers: { contentType: "application/json", origin: "https://publer.io", referer: "https://publer.io/" }};
      axios.post("https://app.publer.io/hooks/media", {
        iphone: false,
        url
      }, headers).then(async res => {
        const task_id = res.data.job_id;
        const task = async() => (await axios.get("https://app.publer.io/api/v1/job_status/" + task_id, headers)).data;
        async function process() {
          const { status, payload } = await task()
          if(status === "complete") {
            if(payload[0].error) return reject(payload[0].error)
            const media = payload.map(d => ({
              type: d.type,
              url: d.path,
              thumb: d.thumbnail
            }))
            return resolve({
              success: true,
              media
            })
          }
          setTimeout(process, 1000);
        }
        await process()
      }).catch(e => reject(e))
    })
  } catch (e) {
    return {
      success: false,
      errors: [e]
    }
  }
}

export default igdl;

