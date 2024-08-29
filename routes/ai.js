import { bing, gpt4 } from '../func/ai.js'
import blackbox from '../func/blackbox.js'
import AIUncensored from '../func/darkgpt.js'
import AiSearch from '../func/ai-search.js'
import morphic from '../func/morph.js'
import fetch from 'node-fetch';
import imagine from '../func/imagine.js';

import express from 'express'

const router = express.Router()
let darky = new AIUncensored()
let aisearch = new AiSearch()

router.get('/bing', async (req, res) => {
  let username = req.query.username
  let query = req.query.query
  if (!username)
    return res.json({ creator: 'Guru sensei', status: false, msg: 'username is required' })
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await bing(username, query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/gpt4', async (req, res) => {
  let username = req.query.username
  let query = req.query.query
  if (!username)
    return res.json({ creator: 'Guru sensei', status: false, msg: 'username is required' })
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await gpt4(username, query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/blackbox', async (req, res) => {
  let query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await blackbox(query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/darkgpt', async (req, res) => {
  let query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await darky.Chat(query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/search', async (req, res) => {
  let query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await aisearch.ask(query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/morphic', async (req, res) => {
  let query = req.query.query
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' })
  const result = await morphic(query)
  res.json({ creator: 'Guru sensei', status: true, msg: result })
})

router.get('/imagine', async (req, res) => {
  let query = req.query.query;
  if (!query) return res.json({ creator: 'Guru sensei', status: false, msg: 'query is required' });

  try {
      let imageUrl = imagine(query);

      let response = await fetch(imageUrl);

      if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      res.setHeader('Content-Type', response.headers.get('Content-Type'));
      response.body.pipe(res);
  } catch (error) {
      console.error(`Error fetching image: ${error.message}`); // Log any errors
      res.status(500).json({ creator: 'Guru sensei', status: false, msg: error.message });
  }
});

export default router
