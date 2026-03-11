import { motion } from 'framer-motion'
import {
  FiCode, FiDatabase, FiServer, FiTool,
} from 'react-icons/fi'

const SKILL_GROUPS = [
  {
    category: 'Frontend',
    icon: <FiCode size={20} />,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  },
  {
    category: 'Backend',
    icon: <FiServer size={20} />,
    skills: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'WebSockets'],
  },
  {
    category: 'Databases',
    icon: <FiDatabase size={20} />,
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Mongoose'],
  },
  {
    category: 'Tools & DevOps',
    icon: <FiTool size={20} />,
    skills: ['Git', 'Docker', 'Linux', 'CI/CD', 'Nginx', 'Vercel'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 px-6 bg-white dark:bg-slate-900"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Skills
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Technologies and tools I work with regularly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {SKILL_GROUPS.map(({ category, icon, skills }, groupIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                {icon}
                <span>{category}</span>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {skills.map(skill => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants}
                    className="px-3 py-1.5 text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 font-medium shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
