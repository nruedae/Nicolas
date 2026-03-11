import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'

const SOCIAL = [
  { icon: <FiGithub size={20} />, href: 'https://github.com', label: 'GitHub' },
  { icon: <FiLinkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: <FiTwitter size={20} />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <FiMail size={20} />, href: 'mailto:hello@example.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="py-10 px-6 bg-slate-900 dark:bg-slate-950 text-slate-400">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Nicolas. Built with React &amp; ❤️
        </p>

        <div className="flex gap-4">
          {SOCIAL.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-indigo-400 transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
