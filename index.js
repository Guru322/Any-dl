import cors from 'cors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ai from './routes/ai.js'
import apksearch from './routes/apk-mirror.js'
import bingimg from './routes/bing-image.js'
import fvid from './routes/fb-video.js'
import hanime from './routes/hanime.js'
import Igs from './routes/ig-story.js'
import igdown from './routes/igdl.js'
import ipsearch from './routes/ipsearch.js'
import platstor from './routes/playstore.js'
import quote from './routes/quotemaker.js'
import removbg from './routes/removebg.js'
import shorten from './routes/shorturl.js'
import spotifyDl from './routes/spotifydl.js'
import spotifySearch from './routes/spotifysearch.js'
import screenshot from './routes/ssweb.js'
import ttp from './routes/ttp.js'
import xdownl from './routes/xdown.js'
import xnsearch from './routes/xnxx-search.js'
import xnxxdl from './routes/xnxxdl.js'
import ytdll from './routes/ytdl.js'
import vadapav from './routes/vp.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.set('json spaces', 2)

app.get('/', (req, res) => {
  const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip
  res.json({
    creator: 'Guru sensei',
    status: true,
    msg: 'Server is running',
    yourip: visitorIp,
  })
})

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs', 'index.html'))
})

app.use('/spotifysearch', spotifySearch)
app.use('/spotifydl', spotifyDl)
app.use('/igs', Igs)
app.use('/insta', igdown)
app.use('/xdown', xdownl)
app.use('/fbvideo', fvid)
app.use('/apksearch', apksearch)
app.use('/xnxxsearch', xnsearch)
app.use('/xnxxdl', xnxxdl)
app.use('/playstore', platstor)
app.use('/hanime', hanime)
app.use('/removebg', removbg)
app.use('/shorturl', shorten)
app.use('/ssweb', screenshot)
app.use('/ipsearch', ipsearch)
app.use('/ytdl', ytdll)
app.use('/qc', quote)
app.use('/ai', ai)
app.use('/ttp', ttp)
app.use('/bingimg', bingimg)
app.use('/vadapav', vadapav)

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})
