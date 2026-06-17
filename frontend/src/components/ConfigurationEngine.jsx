import { useState, useEffect, useRef } from 'react'
import { Loader2, Trophy, TrendingUp, MapPin, RefreshCw } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const API_BASE = 'http://localhost:5000'

export default function ConfigurationEngine() {
  const { t } = useLanguage()
  const [constructors, setConstructors] = useState([])
  const [circuits, setCircuits] = useState([])
  const [years, setYears] = useState([])
  const [form, setForm] = useState({ grid_position: 1, constructor_id: '', circuit_id: '', year: 2024 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [countUp, setCountUp] = useState(0)
  const [weather, setWeather] = useState('DRY')
  const animRef = useRef(null)
  const resultRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/constructors`).then((r) => r.json()),
      fetch(`${API_BASE}/api/circuits`).then((r) => r.json()),
      fetch(`${API_BASE}/api/years`).then((r) => r.json()),
    ])
      .then(([c, ci, y]) => {
        setConstructors(c); setCircuits(ci); setYears(y)
        if (c.length > 0) setForm((f) => ({ ...f, constructor_id: c[0][0] }))
        if (ci.length > 0) setForm((f) => ({ ...f, circuit_id: ci[0][0] }))
        if (y.length > 0) setForm((f) => ({ ...f, year: y[y.length - 1] }))
      })
      .catch(() => setError(t('config.errorLoad')))
  }, [])

  useEffect(() => {
    if (!result) return
    const target = result.predicted_points; setCountUp(0); let start = 0
    const duration = 800; const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime; const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3); start = Math.round(eased * target); setCountUp(start)
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [result])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid_position: parseInt(form.grid_position), constructor_id: parseInt(form.constructor_id), circuit_id: parseInt(form.circuit_id), year: parseInt(form.year) }),
      })
      const data = await res.json()
      if (data.success) { setResult(data); setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
      else { setError(data.error || 'Prediction failed') }
    } catch { setError(t('config.errorNetwork') + ' ' + API_BASE) }
    finally { setLoading(false) }
  }

  const selectedCircuit = circuits.find(([id]) => String(id) === String(form.circuit_id))
  const circuitName = selectedCircuit ? selectedCircuit[1] : 'Circuit'

  const getPointBadge = (pts) => {
    if (pts >= 25) return t('result.raceWinner')
    if (pts >= 18) return t('result.podium')
    if (pts >= 12) return t('result.top5')
    if (pts >= 6) return t('result.pointsFinish')
    if (pts >= 1) return t('result.scraper')
    return t('result.noPoints')
  }

  const getGroupLabel = (group) => {
    const keys = ['result.frontRow', 'result.top5', 'result.top5', 'result.midfield', 'result.lowerMidfield', 'result.backmarker']
    return t(keys[group])
  }

  return (
    <section className="py-24 bg-white scroll-mt-16" id="predictor">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-on-surface mb-4 tracking-[-0.02em]">{t('config.title')}</h2>
          <p className="text-secondary max-w-xl mx-auto">{t('config.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Left: Form */}
          <div className="lg:col-span-2 bg-surface-low p-6 md:p-10 border border-surface-variant">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">{t('config.gridPosition')}</label>
                  <input type="number" name="grid_position" min="1" max="22" value={form.grid_position} onChange={handleChange} className="w-full bg-white border-0 border-b border-surface-variant focus:border-primary focus:ring-0 px-0 py-3 text-base text-on-surface transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">{t('config.constructor')}</label>
                  <select name="constructor_id" value={form.constructor_id} onChange={handleChange} className="w-full bg-white border-0 border-b border-surface-variant focus:border-primary focus:ring-0 px-0 py-3 text-base text-on-surface transition-all">
                    {constructors.map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">{t('config.circuitProfile')}</label>
                  <select name="circuit_id" value={form.circuit_id} onChange={handleChange} className="w-full bg-white border-0 border-b border-surface-variant focus:border-primary focus:ring-0 px-0 py-3 text-base text-on-surface transition-all">
                    {circuits.map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">{t('config.season')}</label>
                  <select name="year" value={form.year} onChange={handleChange} className="w-full bg-white border-0 border-b border-surface-variant focus:border-primary focus:ring-0 px-0 py-3 text-base text-on-surface transition-all">
                    {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">{t('config.weather')}</label>
                <div className="flex gap-4 pt-2">
                  {['DRY', 'INTER', 'WET'].map((w) => (
                    <button key={w} type="button" onClick={() => setWeather(w)} className={`flex-1 py-2 border text-xs font-bold uppercase tracking-wider transition-colors ${weather === w ? 'border-primary bg-primary text-white' : 'border-surface-variant hover:border-primary text-secondary'}`}>{w}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-surface-variant border-dashed gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-full">
                    <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-on-surface">{loading ? t('config.processing') : result ? t('config.complete') : t('config.awaiting')}</div>
                    <div className="text-xs text-secondary">Feed: FIA — {loading ? t('config.feedActive') : t('config.feedStandby')}</div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="bg-on-surface text-white text-xs font-bold px-8 py-3 uppercase tracking-wider hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> {t('config.running')}</>) : (<><Trophy className="w-4 h-4" /> {t('config.runPrediction')}</>)}
                </button>
              </div>
            </form>

            {error && (<div className="mt-6 p-4 bg-error-container border border-error/20"><p className="text-error text-sm">{error}</p></div>)}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1 space-y-2" ref={resultRef}>
            <div className="bg-white border border-surface-variant p-8">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{t('config.activeProfile')}</div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">{circuitName.toUpperCase()}</h3>
              <p className="text-secondary text-sm mb-6 leading-relaxed">{t('config.circuitReady')}</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-sm mb-1"><span className="text-secondary">{t('config.gripLevel')}</span><span className="font-bold text-on-surface">LOW</span></div>
                  <div className="h-1 bg-surface-container"><div className="h-1 bg-primary w-1/3" /></div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm mb-1"><span className="text-secondary">{t('config.overtaking')}</span><span className="font-bold text-on-surface">EXTREME</span></div>
                  <div className="h-1 bg-surface-container"><div className="h-1 bg-primary w-[95%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm mb-1"><span className="text-secondary">{t('config.tireWear')}</span><span className="font-bold text-on-surface">MODERATE</span></div>
                  <div className="h-1 bg-surface-container"><div className="h-1 bg-primary w-1/2" /></div>
                </div>
              </div>
            </div>
            <div className="bg-primary p-8 text-on-primary">
              <div className="text-xs font-bold uppercase tracking-wider mb-2">{t('config.nnState')}</div>
              <div className="text-2xl font-bold italic mb-4 tracking-tighter">{t('config.nnOptimal')}</div>
              <div className="text-xs opacity-80">{t('config.nnDesc')}</div>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && !loading && (
          <div className="mt-8 space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-surface-lowest border border-surface-variant overflow-hidden">
              <div className="relative p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="text-center">
                    <div className="text-8xl font-black text-on-surface leading-none">{countUp}</div>
                    <p className="text-sm text-secondary mt-2 uppercase tracking-wider">{t('result.predictedPoints')}</p>
                    <p className="text-xs text-secondary/60 mt-1">{t('result.raw')}: {result.raw_prediction}</p>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-bold uppercase tracking-wider border-primary/30 text-primary bg-primary/5">
                      <Trophy className="w-3 h-3" />{getPointBadge(result.predicted_points)}
                    </span>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between sm:justify-start sm:gap-8"><span className="text-secondary">{t('result.grid')}:</span><span className="text-on-surface font-semibold">P{result.details.grid_position}</span></div>
                      <div className="flex justify-between sm:justify-start sm:gap-8"><span className="text-secondary">{t('result.group')}:</span><span className="text-on-surface font-semibold">{getGroupLabel(result.details.grid_group)}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-surface-variant p-4">
                <div className="flex items-center gap-1">
                  {[0,1,2,4,6,8,10,12,15,18,25].map((p) => (
                    <div key={p} className={`flex-1 text-center py-1.5 text-xs font-bold transition-all duration-500 ${p === result.predicted_points ? 'bg-primary text-white' : 'bg-surface-container text-secondary/50'}`}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-lowest border border-surface-variant p-4 text-center speed-shadow transition-all">
                <TrendingUp className="w-4 h-4 text-primary mx-auto mb-2" /><p className="text-lg font-bold text-on-surface">{result.details.constructor_avg}</p><p className="text-xs text-secondary mt-1">{t('result.teamAvg')}</p>
              </div>
              <div className="bg-surface-lowest border border-surface-variant p-4 text-center speed-shadow transition-all">
                <TrendingUp className="w-4 h-4 text-primary mx-auto mb-2" /><p className="text-lg font-bold text-on-surface">{result.details.constructor_year_avg}</p><p className="text-xs text-secondary mt-1">{t('result.seasonAvg')}</p>
              </div>
              <div className="bg-surface-lowest border border-surface-variant p-4 text-center speed-shadow transition-all">
                <MapPin className="w-4 h-4 text-primary mx-auto mb-2" /><p className="text-lg font-bold text-on-surface">{result.details.circuit_avg}</p><p className="text-xs text-secondary mt-1">{t('result.circuitAvg')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
