import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { LoadingScreen } from './components/LoadingScreen'
import { Navigation } from './components/Navigation'
import { ChapterRail } from './components/ChapterRail'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Systems } from './sections/Systems'
import { Architecture } from './sections/Architecture'
import { Experience } from './sections/Experience'
import { Human } from './sections/Human'
import { Contact } from './sections/Contact'
import { useMotionPreference } from './hooks/useMotionPreference'
import { useWebGLSupport } from './hooks/useWebGLSupport'
import { useExperienceScroll } from './hooks/useExperienceScroll'

const LazyExperienceCanvas = lazy(() =>
  import('./core/ExperienceCanvas').then((module) => ({ default: module.ExperienceCanvas })),
)

export default function App() {
  const progressRef = useRef(0)
  const [activeChapter, setActiveChapter] = useState(0)
  const [loading, setLoading] = useState(true)
  const [effectsEnabled, setEffectsEnabled] = useState(true)
  const reducedMotion = useMotionPreference()
  const webGLSupported = useWebGLSupport()
  const effectiveReducedMotion = reducedMotion || !effectsEnabled

  const updateChapter = useCallback((chapter: number) => setActiveChapter(chapter), [])
  const finishLoading = useCallback(() => setLoading(false), [])

  useExperienceScroll({
    reducedMotion: effectiveReducedMotion,
    progressRef,
    setActiveChapter: updateChapter,
  })

  useEffect(() => {
    document.body.classList.toggle('is-loading', loading)
    return () => document.body.classList.remove('is-loading')
  }, [loading])

  useEffect(() => {
    if (!loading) window.setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
  }, [loading])

  const showWebGL = webGLSupported && !reducedMotion && effectsEnabled

  return (
    <div className={`app ${showWebGL ? 'app--webgl' : 'app--2d'}`}>
      {loading && <LoadingScreen onComplete={finishLoading} />}

      {showWebGL && (
        <Suspense fallback={null}>
          <LazyExperienceCanvas
            progressRef={progressRef}
            subtleEffects={window.innerWidth > 760 && !window.matchMedia('(prefers-reduced-data: reduce)').matches}
          />
        </Suspense>
      )}

      <div className="ambient-grid" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <Navigation activeChapter={activeChapter} />
      <ChapterRail active={activeChapter} />

      <button
        className="effects-toggle"
        type="button"
        onClick={() => setEffectsEnabled((value) => !value)}
        aria-pressed={effectsEnabled}
        title={effectsEnabled ? 'Reduzir efeitos' : 'Ativar efeitos'}
      >
        <span>FX</span>
        <i className={effectsEnabled && !reducedMotion && webGLSupported ? 'is-on' : ''} />
        <span>{effectsEnabled && !reducedMotion && webGLSupported ? 'ON' : 'OFF'}</span>
      </button>

      {!webGLSupported && (
        <p className="fallback-notice" role="status">Experiência editorial 2D ativa</p>
      )}

      <main id="main">
        <Hero />
        <About />
        <Systems />
        <Architecture />
        <Experience />
        <Human />
        <Contact />
      </main>
    </div>
  )
}
