import { useMemo } from 'react'

export function useWebGLSupport() {
  return useMemo(() => {
    try {
      const canvas = document.createElement('canvas')
      return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2'))
    } catch {
      return false
    }
  }, [])
}
