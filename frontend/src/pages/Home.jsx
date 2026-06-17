import { Trophy, ArrowRight, Activity, Cpu, Database } from 'lucide-react'
import heroImg from '../assets/hero-bg.png'
import philosophyImg from '../assets/philosophy.png'
import ConfigurationEngine from '../components/ConfigurationEngine'
import TechDetails from '../components/TechDetails'
import { useLanguage } from '../i18n/LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Formula 1 racing car" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 bg-primary text-on-primary text-xs font-bold uppercase tracking-[0.08em] mb-6">
              {t('hero.badge')}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-on-surface leading-[1.05] tracking-[-0.04em] mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-secondary mb-8 leading-relaxed max-w-lg">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#predictor" className="bg-primary text-on-primary text-sm font-semibold px-10 py-4 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {t('hero.ctaPredict')}<ArrowRight className="w-4 h-4" />
              </a>
              <a href="#about" className="border-2 border-on-surface text-on-surface text-sm font-semibold px-10 py-4 hover:bg-on-surface hover:text-white transition-all text-center">
                {t('hero.ctaArchive')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Logic Section */}
      <section className="py-24 bg-surface-lowest">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <h2 className="text-4xl font-bold text-on-surface mb-6 tracking-[-0.02em]">{t('ai.title')}</h2>
              <div className="space-y-8">
                <div className="border-l-4 border-primary pl-6">
                  <div className="text-4xl font-bold text-primary mb-1">{t('ai.accuracy')}</div>
                  <p className="text-secondary">{t('ai.accuracyDesc')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-6">
                    <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{t('ai.dataPoints')}</div>
                    <div className="text-2xl font-bold text-on-surface">2.8B+</div>
                  </div>
                  <div className="bg-surface-container p-6">
                    <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{t('ai.latency')}</div>
                    <div className="text-2xl font-bold text-on-surface">14ms</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <div className="bg-white p-2 border border-surface-variant shadow-sm aspect-video overflow-hidden relative group">
                <div className="w-full h-full bg-surface-low flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Activity className="w-16 h-16 text-primary/20 mx-auto" />
                    <div className="flex justify-center gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-1.5 bg-primary/30 rounded-full" style={{ height: `${16 + Math.sin(i * 0.5) * 20 + Math.random() * 12}px` }} />
                      ))}
                    </div>
                    <p className="text-xs text-secondary uppercase tracking-widest">{t('ai.telemetryDashboard')}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Activity className="w-16 h-16 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, titleKey: 'features.neural.title', descKey: 'features.neural.desc' },
              { icon: Database, titleKey: 'features.data.title', descKey: 'features.data.desc' },
              { icon: Trophy, titleKey: 'features.predict.title', descKey: 'features.predict.desc' },
            ].map((feat, i) => (
              <div key={i} className="group p-8 bg-surface-lowest border border-surface-variant speed-shadow transition-all duration-300">
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{t(feat.titleKey)}</h3>
                <p className="text-sm text-secondary leading-relaxed">{t(feat.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Configuration Engine */}
      <ConfigurationEngine />

      {/* Philosophy Section */}
      <section className="py-32 bg-surface-lowest relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <img src={philosophyImg} alt="Telemetry analysis" className="w-full aspect-[4/5] object-cover border border-surface-variant grayscale" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary flex items-center justify-center p-4">
                  <div className="text-white text-center">
                    <div className="text-3xl font-bold">14</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest">{t('philosophy.globalNodes')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] block mb-6">{t('philosophy.label')}</span>
              <h2 className="text-4xl font-bold text-on-surface mb-8 leading-tight tracking-[-0.02em]">{t('philosophy.title')}</h2>
              <div className="space-y-6 text-secondary text-lg leading-relaxed">
                <p>{t('philosophy.p1')}</p>
                <p>{t('philosophy.p2')}</p>
                <p>{t('philosophy.p3')}</p>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="w-12 h-[1px] bg-primary" />
                <div className="text-sm font-semibold uppercase tracking-widest text-on-surface">{t('philosophy.engineered')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Details */}
      <TechDetails />

      {/* Footer */}
      <footer className="bg-surface-container border-t border-surface-variant w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 max-w-[1280px] mx-auto">
          <div className="text-2xl font-bold text-on-surface tracking-tighter">APEX VELOCITY</div>
          <div className="flex flex-wrap justify-center gap-8">
            {['footer.privacy', 'footer.terms', 'footer.cookie', 'footer.contact'].map((key) => (
              <a key={key} href="#" className="text-xs font-bold text-secondary hover:text-on-surface transition-all uppercase tracking-wider">{t(key)}</a>
            ))}
          </div>
          <div className="text-xs font-bold text-secondary uppercase opacity-80 max-w-xs text-center md:text-right">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  )
}
