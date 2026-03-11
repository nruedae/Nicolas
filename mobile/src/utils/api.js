import axios from 'axios'

// Update this to your server's IP when testing on a physical device
// e.g., 'http://192.168.1.10:5000/api'
const BASE_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://your-production-server.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s — Claude vision can take a moment
  headers: { 'Content-Type': 'application/json' },
})

export const scanCard = (imageBase64, mediaType = 'image/jpeg') =>
  api.post('/imprint/scan', { image: imageBase64, mediaType })

export const saveContact = (contact) =>
  api.post('/imprint/contacts', contact)

export const getContacts = () =>
  api.get('/imprint/contacts')

export const saveProfile = (profile) =>
  api.post('/imprint/profile', profile)

export const getProfile = (id) =>
  api.get(`/imprint/profile/${id}`)

export default api
