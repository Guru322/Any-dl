import axios from 'axios'
import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'
import * as pg from 'pg'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL variable is not set')
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
})

const Conversation = sequelize.define(
  'Conversation',
  {
    username: { type: DataTypes.STRING, allowNull: false },
    messages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: 'conversations',
    timestamps: true,
  }
)

async function syncDatabase() {
  try {
    await sequelize.sync({ force: false })
    console.log('Database synchronized successfully.')
  } catch (err) {
    console.error('Error synchronizing the database:', err)
  }
}

syncDatabase()

async function bing(username, query) {
  try {
    const userMessage = { role: 'user', content: query }

    let conversation = await Conversation.findOne({ where: { username } })
    if (!conversation) {
      conversation = await Conversation.create({ username, messages: [] })
    }

    const messages = conversation.messages.concat(userMessage)
    conversation.messages = messages

    const response = await axios.post(
      'https://nexra.aryahcr.cc/api/chat/complements',
      {
        messages: [
          { role: 'assistant', content: 'Hello! How can I help you today? 😊' },
          ...messages,
        ],
        conversation_style: 'Balanced',
        markdown: false,
        stream: false,
        model: 'Bing',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    let result = null
    let err = null

    if (typeof response.data === 'object') {
      if (response.data.code === 200 && response.data.status === true) {
        result = response.data
      } else {
        err = response.data
      }
    } else {
      try {
        const parsedData = JSON.parse(response.data.slice(response.data.indexOf('{')))
        if (parsedData.code === 200 && parsedData.status === true) {
          result = parsedData
        } else {
          err = parsedData
        }
      } catch (e) {
        err = {
          code: 500,
          status: false,
          error: 'INTERNAL_SERVER_ERROR',
          message: 'general (unknown) error',
        }
      }
    }

    if (err) {
      console.error(err)
      return "Sorry, I couldn't process your request at the moment."
    } else {
      const botMessage = result.message
      conversation.messages.push({ role: 'assistant', content: botMessage })
      await conversation.save()
      return botMessage
    }
  } catch (error) {
    console.error('Error:', error)
    return "Sorry, I couldn't process your request at the moment."
  }
}

async function gpt4(username, prompt) {
  try {
    const userMessage = { role: 'user', content: prompt }

    let conversation = await Conversation.findOne({ where: { username } })
    if (!conversation) {
      conversation = await Conversation.create({ username, messages: [] })
    }

    const messages = conversation.messages.concat(userMessage)
    conversation.messages = messages

    const data = {
      messages: [{ role: 'assistant', content: 'Hello! How are you today?' }, ...messages],
      prompt: prompt,
      model: 'GPT-4',
      markdown: false,
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await axios.post('https://nexra.aryahcr.cc/api/chat/gpt', data, config)

    if (response.status === 200) {
      const botMessage = response.data.gpt
      conversation.messages.push({ role: 'assistant', content: botMessage })
      await conversation.save()
      return botMessage
    } else {
      console.error('Error:', response.statusText)
      return "Sorry, I couldn't process your request at the moment."
    }
  } catch (error) {
    console.error('Error:', error)
    return "Sorry, I couldn't process your request at the moment."
  }
}

export { bing, gpt4 }
