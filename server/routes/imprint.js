/**
 * Imprint API routes
 *
 * POST /api/imprint/scan         — AI-powered business card scanner
 * POST /api/imprint/profile      — Create / update user's digital card
 * GET  /api/imprint/profile/:id  — Get a profile (for NFC / QR sharing)
 * POST /api/imprint/contacts     — Save a scanned contact
 * GET  /api/imprint/contacts     — List all saved contacts
 */

const express = require('express')
const { body, param, validationResult } = require('express-validator')
const Anthropic = require('@anthropic-ai/sdk')
const { v4: uuidv4 } = require('uuid')
const { readStore, writeStore } = require('../store')

const router = express.Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Helpers ────────────────────────────────────────────────────────────────

function validate(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return false
  }
  return true
}

// ─── POST /scan ──────────────────────────────────────────────────────────────
// Accepts a base64-encoded image of a business card.
// Returns OCR-extracted fields + an AI-generated "quick snapshot" summary.

router.post(
  '/scan',
  body('image').notEmpty().withMessage('Base64 image is required'),
  body('mediaType').optional().isString(),
  async (req, res) => {
    if (!validate(req, res)) return

    const { image, mediaType = 'image/jpeg' } = req.body

    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: image },
              },
              {
                type: 'text',
                text: `You are an AI assistant for a B2B sales networking app called Imprint.

Analyze this business card image and return a JSON object with the following structure:
{
  "name": "Full name",
  "title": "Job title",
  "company": "Company name",
  "email": "email@example.com",
  "phone": "phone number or null",
  "linkedin": "linkedin URL or null",
  "website": "website URL or null",
  "summary": "A 2-3 sentence quick snapshot for a sales rep: who this person is, their role scope, and one useful talking point or conversation angle. Be specific and actionable.",
  "tags": ["array", "of", "relevant", "industry", "tags"]
}

Return ONLY valid JSON, no markdown, no explanation.`,
              },
            ],
          },
        ],
      })

      // Extract text block (thinking blocks are separate)
      const textBlock = response.content.find(b => b.type === 'text')
      if (!textBlock) throw new Error('No text in response')

      let parsed
      try {
        parsed = JSON.parse(textBlock.text.trim())
      } catch {
        // Claude sometimes wraps in ```json — strip it
        const match = textBlock.text.match(/```(?:json)?\s*([\s\S]*?)```/)
        parsed = match ? JSON.parse(match[1].trim()) : { raw: textBlock.text }
      }

      res.json({ ok: true, card: parsed })
    } catch (err) {
      console.error('Scan error:', err.message)
      if (err instanceof Anthropic.AuthenticationError) {
        return res.status(401).json({ error: 'Invalid Anthropic API key' })
      }
      if (err instanceof Anthropic.RateLimitError) {
        return res.status(429).json({ error: 'Rate limited, try again shortly' })
      }
      res.status(500).json({ error: 'Failed to analyze card' })
    }
  },
)

// ─── POST /profile ───────────────────────────────────────────────────────────
// Create or update a user's shareable digital card profile.

router.post(
  '/profile',
  [
    body('name').trim().notEmpty(),
    body('title').trim().notEmpty(),
    body('company').trim().notEmpty(),
    body('email').isEmail(),
    body('phone').optional().isString(),
    body('linkedin').optional().isURL(),
    body('website').optional().isURL(),
    body('bio').optional().isString(),
    body('color').optional().isString(),
  ],
  (req, res) => {
    if (!validate(req, res)) return

    const profiles = readStore('profiles')
    // Use provided id or generate a new one
    const id = req.body.id || uuidv4()
    const now = new Date().toISOString()

    profiles[id] = {
      id,
      ...req.body,
      updatedAt: now,
      createdAt: profiles[id]?.createdAt || now,
    }

    writeStore('profiles', profiles)
    res.json({ ok: true, profile: profiles[id] })
  },
)

// ─── GET /profile/:id ────────────────────────────────────────────────────────
// Public endpoint — served when someone taps an NFC card or scans a QR code.

router.get(
  '/profile/:id',
  param('id').isUUID(),
  (req, res) => {
    if (!validate(req, res)) return

    const profiles = readStore('profiles')
    const profile = profiles[req.params.id]
    if (!profile) return res.status(404).json({ error: 'Profile not found' })

    res.json({ ok: true, profile })
  },
)

// ─── POST /contacts ──────────────────────────────────────────────────────────
// Save a contact (typically after scanning their card).

router.post(
  '/contacts',
  [
    body('name').trim().notEmpty(),
    body('event').optional().isString(),
    body('notes').optional().isString(),
  ],
  (req, res) => {
    if (!validate(req, res)) return

    const contacts = readStore('contacts')
    const id = uuidv4()
    const now = new Date().toISOString()

    contacts[id] = {
      id,
      ...req.body,
      savedAt: now,
    }

    writeStore('contacts', contacts)
    res.json({ ok: true, contact: contacts[id] })
  },
)

// ─── GET /contacts ───────────────────────────────────────────────────────────
// Return all saved contacts, newest first.

router.get('/contacts', (_req, res) => {
  const contacts = readStore('contacts')
  const list = Object.values(contacts).sort(
    (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
  )
  res.json({ ok: true, contacts: list })
})

module.exports = router
