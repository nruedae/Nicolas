import { motion } from 'framer-motion'
import { FiCode, FiCoffee, FiHeart } from 'react-icons/fi'

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-6 bg-white dark:bg-slate-900"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Avatar / Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-2xl">
              <span className="text-8xl font-bold text-white select-none">N</span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Hi! I'm Nicolas, a passionate full-stack developer who loves building
              beautiful, functional web applications. I enjoy turning complex problems
              into elegant, user-friendly solutions.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies, contributing
              to open-source projects, or enjoying a good cup of coffee while reading
              about the latest in software engineering.
            </p>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: <FiCode size={20} />, label: 'Clean Code' },
                { icon: <FiCoffee size={20} />, label: 'Coffee Driven' },
                { icon: <FiHeart size={20} />, label: 'Open Source' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
