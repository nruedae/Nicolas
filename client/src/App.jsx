import { useTheme } from './hooks/useTheme'
import { useScrollSpy } from './hooks/useScrollSpy'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'contact']

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const activeSection = useScrollSpy(SECTIONS)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
