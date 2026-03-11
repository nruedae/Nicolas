import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 overflow-hidden group"
    >
      {/* Color header */}
      <div className={`h-2 ${project.color}`} />

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label={`${project.title} GitHub`}
            >
              <FiGithub size={16} /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label={`${project.title} live demo`}
            >
              <FiExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
