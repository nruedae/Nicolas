require('dotenv').config()
const express = require('express')
const cors = require('cors')
const contactRoute = require('./routes/contact')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/contact', contactRoute)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
