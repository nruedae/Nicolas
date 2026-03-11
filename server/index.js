require('dotenv').config()
const express = require('express')
const cors = require('cors')
const contactRoute = require('./routes/contact')
const imprintRoute = require('./routes/imprint')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' })) // images need higher limit

app.use('/api/contact', contactRoute)
app.use('/api/imprint', imprintRoute)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
