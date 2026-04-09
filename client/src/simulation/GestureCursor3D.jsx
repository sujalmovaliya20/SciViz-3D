import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useGestureStore from '../store/useGestureStore'

export default function GestureCursor3D({ enabled }) {
  const cursorRef = useRef()
  const ringRef = useRef()
  const ring2Ref = useRef()
  const trailRefs = useRef([])
  const smoothX = useRef(0)
  const smoothY = useRef(0)
  const prevX = useRef(0)
  const prevY = useRef(0)

  useFrame((state, delta) => {
    if (!enabled) return

    const {
      worldX = 0, worldY = 0,
      rightGesture, leftGesture,
      isGrabbing, grabbedObjectId
    } = useGestureStore.getState()

    // Smooth follow - fast and responsive
    smoothX.current += (worldX - smoothX.current) * 0.4
    smoothY.current += (worldY - smoothY.current) * 0.4

    const x = smoothX.current
    const y = smoothY.current
    const z = -2

    // Velocity for trail
    const vx = x - prevX.current
    const vy = y - prevY.current
    prevX.current = x
    prevY.current = y

    // Main cursor
    if (cursorRef.current) {
      cursorRef.current.position.set(x, y, z)
    }

    // Ring
    if (ringRef.current) {
      ringRef.current.position.set(x, y, z)
      ringRef.current.rotation.z += delta * 
        (isGrabbing ? 5 : 1.5)
      const pulse = isGrabbing
        ? 1.3 + Math.sin(state.clock.elapsedTime * 10) * 0.2
        : 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.05
      ringRef.current.scale.setScalar(pulse)
    }

    // Second ring (left hand action indicator)
    if (ring2Ref.current) {
      ring2Ref.current.position.set(x, y, z)
      ring2Ref.current.rotation.z -= delta * 2
      // Show extra ring when left hand is active
      const leftActive = leftGesture && leftGesture !== 'none'
      ring2Ref.current.visible = leftActive
      ring2Ref.current.scale.setScalar(
        leftGesture === 'grab' ? 1.8 :
        leftGesture === 'pinch' ? 2.2 : 1.5
      )
    }

    // Trail positions
    trailRefs.current.forEach((ref, i) => {
      if (!ref) return
      const lag = (i + 1) * 0.1
      ref.position.x += (x - ref.position.x) * (0.4 - lag)
      ref.position.y += (y - ref.position.y) * (0.4 - lag)
      ref.position.z = z
      if (ref.material) {
        ref.material.opacity = Math.max(0, 0.3 - i * 0.05)
      }
    })

    // Dynamic color based on BOTH hands
    const COLORS = {
      // Right hand gesture colors
      pinch: '#ffcc44', grab: '#ffcc44',
      point: '#00e5ff', peace: '#22c55e',
      open: '#00e5ff', none: '#00e5ff'
    }
    // Override with left hand action
    const leftActionColor = {
      grab: '#ff4d6d',
      pinch: '#a855f7',
      open: '#22c55e'
    }
    
    const baseColor = COLORS[rightGesture] || '#00e5ff'
    const actionColor = leftActionColor[leftGesture]
    const finalColor = new THREE.Color(
      actionColor || baseColor
    )

    if (cursorRef.current?.material) {
      cursorRef.current.material.color.lerp(finalColor, 0.25)
      cursorRef.current.material.emissive.lerp(finalColor, 0.25)
      cursorRef.current.material.emissiveIntensity = 
        isGrabbing ? 3 : 
        leftGesture === 'grab' ? 2.5 : 2
    }
    if (ringRef.current?.material) {
      ringRef.current.material.color.lerp(finalColor, 0.25)
      ringRef.current.material.emissive.lerp(finalColor, 0.25)
    }
  })

  if (!enabled) return null

  return (
    <>
      {/* Trail dots */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          ref={el => trailRefs.current[i] = el}
          position={[0, 0, -2]}
        >
          <sphereGeometry args={[0.055 - i*0.008, 8, 8]}/>
          <meshBasicMaterial
            color="#00e5ff"
            transparent opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* MAIN CURSOR - one clean sphere */}
      <mesh ref={cursorRef} position={[0, 0, -2]}>
        <sphereGeometry args={[0.1, 20, 20]}/>
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
        <pointLight color="#00e5ff" intensity={4} distance={6}/>
      </mesh>

      {/* Primary ring - rotates with right hand */}
      <mesh ref={ringRef} position={[0, 0, -2]}>
        <torusGeometry args={[0.22, 0.018, 8, 32]}/>
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.5}
          toneMapped={false}
          transparent opacity={0.8}
        />
      </mesh>

      {/* Secondary ring - shows left hand action */}
      <mesh ref={ring2Ref} position={[0, 0, -2]}>
        <torusGeometry args={[0.35, 0.012, 8, 32]}/>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={2}
          toneMapped={false}
          transparent opacity={0.6}
        />
      </mesh>
    </>
  )
}
