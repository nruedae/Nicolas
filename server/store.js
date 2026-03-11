/**
 * Simple JSON file store — swap for a real DB in production.
 */
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '../data')

function readStore(name) {
  const file = path.join(DATA_DIR, `${name}.json`)
  if (!fs.existsSync(file)) return {}
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return {}
  }
}

function writeStore(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`)
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = { readStore, writeStore }
