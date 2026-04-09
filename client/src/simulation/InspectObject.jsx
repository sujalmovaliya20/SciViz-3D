import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useGestureStore from '../store/useGestureStore'

export default function InspectObject({ 
  objectId, 
  color, 
  shape, 
  label,
  onClose 
}) {
  const groupRef = useRef()
  const prevLeftPos = useRef({ x: 0.5, y: 0.5 })
  const autoRotate = useRef(true)

  const { 
    inspectRotX, inspectRotY, inspectZoom,
    leftGesture, leftX, leftY,
    updateInspectRotation
  } = useGestureStore()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Get current left hand state
    const store = useGestureStore.getState()
    const lx = store.leftX
    const ly = store.leftY
    const lg = store.leftGesture

    if (lg === 'grab' || lg === 'point') {
      // Left hand grab = rotate object
      autoRotate.current = false
      const dx = lx - prevLeftPos.current.x
      const dy = ly - prevLeftPos.current.y
      
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        updateInspectRotation(dx * 3, dy * 3)
      }
    } else if (lg === 'open') {
      // Open hand = auto rotate
      autoRotate.current = true
    }

    prevLeftPos.current = { x: lx, y: ly }

    // Apply rotation
    const targetRotY = THREE.MathUtils.degToRad(
      useGestureStore.getState().inspectRotY
    )
    const targetRotX = THREE.MathUtils.degToRad(
      useGestureStore.getState().inspectRotX
    )

    if (autoRotate.current) {
      groupRef.current.rotation.y += delta * 0.8
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, targetRotY, 0.15
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, targetRotX, 0.15
      )
    }

    // Apply zoom (distance from camera)
    const zoom = useGestureStore.getState().inspectZoom
    const targetZ = -zoom
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z, targetZ, 0.1
    )

    // Pulse glow
    if (groupRef.current.children[0]) {
      const mesh = groupRef.current.children[0]
      if (mesh.material) {
        mesh.material.emissiveIntensity = 
          0.5 + Math.sin(t * 2) * 0.3
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* The object itself */}
      <mesh>
        {shape === 'sphere' && (
          <sphereGeometry args={[1, 64, 64]}/>
        )}
        {shape === 'box' && (
          <boxGeometry args={[1.5, 1.5, 1.5]}/>
        )}
        {shape === 'torus' && (
          <torusGeometry args={[0.9, 0.3, 32, 64]}/>
        )}
        {shape === 'cylinder' && (
          <cylinderGeometry args={[0.6, 0.6, 1.8, 32]}/>
        )}
        {shape === 'cone' && (
          <coneGeometry args={[0.8, 1.6, 32]}/>
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Inspection UI */}
      <Html position={[0, 2.2, 0]} center distanceFactor={8}>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(6,8,15,0.95)',
            border: `2px solid ${color}`,
            borderRadius: '12px',
            padding: '10px 20px',
            marginBottom: '8px',
            boxShadow: `0 0 20px ${color}44`
          }}>
            <div style={{
              color: color,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '16px',
              marginBottom: '4px'
            }}>
              🔍 {label}
            </div>
            <div style={{
              color: '#4a5a7a',
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px'
            }}>
              INSPECT MODE
            </div>
          </div>

          {/* Gesture instructions */}
          <div style={{
            background: 'rgba(6,8,15,0.88)',
            border: '1px solid #1e2a3a',
            borderRadius: '8px',
            padding: '8px 14px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: '#8899bb',
            lineHeight: 1.9
          }}>
            <div>
              <span style={{color:'#a855f7'}}>✊ Left grab</span>
              {' '}→ Rotate 360°
            </div>
            <div>
              <span style={{color:'#ffcc44'}}>👐 Spread hands</span>
              {' '}→ Zoom in
            </div>
            <div>
              <span style={{color:'#ffcc44'}}>🤏 Close hands</span>
              {' '}→ Zoom out
            </div>
            <div>
              <span style={{color:'#ff4d6d'}}>🤚 Open right</span>
              {' '}→ Exit inspect
            </div>
          </div>
        </div>
      </Html>

      {/* Rotation axis indicators */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.01, 8, 64]}/>
        <meshStandardMaterial
          color={color} transparent opacity={0.2}
        />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.8, 0.01, 8, 64]}/>
        <meshStandardMaterial
          color="#ffffff" transparent opacity={0.15}
        />
      </mesh>

      {/* Point lights for dramatic effect */}
      <pointLight color={color} intensity={3} distance={8}/>
      <pointLight 
        color="#ffffff" intensity={1} distance={6}
        position={[3, 3, 3]}
      />
      <pointLight
        color={color} intensity={1} distance={6}
        position={[-3, -2, 2]}
      />
    </group>
  )
}
