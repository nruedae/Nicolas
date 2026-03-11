import { motion } from 'framer-motion'
import { FiArrowDown } from 'react-icons/fi'

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-2xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-4"
        >
          Hello, I'm
        </motion.p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-4">
          Nicolas
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 mb-8"
        >
          Full-Stack Developer &amp; Creative Problem Solver
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-colors"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold rounded-full transition-colors"
          >
            Get In Touch
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FiArrowDown size={24} />
        </motion.div>
      </motion.a>
    </section>
  )
}
