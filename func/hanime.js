import axios from "axios";
import crypto from "crypto";
import UserAgent from "fake-useragent";

const fetchJsonData = async (url) => {
  try {
    const headers = {
      "X-Signature-Version": "web2",
      "X-Signature": crypto.randomBytes(32).toString("hex"),
      "User-Agent": new UserAgent().random
    };
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

const extractSlug = (url) => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

const getTrending = async (time, page) => {
  const url = `https://hanime.tv/api/v8/browse-trending?time=${time}&page=${page}&order_by=views&ordering=desc`;
  const data = await fetchJsonData(url);
  return data.hentai_videos.map(video => ({
    creator: "Guru Sensei",
    id: video.id,
    name: video.name,
    slug: video.slug,
    cover_url: video.cover_url,
    views: video.views,
    link: `/watch/${video.slug}`
  }));
};

const getVideo = async (url) => {
  const slug = extractSlug(url);
  const videoDataUrl = `https://hanime.tv/api/v8/video?id=${slug}`;
  const videoData = await fetchJsonData(videoDataUrl);
  
  const tags = videoData.hentai_tags.map(tag => ({
    name: tag.text,
    link: `/hentai-tags/${tag.text}/0`
  }));
  
  const streams = videoData.videos_manifest.servers[0]?.streams.map(stream => ({
    width: stream.width,
    height: stream.height,
    size_mbs: stream.filesize_mbs,
    url: stream.url
  }));
  
  const episodes = videoData.hentai_franchise_hentai_videos.map(episode => ({
    id: episode.id,
    name: episode.name,
    slug: episode.slug,
    cover_url: episode.cover_url,
    views: episode.views,
    link: `/watch/${episode.slug}`
  }));
  
  return {
    creator:"Guru Sensei",
    id: videoData.hentai_video.id,
    name: videoData.hentai_video.name,
    description: videoData.hentai_video.description,
    poster_url: videoData.hentai_video.poster_url,
    cover_url: videoData.hentai_video.cover_url,
    views: videoData.hentai_video.views,
    streams,
    tags,
    episodes
  };
};

export { getTrending, getVideo };


