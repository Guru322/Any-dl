import express from 'express';
import cors from 'cors';
import spotifySearch from './routes/spotifysearch.js';
import spotifyDl from './routes/spotifydl.js';
import Igs from './routes/ig-story.js';
import igdown from './routes/igdl.js';
import xdownl from './routes/xdown.js';
import fvid from './routes/fb-video.js';
import apksearch from './routes/apk-mirror.js';
import xnsearch from './routes/xnxx-search.js';
import xnxxdl from './routes/xnxxdl.js';
import platstor from './routes/playstore.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ creator: "Guru sensei", status: true, msg: "Server is running" }, null, 2);
});

app.use('/spotifysearch', spotifySearch);
app.use('/spotifydl', spotifyDl);
app.use('/igs', Igs);
app.use('/igdl', igdown);
app.use('/xdown', xdownl);
app.use('/fbvideo', fvid);
app.use('/apksearch', apksearch);
app.use('/xnxxsearch', xnsearch);
app.use('/xnxxdl', xnxxdl);
app.use('/playstore', platstor);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});