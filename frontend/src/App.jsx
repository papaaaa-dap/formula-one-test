import { LanguageProvider } from './i18n/LanguageContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-surface">
        <Navbar />
        <main>
          <Home />
        </main>
      </div>
    </LanguageProvider>
  )
}

export default App
