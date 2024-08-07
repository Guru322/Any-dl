import InstagramStory from '../func/ig-story.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.username
  if (!query)
    return res.json({ creator: 'Guru sensei', status: false, msg: 'username is required' })
  const igstory = await InstagramStory(query)
  res.json({ creator: 'Guru sensei', data: igstory })
})

export default router
