// Required imports for Three.js React components:
// - Html, Text, etc → from '@react-three/drei'
// - useFrame, useThree → from '@react-three/fiber'
// - useState, useRef, etc → from 'react'
// - THREE → from 'three'

import { 
  useEffect, 
  useState, 
  useRef, 
  useCallback,
  forwardRef,
  Suspense,
  useMemo
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Html, 
  Text,
  Float,
  Sparkles,
  RoundedBox,
  Sphere,
  Cylinder,
  Box,
  ContactShadows,
  MeshDistortMaterial
} from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

function BubblingBeaker({ position, color, label, sceneKey }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  
  return (
    <group position={position}>
      {/* Glass Beaker */}
      <mesh castShadow onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={() => navigate(`/experiment/${sceneKey}`)}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 32, 1, true]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.3} roughness={0} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Liquid */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.4, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
      {/* Bubbles */}
      <Sparkles 
        count={20} 
        scale={[0.5, 0.5, 0.5]} 
        size={2} 
        speed={1.5} 
        color="#ffffff" 
        noise={0.5}
      />
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div style={{
            background: 'rgba(13,17,23,0.9)',
            border: `1px solid ${color}`,
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: '#fff',
            whiteSpace: 'nowrap'
          }}>{label}</div>
        </Html>
      )}
    </group>
  )
}

function LabBench({ position, children }) {
  return (
    <group position={position}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#1a202c" roughness={0.5} />
      </mesh>
      {/* Legs */}
      {[[-1.8, -1, -0.8], [1.8, -1, -0.8], [-1.8, -1, 0.8], [1.8, -1, 0.8]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      ))}
      {children}
    </group>
  )
}

export default function ChemistryLabInterior({ onInspect }) {
  const navigate = useNavigate()
  const [hoveredCrystal, setHoveredCrystal] = useState(false)

  return (
    <group>
      {/* Lights */}
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[0, 5, 0]} color="#a855f7" intensity={2} distance={20} />

      {/* Fume Hood */}
      <group position={[0, 3, -8]}>
        <mesh castShadow>
          <boxGeometry args={[8, 6, 2]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <mesh position={[0, -0.5, 0.9]} receiveShadow>
          <boxGeometry args={[7.5, 4.5, 0.1]} />
          <meshStandardMaterial color="#ebf8ff" transparent opacity={0.2} metalness={0.9} roughness={0.1} />
        </mesh>
        <Text position={[0, 3.5, 0]} fontSize={0.4} color="#a855f7">
          FUME HOOD - VENTILATION ACTIVE
        </Text>
      </group>

      {/* Periodic Table Poster */}
      <group position={[-8, 4, -4]} rotation={[0, Math.PI/2, 0]}>
         <mesh castShadow>
           <planeGeometry args={[6, 4]} />
           <meshStandardMaterial color="#2d3748" />
         </mesh>
         <Html position={[0, 0, 0.1]} transform portal={null} sprite>
           <div style={{
             width: '300px', height: '200px',
             background: 'rgba(13,17,23,0.95)',
             border: '1px solid #a855f744',
             borderRadius: '8px',
             padding: '10px',
             display: 'grid',
             gridTemplateColumns: 'repeat(18, 1fr)',
             gap: '2px',
             pointerEvents: 'none'
           }}>
             {Array.from({ length: 118 }).map((_, i) => (
               <div key={i} style={{
                 width: '100%', height: '100%',
                 background: '#a855f722',
                 fontSize: '4px', textAlign: 'center', color: '#fff'
               }}>{i+1}</div>
             ))}
           </div>
         </Html>
      </group>

      {/* Bench 1: Electrolysis / Solutions */}
      <LabBench position={[-5, -1, -2]}>
        <BubblingBeaker position={[-1, 0.8, 0]} color="#00e5ff" label="CuSO4 Solution" sceneKey="electrolysis-copper" />
        <BubblingBeaker position={[1, 0.8, 0]} color="#ff4d6d" label="Acidic Indicator" sceneKey="electrolysis-water" />
      </LabBench>

      {/* Bench 2: Crystals */}
      <LabBench position={[5, -1, -2]}>
        <RigidBody position={[0, 1.5, 0]} colliders="cuboid">
          <group 
            onPointerOver={() => setHoveredCrystal(true)} 
            onPointerOut={() => setHoveredCrystal(false)}
            onClick={() => navigate('/experiment/nacl-crystal')}
          >
            <Float speed={5} rotationIntensity={1} floatIntensity={0.5}>
              {/* NaCl Lattice Simplified */}
              <group scale={0.4}>
                {[-1, 1].map(x => [-1, 1].map(y => [-1, 1].map(z => (
                  <mesh key={`${x}${y}${z}`} position={[x, y, z]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color={(x+y+z) % 2 === 0 ? "#00ff88" : "#ffffff"} />
                  </mesh>
                ))))}
              </group>
            </Float>
            {hoveredCrystal && (
              <Html position={[0, 1.2, 0]} center>
                <div style={{
                  background: 'rgba(13,17,23,0.9)',
                  border: '1px solid #00ff88',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  color: '#fff',
                  whiteSpace: 'nowrap'
                }}>NaCl Crystal (Lattice)</div>
              </Html>
            )}
          </group>
        </RigidBody>
      </LabBench>

      {/* Bench 3: Cells */}
      <LabBench position={[0, -1, 4]}>
        <GrabbableProp position={[0, 0.8, 0]} label="Daniel Cell" color="#ecc94b" onInspect={onInspect}>
           <group>
             <mesh position={[-0.4, 0, 0]} castShadow>
               <cylinderGeometry args={[0.2, 0.2, 0.5]} />
               <meshStandardMaterial color="#b87333" />
             </mesh>
             <mesh position={[0.4, 0, 0]} castShadow>
               <cylinderGeometry args={[0.2, 0.2, 0.5]} />
               <meshStandardMaterial color="#c0c0c0" />
             </mesh>
             <mesh position={[0, 0.3, 0]} castShadow>
               <boxGeometry args={[1, 0.05, 0.1]} />
               <meshStandardMaterial color="#1a202c" />
             </mesh>
           </group>
        </GrabbableProp>
      </LabBench>

      {/* Smell Particles */}
      <Sparkles count={50} scale={[20, 10, 20]} size={1} speed={0.5} color="#a855f7" opacity={0.2} />

      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
    </group>
  )
}

const GrabbableProp = forwardRef(function GrabbableProp(
  { 
    position = [0, 0, 0],
    color = '#00e5ff',
    shape = 'box',
    label = 'Object',
    onInspect,
    scale = 1,
    children,
    ...props
  },
  ref
) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.y += 0.008
    mesh.position.y = position[1] + 
      Math.sin(state.clock.elapsedTime * 0.8) * 0.12
  })

  return (
    <group
      ref={ref}
      position={position}
      userData={{ grabbable: true, label }}
      {...props}
    >
      <mesh
        ref={meshRef}
        scale={hovered ? scale * 1.15 : scale}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onInspect?.({ label, color, position })
        }}
      >
        {children || (
          <>
            {shape === 'sphere' && (
              <sphereGeometry args={[0.5, 32, 32]} />
            )}
            {shape === 'box' && (
              <boxGeometry args={[0.8, 0.8, 0.8]} />
            )}
            {shape === 'torus' && (
              <torusGeometry args={[0.45, 0.15, 16, 32]} />
            )}
            {shape === 'cylinder' && (
              <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
            )}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 0.6 : 0.2}
              metalness={0.6}
              roughness={0.2}
            />
          </>
        )}
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html
          position={[0, 1.0, 0]}
          center
          distanceFactor={8}
        >
          <div style={{
            background: 'rgba(6,8,15,0.92)',
            border: `1px solid ${color}`,
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: color,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: `0 0 12px ${color}44`
          }}>
            👆 {label}
          </div>
        </Html>
      )}

      {/* Point light for glow */}
      <pointLight
        color={color}
        intensity={hovered ? 1.5 : 0.5}
        distance={3}
      />
    </group>
  )
})
