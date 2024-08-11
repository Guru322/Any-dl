import axios from "axios";
import _ from "lodash";

class Ytdl2 {
  constructor() {
    this.baseUrl = "https://tomp3.cc/api/ajax";
    this.headers = {
      accept: "*/*",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Origin": "https://tomp3.cc",
      "Connection": "keep-alive",
      "Referer": "https://tomp3.cc/youtube-downloader/8uioXLxzy4w"
    };
  }

  async fetchVideoData(videoUrl) {
    const requestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/search`,
      headers: this.headers,
      data: `query=${encodeURIComponent(videoUrl)}`,
    };
    try {
      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      console.error("Error fetching video data:", error);
      throw new Error("Request failed");
    }
  }

  formatVideoData(data, { type, quality }) {
    const formattedData = [];

    const processFormat = (format) => {
      formattedData.push({
        videoId: data.vid,
        formatId: format.k,
        fileSize: format.size,
        videoQuality: format.q,
        fileType: format.f,
      });
    };

    _.forOwn(data.links.mp4, processFormat);
    processFormat(data.links.mp3?.mp3128);
    processFormat(data.links["3gp"]?.["3gp@144p"]);

    return _.filter(
      formattedData,
      (format) =>
        (type ? format.fileType === type : true) &&
        (quality ? format.videoQuality === quality : true)
    );
  }

  async downloadMedia(videoId, formatId) {
    const requestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/convert`,
      headers: {
        ...this.headers,
        "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
      },
      data: `vid=${videoId}&k=${encodeURIComponent(formatId)}`,
    };
    try {
      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      console.error("Error downloading media:", error);
      throw new Error("Request failed");
    }
  }

  async ytaud(videoUrl) {
    try {
      const videoData = await this.fetchVideoData(videoUrl);
      const [audioFormat] = this.formatVideoData(videoData, {
        type: "mp3",
      });
      const { formatId, videoId } = audioFormat || {};
      const downloadResponse =
        formatId && videoId ? await this.downloadMedia(videoId, formatId) : {};
      return {
        creator: "Guru sensei",
        ...downloadResponse,
        fileSize: audioFormat?.fileSize,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/0.jpg`,
      };
    } catch (error) {
      console.error("Failed to get audio download link:", error);
      throw new Error("Failed to get audio");
    }
  }

  async ytvid(videoUrl, quality = "480p") {
    try {
      const videoData = await this.fetchVideoData(videoUrl);
      const [videoFormat] = this.formatVideoData(videoData, {
        type: "mp4",
        quality: quality,
      });
      const { formatId, videoId } = videoFormat || {};
      const downloadResponse =
        formatId && videoId ? await this.downloadMedia(videoId, formatId) : {};
      return {
        creator: "Guru sensei",
        ...downloadResponse,
        fileSize: videoFormat?.fileSize,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/0.jpg`,
      };
    } catch (error) {
      console.error("Failed to get video download link:", error);
      throw new Error("Failed to get video");
    }
  }
}

export default Ytdl2;

