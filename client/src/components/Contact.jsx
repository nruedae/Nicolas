import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import api from '../utils/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      await api.post('/contact', form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="py-24 px-6 bg-slate-50 dark:bg-slate-800/50"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Have a project in mind or just want to say hi? My inbox is always open.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 border border-slate-100 dark:border-slate-700"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4 text-sm font-medium">
              <FiCheckCircle size={18} /> Message sent! I'll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-4 text-sm font-medium">
              <FiAlertCircle size={18} /> Something went wrong. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-full transition-colors"
          >
            {status === 'loading' ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <><FiSend size={16} /> Send Message</>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
