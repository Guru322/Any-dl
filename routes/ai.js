import { bing, gpt4 } from '../func/ai.js'
import blackbox from '../func/blackbox.js'
import AIUncensored from '../func/darkgpt.js'

import express from 'express'

const router = express.Router()
let darky = new AIUncensored()

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

export default router
