import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uChapter;
  uniform float uEnergy;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float ribbon = sin(uv.x * 18.0 + uTime * 0.16 + uChapter * 1.7);
    float secondary = cos(uv.x * 9.0 - uChapter * 0.85);
    transformed.x += ribbon * (0.055 + uEnergy * 0.12);
    transformed.z += secondary * (0.04 + uEnergy * 0.16);

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uChapter;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    float facing = abs(dot(normalize(vViewDirection), normalize(vNormal)));
    float fresnel = pow(1.0 - clamp(facing, 0.0, 1.0), 2.45);
    float travelling = pow(max(0.0, sin(vUv.x * 78.0 - uTime * 1.5 + uChapter)), 20.0);
    float chapterPulse = 0.55 + 0.45 * sin(uChapter * 2.2 + vUv.x * 6.283);

    vec3 carbon = vec3(0.025, 0.026, 0.025);
    vec3 paper = vec3(0.949, 0.941, 0.910);
    vec3 signal = vec3(0.337, 0.498, 0.294);

    vec3 color = mix(carbon, paper, fresnel * 0.9);
    color = mix(color, signal, travelling * (0.55 + chapterPulse * 0.35));
    float alpha = uOpacity * (0.38 + fresnel * 0.62 + travelling * 0.45);

    gl_FragColor = vec4(color, alpha);
  }
`

type SignalThreadProps = {
  progressRef: MutableRefObject<number>
}

function makeMaterial(opacity: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uChapter: { value: 0 },
      uEnergy: { value: 0.35 },
      uOpacity: { value: opacity },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
}

export function SignalThread({ progressRef }: SignalThreadProps) {
  const group = useRef<THREE.Group>(null)
  const main = useRef<THREE.Mesh>(null)
  const satelliteA = useRef<THREE.Mesh>(null)
  const satelliteB = useRef<THREE.Mesh>(null)
  const nodes = useRef<THREE.InstancedMesh>(null)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.9, -5.2, 0.1),
        new THREE.Vector3(-0.85, -3.6, 0.0),
        new THREE.Vector3(0.5, -2.2, 0.25),
        new THREE.Vector3(-0.45, -0.55, 0.0),
        new THREE.Vector3(0.75, 1.1, -0.15),
        new THREE.Vector3(-0.25, 2.65, 0.1),
        new THREE.Vector3(1.75, 5.1, 0.0),
      ]),
    [],
  )

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 192, 0.035, 7, false), [curve])
  const mainMaterial = useMemo(() => makeMaterial(0.92), [])
  const satelliteMaterialA = useMemo(() => makeMaterial(0.26), [])
  const satelliteMaterialB = useMemo(() => makeMaterial(0.18), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const point = useMemo(() => new THREE.Vector3(), [])
  const nodeCount = 22

  useLayoutEffect(() => {
    if (!nodes.current) return
    for (let index = 0; index < nodeCount; index += 1) {
      curve.getPoint(index / (nodeCount - 1), point)
      dummy.position.copy(point)
      const scale = index % 5 === 0 ? 1.65 : 0.75
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      nodes.current.setMatrixAt(index, dummy.matrix)
    }
    nodes.current.instanceMatrix.needsUpdate = true
  }, [curve, dummy, point])

  useFrame((state, delta) => {
    const progress = progressRef.current
    const chapter = progress * 6
    const time = state.clock.elapsedTime
    const systemsEnergy = THREE.MathUtils.smoothstep(chapter, 1.45, 3.7)
    const fadeAfterSystems = 1 - THREE.MathUtils.smoothstep(chapter, 4.7, 6.0) * 0.55
    const spread = systemsEnergy * fadeAfterSystems

    ;[mainMaterial, satelliteMaterialA, satelliteMaterialB].forEach((material) => {
      material.uniforms.uTime.value = time
      material.uniforms.uChapter.value = chapter
      material.uniforms.uEnergy.value = 0.28 + spread * 0.72
    })

    if (satelliteA.current && satelliteB.current) {
      satelliteA.current.position.x = THREE.MathUtils.damp(satelliteA.current.position.x, spread * 0.62, 4, delta)
      satelliteB.current.position.x = THREE.MathUtils.damp(satelliteB.current.position.x, spread * -0.55, 4, delta)
      satelliteA.current.rotation.y = spread * 0.22
      satelliteB.current.rotation.y = spread * -0.18
    }

    if (group.current) {
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        -0.34 + Math.sin(progress * Math.PI * 2) * 0.18,
        3,
        delta,
      )
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, (progress - 0.5) * 0.34, 3, delta)
      group.current.position.x = THREE.MathUtils.damp(
        group.current.position.x,
        Math.sin(progress * Math.PI * 3) * 0.38,
        3,
        delta,
      )
    }

    if (nodes.current) {
      const material = nodes.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.22 + spread * 0.5 + Math.sin(time * 1.4) * 0.05
    }
  })

  return (
    <group ref={group} scale={0.9}>
      <mesh ref={main} geometry={geometry} material={mainMaterial} />
      <mesh ref={satelliteA} geometry={geometry} material={satelliteMaterialA} scale={0.985} />
      <mesh ref={satelliteB} geometry={geometry} material={satelliteMaterialB} scale={1.015} />
      <instancedMesh ref={nodes} args={[undefined, undefined, nodeCount]}>
        <icosahedronGeometry args={[0.052, 1]} />
        <meshBasicMaterial color="#567f4b" transparent opacity={0.28} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}
