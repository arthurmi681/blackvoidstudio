import { useEffect, useState } from 'react'

type LoadingScreenProps = {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(7)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const started = performance.now()
    const timeouts: number[] = []
    let finishRequested = false

    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 92) return value
        const step = value < 45 ? 9 : value < 75 ? 5 : 2
        return Math.min(92, value + step)
      })
    }, 90)

    const finish = () => {
      if (finishRequested) return
      finishRequested = true
      const wait = Math.max(0, 900 - (performance.now() - started))

      timeouts.push(window.setTimeout(() => {
        window.clearInterval(timer)
        setProgress(100)
        timeouts.push(window.setTimeout(() => {
          setLeaving(true)
          timeouts.push(window.setTimeout(onComplete, 600))
        }, 160))
      }, wait))
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })

    // Garante a saída mesmo se o evento load já tiver ocorrido entre o render e o effect.
    timeouts.push(window.setTimeout(finish, 1200))

    return () => {
      window.clearInterval(timer)
      timeouts.forEach(window.clearTimeout)
      window.removeEventListener('load', finish)
    }
  }, [onComplete])

  return (
    <div className={`loader ${leaving ? 'loader--leaving' : ''}`} role="status" aria-live="polite">
      <div className="loader__brand">SIGNAL / VOID</div>
      <div className="loader__center">
        <span className="loader__label">Establishing connection</span>
        <div className="loader__line" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
      <div className="loader__meta">
        <span>{progress.toString().padStart(3, '0')}%</span>
        <span>Arthur Miyazaki · 2026</span>
      </div>
    </div>
  )
}
