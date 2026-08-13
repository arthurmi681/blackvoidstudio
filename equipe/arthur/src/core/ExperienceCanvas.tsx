import { useState, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { SignalThread } from '../scenes/SignalThread'
import { SignalDust } from '../scenes/SignalDust'

const LOOK_AT = new THREE.Vector3(0, 0, 0)

type ExperienceCanvasProps = {
  progressRef: MutableRefObject<number>
  subtleEffects?: boolean
}

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  useFrame(({ camera }, delta) => {
    const progress = progressRef.current
    const targetX = Math.sin(progress * Math.PI * 2.4) * 0.5
    const targetY = (0.5 - progress) * 0.28
    const targetZ = 7.1 - Math.sin(progress * Math.PI) * 0.4
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3, delta)
    camera.lookAt(LOOK_AT)
  })
  return null
}

function Experience({ progressRef, subtleEffects }: ExperienceCanvasProps) {
  return (
    <>
      <CameraRig progressRef={progressRef} />
      <ambientLight color="#11131a" intensity={0.28} />
      <directionalLight color="#fff3e6" intensity={2.1} position={[4, 5, 3]} />
      <directionalLight color="#8da4c7" intensity={0.45} position={[-5, 2, 2]} />
      <directionalLight color="#567f4b" intensity={0.85} position={[0, 3, -5]} />
      <SignalDust />
      <SignalThread progressRef={progressRef} />
      {subtleEffects && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.24} luminanceThreshold={0.68} luminanceSmoothing={0.22} mipmapBlur />
          <Vignette eskil={false} offset={0.18} darkness={0.35} />
        </EffectComposer>
      )}
    </>
  )
}

export function ExperienceCanvas({ progressRef, subtleEffects = true }: ExperienceCanvasProps) {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 1.65))

  return (
    <div className="webgl-layer" aria-hidden="true" inert>
      <Canvas
        dpr={dpr}
        camera={{ fov: 36, position: [0, 0, 7.1], near: 0.1, far: 40 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.65))}
        >
          <Experience progressRef={progressRef} subtleEffects={subtleEffects} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
