import { Brain, Database, Cpu, Lightbulb } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function TechDetails() {
  const { t } = useLanguage()

  const cards = [
    { icon: Database, titleKey: 'tech.dataset', itemsKey: 'tech.datasetItems' },
    { icon: Cpu, titleKey: 'tech.architecture', itemsKey: 'tech.architectureItems' },
    { icon: Brain, titleKey: 'tech.features', itemsKey: 'tech.featuresItems' },
    { icon: Lightbulb, titleKey: 'tech.output', itemsKey: 'tech.outputItems' },
  ]

  const stats = [
    { value: '48.4%', labelKey: 'tech.exactMatch' },
    { value: '81.1%', labelKey: 'tech.within2' },
    { value: '91.1%', labelKey: 'tech.within4' },
    { value: '1.53', labelKey: 'MAE' },
  ]

  return (
    <section className="py-24 bg-surface-lowest" id="about">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-on-surface mb-4 tracking-[-0.02em]">{t('tech.title')}</h2>
          <p className="text-secondary text-lg max-w-2xl">{t('tech.subtitle')}</p>
        </div>

        {/* Intro */}
        <div className="bg-white border border-surface-variant p-8 mb-12">
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              {t('tech.intro1')} <span className="text-on-surface font-semibold">{t('tech.deepLearning')}</span> {t('tech.intro1End')}
            </p>
            <p>
              {t('tech.intro2')} <span className="text-on-surface font-semibold">{t('tech.pytorch')}</span> {t('tech.intro2End')}
            </p>
          </div>
        </div>

        {/* Tech stack grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {cards.map((card, i) => (
            <div key={i} className="bg-white border border-surface-variant p-8 speed-shadow transition-all duration-300">
              <card.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">{t(card.titleKey)}</h3>
              <ul className="space-y-1.5">
                {t(card.itemsKey).map((item, j) => (
                  <li key={j} className="text-sm text-secondary flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Performance */}
        <div className="bg-white border border-surface-variant p-8">
          <h2 className="text-2xl font-bold text-on-surface mb-6 tracking-[-0.01em]">{t('tech.performance')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-surface-container">
                <div className="text-2xl font-black text-primary">{stat.value}</div>
                <div className="text-xs text-secondary mt-1">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
