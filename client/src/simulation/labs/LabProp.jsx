// Required imports for Three.js React components:
// - Html, Text, etc → from '@react-three/drei'
// - useFrame, useThree → from '@react-three/fiber'
// - useState, useRef, etc → from 'react'
// - THREE → from 'three'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useGestureStore from '../../store/useGestureStore'

export default function LabProp({
  id,
  position = [0, 1, 0],
  color = '#88aaff',
  shape = 'beaker',
  label = 'Object',
  info = '',
  onInspect,
  children
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [grabbed, setGrabbed] = useState(false)
  const originalPos = useRef(new THREE.Vector3(...position))
  const currentPos = useRef(new THREE.Vector3(...position))

  const {
    gesture, worldX, worldY, worldZ,
    grabbedObjectId, isGrabbing,
    setGrabbedObject, releaseObject
  } = useGestureStore()

  const isThisGrabbed = grabbedObjectId === id

  useFrame(() => {
    if (!groupRef.current) return

    const cursorPos = new THREE.Vector3(worldX, worldY, worldZ)
    const distToCursor = groupRef.current.position
      .distanceTo(cursorPos)

    // Grab when pinch is near
    if (
      distToCursor < 1.5 &&
      (gesture === 'pinch' || gesture === 'grab') &&
      !grabbedObjectId
    ) {
      setGrabbedObject(id)
      setGrabbed(true)
    }

    if (isThisGrabbed && isGrabbing) {
      // Follow hand
      currentPos.current.lerp(
        new THREE.Vector3(worldX, worldY + 0.2, worldZ + 0.5),
        0.2
      )
      groupRef.current.position.copy(currentPos.current)
      groupRef.current.rotation.y += 0.02
    } else if (isThisGrabbed && gesture === 'open') {
      releaseObject()
      setGrabbed(false)
    } else if (!isThisGrabbed) {
      // Float back to original slowly
      currentPos.current.lerp(originalPos.current, 0.03)
      groupRef.current.position.copy(currentPos.current)
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onInspect?.({ id, label, info, color })}
    >
      {children}

      {/* Highlight ring when hovered */}
      {hovered && !isThisGrabbed && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.3, 0.38, 32]} />
          <meshStandardMaterial
            color={color} emissive={color}
            emissiveIntensity={1} transparent opacity={0.7}
          />
        </mesh>
      )}

      {/* Grab glow */}
      {isThisGrabbed && (
        <pointLight color={color} intensity={3} distance={2} />
      )}

      {/* Label on hover */}
      {(hovered || isThisGrabbed) && (
        <Html 
          position={[0, 0.8, 0]} 
          center 
          transform
          occlude
          distanceFactor={6}
        >
          <div style={{
            background: 'rgba(6,8,15,0.92)',
            border: `1px solid ${color}`,
            borderRadius: '6px',
            padding: '4px 12px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: color,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontWeight: 700,
            boxShadow: `0 4px 12px rgba(0,0,0,0.5)`
          }}>
            {isThisGrabbed ? '✊' : '👌'} {label}
          </div>
        </Html>
      )}
    </group>
  )
}
