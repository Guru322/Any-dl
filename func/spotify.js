import axios from 'axios'
import { Buffer } from 'buffer'
import dotenv from 'dotenv'

dotenv.config()

class Spotify {
  constructor() {
    this.var1 = null
  }

  async func1() {
    try {
      const var2 = "adbbc3f9631e42d8b42103a72e447d94"
      const var3 = "0d396473ffe94f259f0d716dcc83638c"

      if (!var2 || !var3) {
        throw new Error('Client ID or Client Secret is missing')
      }

      const var4 = Buffer.from(`${var2}:${var3}`).toString('base64')

      const var5 = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
          headers: {
            Authorization: `Basic ${var4}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      if (var5.data.access_token) {
        this.var1 = var5.data.access_token
        return {
          creator: 'Guru sensei',
          status: true,
          data: var5.data,
        }
      } else {
        return {
          creator: 'Guru sensei',
          status: false,
          msg: "Can't generate token!",
        }
      }
    } catch (e) {
      return {
        creator: 'Guru sensei',
        status: false,
        msg: e.response ? e.response.data : e.message,
      }
    }
  }

  func2(ms) {
    const var6 = Math.floor(ms / 6e4)
    const var7 = ((ms % 6e4) / 1e3).toFixed(0)
    return var6 + ':' + (var7 < 10 ? '0' : '') + var7
  }
  //getInfo
  async func3(url) {
    try {
      if (!this.var1) {
        await this.func1()
      }

      const var8 = await axios.get(`https://api.spotify.com/v1/tracks/${url.split('track/')[1]}`, {
        headers: {
          Authorization: `Bearer ${this.var1}`,
        },
      })

      return {
        creator: 'Guru sensei',
        status: true,
        data: {
          thumbnail: var8.data.album.images[0]?.url,
          title: `${var8.data.artists[0]?.name} - ${var8.data.name}`,
          artist: var8.data.artists[0],
          duration: this.func2(var8.data.duration_ms),
          preview: var8.data.preview_url,
        },
      }
    } catch (e) {
      return {
        creator: 'Guru sensei',
        status: false,
        msg: e.message,
      }
    }
  }
  //search
  async func4(query, type = 'track', limit = 20) {
    try {
      if (!this.var1) {
        await this.func1()
      }

      const var9 = await axios.get(
        `https://api.spotify.com/v1/search?query=${query}&type=${type}&offset=0&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.var1}`,
          },
        }
      )

      if (!var9.data.tracks.items || var9.data.tracks.items.length < 1) {
        return {
          creator: 'Guru sensei',
          status: false,
          msg: 'Music not found!',
        }
      }

      const var10 = var9.data.tracks.items.map(v => ({
        title: `${v.album.artists[0]?.name} - ${v.name}`,
        duration: this.func2(v.duration_ms),
        popularity: `${v.popularity}%`,
        preview: v.preview_url,
        url: v.external_urls.spotify,
      }))

      return {
        creator: 'Guru sensei',
        status: true,
        data: var10,
      }
    } catch (e) {
      return {
        creator: 'Guru sensei',
        status: false,
        msg: e.message,
      }
    }
  }
  //download
  async func5(url) {
    try {
      const var11 = (/track/.test(url) ? url.split('track/')[1] : url.split('playlist/')[1]).trim()

      if (/playlist/.test(url)) {
        const var12 = await axios.get(`https://api.spotifydown.com/metadata/playlist/${var11}`, {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
            Origin: 'https://spotifydown.com',
            Referer: 'https://spotifydown.com/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        })

        if (!var12.data.success) {
          return {
            creator: 'Guru sensei',
            status: false,
            msg: "Can't get playlist metadata!",
          }
        }

        const var13 = await axios.get(`https://api.spotifydown.com/trackList/playlist/${var11}`, {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
            Origin: 'https://spotifydown.com',
            Referer: 'https://spotifydown.com/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        })

        if (!var13.data.success || var13.data.trackList.length < 1) {
          return {
            creator: 'Guru sensei',
            status: false,
            msg: 'Failed to get playlist',
          }
        }

        const var14 = var13.data.trackList.map(v => ({
          cover: v.cover,
          title: v.title,
          artists: v.artists,
          album: v.album,
          url: `https://open.spotify.com/track/${v.id}`,
        }))

        return {
          creator: 'Guru sensei',
          status: true,
          data: {
            cover: var12.data.cover,
            title: var12.data.title,
          },
          tracks: var14,
        }
      } else {
        const var15 = await this.func3(url)
        if (!var15.status) return var15

        const var16 = await axios.get(`https://api.spotifydown.com/download/${var11}`, {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
            Origin: 'https://spotifydown.com',
            Referer: 'https://spotifydown.com/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        })

        return var16.data.success && var16.data.link
          ? {
              creator: 'Guru sensei',
              status: true,
              data: {
                ...var15.data,
                url: var16.data.link,
              },
            }
          : {
              creator: 'Guru sensei',
              status: false,
              msg: 'Failed to get file link',
            }
      }
    } catch (e) {
      return {
        creator: 'Guru sensei',
        status: false,
        msg: e.message,
      }
    }
  }
}

export default Spotify
