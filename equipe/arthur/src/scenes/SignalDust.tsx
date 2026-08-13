import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SignalDust() {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const data = new Float32Array(180 * 3)
    let seed = 9173
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    for (let index = 0; index < 180; index += 1) {
      data[index * 3] = (random() - 0.5) * 15
      data[index * 3 + 1] = (random() - 0.5) * 11
      data[index * 3 + 2] = (random() - 0.5) * 5 - 1
    }
    return data
  }, [])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.006
    points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f2f0e8" size={0.012} transparent opacity={0.16} depthWrite={false} />
    </points>
  )
}
