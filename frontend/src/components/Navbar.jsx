import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { t, lang, toggleLang } = useLanguage()

  const links = [
    { href: '#home', id: 'home', labelKey: 'nav.home' },
    { href: '#predictor', id: 'predictor', labelKey: 'nav.predict' },
    { href: '#about', id: 'about', labelKey: 'nav.about' },
  ]

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = ['about', 'predictor', 'home']
      let current = 'home'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) { current = id; break }
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-surface border-b border-surface-variant transition-all duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="flex justify-between items-center h-16 px-6 max-w-[1280px] mx-auto">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => scrollTo(e, '#home')}
          className="text-2xl font-bold text-primary tracking-tighter"
        >
          APEX VELOCITY
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-10 items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className={`text-base font-medium transition-colors ${
                activeSection === link.id
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        {/* Right side: Lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors border border-surface-variant px-3 py-1.5"
            title={lang === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{lang === 'en' ? 'ID' : 'EN'}</span>
          </button>
          <a
            href="#predictor"
            onClick={(e) => scrollTo(e, '#predictor')}
            className="bg-primary-container text-on-primary-container text-sm font-semibold px-6 py-2 uppercase tracking-widest hover:brightness-110 transition-all"
          >
            {t('nav.startPrediction')}
          </a>
        </div>

        {/* Mobile: lang toggle + menu */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-semibold text-secondary border border-surface-variant px-2 py-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{lang === 'en' ? 'ID' : 'EN'}</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-on-surface p-2"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-variant bg-surface">
          <div className="px-6 py-4 space-y-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`block text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? 'text-primary font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {t(link.labelKey)}
              </a>
            ))}
            <a
              href="#predictor"
              onClick={(e) => scrollTo(e, '#predictor')}
              className="block mt-4 bg-primary-container text-on-primary-container text-sm font-semibold px-6 py-3 uppercase tracking-widest text-center"
            >
              {t('nav.startPrediction')}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
