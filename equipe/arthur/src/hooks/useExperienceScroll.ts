import { useEffect, type MutableRefObject } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ScrollOptions = {
  reducedMotion: boolean
  progressRef: MutableRefObject<number>
  setActiveChapter: (chapter: number) => void
}

export function useExperienceScroll({ reducedMotion, progressRef, setActiveChapter }: ScrollOptions) {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))

    if (reducedMotion) {
      sections.forEach((section) => {
        section.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => {
          node.style.opacity = '1'
          node.style.transform = 'none'
        })
      })
      return
    }

    const lenis = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      anchors: { offset: -88, duration: 1.05 },
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    const updateLenis = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      sections.forEach((section, index) => {
        const revealItems = section.querySelectorAll('[data-reveal]')

        ScrollTrigger.create({
          trigger: section,
          start: 'top 56%',
          end: 'bottom 42%',
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        })

        if (revealItems.length) {
          gsap.fromTo(
            revealItems,
            { autoAlpha: 0, y: 42 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.05,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 74%',
                once: true,
              },
            },
          )
        }
      })
    })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      context.revert()
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [progressRef, reducedMotion, setActiveChapter])
}
