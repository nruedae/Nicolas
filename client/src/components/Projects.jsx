import ProjectCard from './ProjectCard'

const PROJECTS = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion. Features dark mode, smooth scrolling, and a contact form.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
    github: 'https://github.com',
    demo: 'https://example.com',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce app with product catalog, shopping cart, user authentication, and Stripe payment integration.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Prisma'],
    github: 'https://github.com',
    demo: 'https://example.com',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  },
  {
    title: 'Real-Time Chat App',
    description: 'WebSocket-powered chat application supporting multiple rooms, file sharing, and message history with persistent storage.',
    tech: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Redis'],
    github: 'https://github.com',
    demo: null,
    color: 'bg-gradient-to-r from-orange-500 to-rose-500',
  },
  {
    title: 'Task Management API',
    description: 'RESTful API for task management with JWT authentication, role-based access control, and comprehensive documentation.',
    tech: ['Node.js', 'Express', 'JWT', 'PostgreSQL', 'Swagger'],
    github: 'https://github.com',
    demo: null,
    color: 'bg-gradient-to-r from-sky-500 to-blue-500',
  },
  {
    title: 'Weather Dashboard',
    description: 'Interactive weather dashboard with location search, 7-day forecasts, and beautiful data visualizations using Chart.js.',
    tech: ['React', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
    github: 'https://github.com',
    demo: 'https://example.com',
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
  },
  {
    title: 'CLI Dev Tools',
    description: 'A collection of productivity CLI tools for developers: project scaffolding, git helpers, and automated code formatting.',
    tech: ['Node.js', 'Commander.js', 'Inquirer', 'Chalk'],
    github: 'https://github.com',
    demo: null,
    color: 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-24 px-6 bg-slate-50 dark:bg-slate-800/50"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Projects
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A selection of things I've built. Each project taught me something new.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
