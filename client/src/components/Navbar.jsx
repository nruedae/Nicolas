import { useState } from 'react'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ isDark, toggleTheme, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#hero" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Nicolas
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                activeSection === href.slice(1)
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {label}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                activeSection === href.slice(1)
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
