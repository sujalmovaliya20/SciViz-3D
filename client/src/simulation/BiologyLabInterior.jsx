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
  Suspense
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
  ContactShadows
} from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

function LabBench({ position, children }) {
  return (
    <group position={position}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} />
      </mesh>
      {/* Legs */}
      {[[-1.8, -1, -0.8], [1.8, -1, -0.8], [-1.8, -1, 0.8], [1.8, -1, 0.8]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      ))}
      {children}
    </group>
  )
}

function DNAHelix({ position, onClick, hovered }) {
  const group = useRef()
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.02
    }
  })

  return (
    <group position={position} onClick={onClick}>
      <group ref={group} scale={0.15}>
        {Array.from({ length: 20 }).map((_, i) => (
          <group key={i} position={[0, i * 0.5 - 5, 0]} rotation={[0, i * 0.5, 0]}>
            <mesh position={[1, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={hovered ? 0.5 : 0.1} />
            </mesh>
            <mesh position={[-1, 0, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={hovered ? 0.5 : 0.1} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.05, 0.05, 2]} />
              <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

export default function BiologyLabInterior({ onInspect }) {
  const navigate = useNavigate()
  const [hoveredDNA, setHoveredDNA] = useState(false)
  const [hoveredNeuron, setHoveredNeuron] = useState(false)

  return (
    <group>
      {/* Lights */}
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[0, 5, 0]} color="#22c55e" intensity={1.5} distance={20} />

      {/* Anatomy Poster */}
      <group position={[0, 4, -8]}>
        <mesh receiveShadow>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <Text position={[0, 3, 0]} fontSize={0.35} color="#22c55e">
          HUMAN BIOLOGY - BIOMEDICAL STUDY
        </Text>
        <Html position={[0, -0.2, 0.1]} transform={true} occlude={true} distanceFactor={8} portal={null} sprite>
           <div style={{
             width: '240px', height: '300px',
             background: 'rgba(255,255,255,0.05)',
             border: '2px solid #22c55e44',
             borderRadius: '8px',
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             color: '#22c55e', fontSize: '10px', fontFamily: 'Space Mono',
             textAlign: 'center', pointerEvents: 'none'
           }}>
             {`[ ANATOMY SCHEMATIC ]\n\n(•)\n/|\\\n/ \\`}
           </div>
        </Html>
      </group>

      {/* Bench 1: Microscope */}
      <LabBench position={[-5, -1, -2]}>
        <GrabbableProp position={[0, 0.8, 0]} label="Microscope" color="#22c55e" onInspect={onInspect}>
           <group rotation={[0, Math.PI/2, 0]}>
             <mesh position={[0, -0.2, 0]} castShadow>
               <boxGeometry args={[0.6, 0.1, 0.4]} />
               <meshStandardMaterial color="#1a202c" />
             </mesh>
             <mesh position={[-0.2, 0.2, 0]} rotation={[0,0,-Math.PI/6]} castShadow>
               <cylinderGeometry args={[0.08, 0.08, 0.6]} />
               <meshStandardMaterial color="#4a5a7a" />
             </mesh>
             <mesh position={[0, 0.5, 0]} rotation={[0,0,-Math.PI/6]} castShadow>
               <cylinderGeometry args={[0.05, 0.1, 0.2]} />
               <meshStandardMaterial color="#22c55e" />
             </mesh>
           </group>
        </GrabbableProp>
      </LabBench>

      {/* Bench 2: Genetics */}
      <LabBench position={[5, -1, -2]}>
        <group 
          onPointerOver={() => setHoveredDNA(true)} 
          onPointerOut={() => setHoveredDNA(false)}
          onClick={() => navigate('/experiment/dna-helix')}
        >
          <DNAHelix position={[0, 1.5, 0]} hovered={hoveredDNA} />
          {hoveredDNA && (
            <Html position={[0, 2.8, 0]} center>
              <div style={{
                background: 'rgba(13,17,23,0.9)',
                border: '1px solid #ff4d6d',
                borderRadius: '6px',
                padding: '4px 10px',
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                color: '#fff',
                whiteSpace: 'nowrap'
              }}>DNA Double Helix</div>
            </Html>
          )}
        </group>
      </LabBench>

      {/* Neuron Floating in Center */}
      <group 
        position={[0, 1.5, 3]} 
        onPointerOver={() => setHoveredNeuron(true)}
        onPointerOut={() => setHoveredNeuron(false)}
        onClick={() => navigate('/experiment/neuron-impulse')}
      >
        <Float speed={3} rotationIntensity={1} floatIntensity={1}>
           <group scale={0.8}>
             {/* Soma */}
             <mesh castShadow>
               <sphereGeometry args={[0.5, 16, 16]} />
               <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={hoveredNeuron ? 0.8 : 0.2} />
             </mesh>
             {/* Axon */}
             <mesh position={[0, -1.2, 0]} castShadow>
               <cylinderGeometry args={[0.05, 0.05, 2]} />
               <meshStandardMaterial color="#22c55e" />
             </mesh>
             {/* Dendrites (Dummies) */}
             {[0, 1, 2, 3, 4].map(i => (
               <mesh key={i} position={[Math.cos(i)*0.6, Math.sin(i)*0.6, 0]} rotation={[0,0,i]}>
                 <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                 <meshStandardMaterial color="#22c55e" />
               </mesh>
             ))}
             {/* Impulse Pulse */}
             <Sparkles count={15} scale={[1, 3, 1]} size={2} speed={3} color="#ffffff" />
           </group>
        </Float>
        {hoveredNeuron && (
          <Html position={[0, 2, 0]} center>
            <div style={{
              background: 'rgba(13,17,23,0.9)',
              border: '1px solid #22c55e',
              borderRadius: '6px',
              padding: '4px 10px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              color: '#fff',
              whiteSpace: 'nowrap'
            }}>Neuron Impulse Propagation</div>
          </Html>
        )}
      </group>

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
