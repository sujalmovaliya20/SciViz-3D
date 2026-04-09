import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useGestureStore from '../store/useGestureStore'

const GRAB_RADIUS = 3.0

export default function GrabbableObject({
  id, initialPosition = [0,0,0],
  color = '#00e5ff', shape = 'sphere',
  label = 'Object', scale = 1, onInspect
}) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isNear, setIsNear] = useState(false)
  const floatOff = useRef(Math.random() * Math.PI * 2)
  const wasGrabbing = useRef(false)

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return

    const store = useGestureStore.getState()
    const {
      worldX, worldY, isGrabbing,
      grabbedObjectId, leftGesture,
      isRotating, rotateX, rotateY
    } = store

    const isThisGrabbed = grabbedObjectId === id

    // PROXIMITY: Check in 2D (ignore Z depth)
    // This is the KEY FIX - don't use Z for distance
    const dx = worldX - groupRef.current.position.x
    const dy = worldY - groupRef.current.position.y
    const dist2D = Math.sqrt(dx*dx + dy*dy)
    const near = dist2D < GRAB_RADIUS

    if (near !== isNear) setIsNear(near)

    // AUTO GRAB: cursor near + right hand pinch/grab
    if (near && isGrabbing && !grabbedObjectId && !isThisGrabbed) {
      useGestureStore.getState().setGrabbedObject(id)
    }

    // RELEASE: right hand opens
    if (isThisGrabbed && 
        (store.rightGesture === 'open' || !isGrabbing) &&
        wasGrabbing.current) {
      useGestureStore.getState().releaseObject()
    }
    wasGrabbing.current = isGrabbing

    if (isThisGrabbed && isGrabbing) {
      // GRABBED: follow cursor
      groupRef.current.position.x += 
        (worldX - groupRef.current.position.x) * 0.3
      groupRef.current.position.y += 
        (worldY + 0.3 - groupRef.current.position.y) * 0.3

      // LEFT HAND ROTATE
      if (isRotating) {
        meshRef.current.rotation.y += 
          (rotateX - 0.5) * delta * 3
        meshRef.current.rotation.x += 
          (rotateY - 0.5) * delta * 2
      } else {
        meshRef.current.rotation.y += delta * 1.5
      }

    } else {
      // FLOAT back to original
      const t = state.clock.elapsedTime
      const baseY = initialPosition[1] +
        Math.sin(t * 0.8 + floatOff.current) * 0.18

      groupRef.current.position.x +=
        (initialPosition[0] - groupRef.current.position.x) * 0.04
      groupRef.current.position.y +=
        (baseY - groupRef.current.position.y) * 0.04
      groupRef.current.position.z +=
        (initialPosition[2] - groupRef.current.position.z) * 0.04

      meshRef.current.rotation.y += delta * 0.4
    }

    // Scale
    const ts = isThisGrabbed ? scale*1.25 : 
               near ? scale*1.12 : scale
    const cs = meshRef.current.scale.x
    meshRef.current.scale.setScalar(cs + (ts-cs)*0.15)

    // Emissive
    if (meshRef.current.material) {
      const te = isThisGrabbed ? 0.9 : near ? 0.5 : 0.15
      meshRef.current.material.emissiveIntensity +=
        (te - meshRef.current.material.emissiveIntensity) * 0.1
    }
  })

  const isThisGrabbed = useGestureStore(
    s => s.grabbedObjectId === id
  )

  return (
    <group
      ref={groupRef}
      position={initialPosition}
      userData={{ grabbable: true, objectId: id }}
    >
      {/* Proximity ring */}
      {isNear && !isThisGrabbed && (
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[GRAB_RADIUS*0.35, 0.025, 8, 32]}/>
          <meshStandardMaterial
            color={color} emissive={color}
            emissiveIntensity={1} transparent opacity={0.35}
          />
        </mesh>
      )}

      {/* Main mesh */}
      <mesh
        ref={meshRef}
        onClick={e => {
          e.stopPropagation()
          onInspect?.({ id, label, color })
        }}
        onPointerEnter={e => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'grab'
        }}
        onPointerLeave={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        {shape==='sphere' && <sphereGeometry args={[0.5,32,32]}/>}
        {shape==='box' && <boxGeometry args={[0.8,0.8,0.8]}/>}
        {shape==='torus' && <torusGeometry args={[0.45,0.15,16,32]}/>}
        {shape==='cylinder' && <cylinderGeometry args={[0.3,0.3,1,16]}/>}
        {shape==='cone' && <coneGeometry args={[0.4,0.9,16]}/>}
        <meshStandardMaterial
          color={color} emissive={color}
          emissiveIntensity={0.15}
          metalness={0.5} roughness={0.3}
        />
      </mesh>

      <pointLight color={color}
        intensity={isThisGrabbed ? 4 : isNear ? 2 : 0.6}
        distance={isThisGrabbed ? 8 : 4}
      />

      {/* Label */}
      {(isNear || isThisGrabbed || hovered) && (
        <Html position={[0, 1.1, 0]} center distanceFactor={7}>
          <div style={{
            background:'rgba(6,8,15,0.92)',
            border:`2px solid ${color}`,
            borderRadius:'8px',
            padding:'4px 12px',
            color: color,
            fontFamily:'Space Mono,monospace',
            fontSize:'11px', fontWeight:700,
            whiteSpace:'nowrap',
            pointerEvents:'none',
            textAlign:'center',
            boxShadow:`0 0 10px ${color}44`
          }}>
            <div>
              {isThisGrabbed ? '✊' : isNear ? '👌' : '👆'}
              {' '}{label}
            </div>
            {isNear && !isThisGrabbed && (
              <div style={{
                fontSize:'9px', color:'#4a5a7a',
                marginTop:'2px'
              }}>Pinch to grab</div>
            )}
            {isThisGrabbed && (
              <div style={{
                fontSize:'9px', color:'#22c55e',
                marginTop:'2px'
              }}>Left grab = rotate • Open = release</div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
