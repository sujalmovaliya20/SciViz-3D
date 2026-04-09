import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Box, Sphere, Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

export default function OerstedExperiment({ currentStep = 0, isPlaying = false }) {
  const electronGrpRef = useRef()
  const needleRef = useRef()

  const stepConfigs = [
    { label: 'No Current', desc: 'Compass needle points North. No electric current in wire.', angle: 0, current: 0 },
    { label: 'Current Flows Left-Right', desc: 'Current ON. Needle deflects Northward (90°).', angle: Math.PI / 2, current: 1 },
    { label: 'High Current', desc: 'Increasing current increases deflection speed and stability.', angle: Math.PI / 2, current: 2 },
    { label: 'Reversed Current', desc: 'Current reversed. Needle flips to opposite direction (-90°).', angle: -Math.PI / 2, current: -1 },
    { label: 'Inverse Square Law', desc: 'Moving compass shows field direction wrap around wire.', angle: -Math.PI / 2, current: -1 }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]

  // Spring animation for smooth needle rotation
  const { rotationY, currentSpeed } = useSpring({
    rotationY: config.angle,
    currentSpeed: config.current,
    config: { tension: 80, friction: 12 }
  })

  useFrame((state, delta) => {
    if (!isPlaying) return
    
    // Animate electrons along the wire
    if (config.current !== 0 && electronGrpRef.current) {
      electronGrpRef.current.position.x += config.current * delta * 4
      if (electronGrpRef.current.position.x > 5) electronGrpRef.current.position.x -= 10
      if (electronGrpRef.current.position.x < -5) electronGrpRef.current.position.x += 10
    }
  })

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -2, 0]} />

      {/* Lab Table */}
      <Box args={[14, 0.15, 8]} position={[0, -1.5, 0]}>
        <meshStandardMaterial color="#1a2a1a" roughness={0.8} />
      </Box>

      {/* Copper Wire */}
      <Cylinder args={[0.06, 0.06, 10, 16]} rotation={[0, 0, Math.PI / 2]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#b87333" metalness={0.7} />
      </Cylinder>

      {/* Current Particles (Electrons) */}
      <group ref={electronGrpRef} visible={config.current !== 0}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Sphere key={i} args={[0.035, 8, 8]} position={[(i / 14) * 10 - 5, -0.8, 0]}>
            <meshBasicMaterial color="#ffff00" />
          </Sphere>
        ))}
      </group>

      {/* Compass Needle and Body */}
      <group position={[0, -1.3, 0]}>
        {/* Body */}
        <Cylinder args={[0.6, 0.6, 0.1, 32]}>
          <meshStandardMaterial color="#222" />
        </Cylinder>
        {/* Glass Cover */}
        <Cylinder args={[0.55, 0.55, 0.02, 32]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#88ccff" transparent opacity={0.3} />
        </Cylinder>
        {/* Dial Markers */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} args={[0.02, 0.01, 0.2]} rotation={[0, (i * Math.PI) / 2, 0]} position={[Math.sin((i * Math.PI) / 2) * 0.45, 0.01, Math.cos((i * Math.PI) / 2) * 0.45]}>
            <meshBasicMaterial color="#555" />
          </Box>
        ))}
        
        {/* Rotating Needle */}
        <animated.group rotation-y={rotationY}>
          {/* North (Red) */}
          <Box args={[0.06, 0.03, 0.5]} position={[0, 0.02, 0.25]}>
            <meshBasicMaterial color="#ff0000" />
          </Box>
          {/* South (White) */}
          <Box args={[0.06, 0.03, 0.5]} position={[0, 0.02, -0.25]}>
            <meshBasicMaterial color="#ffffff" />
          </Box>
          {/* Pivot */}
          <Sphere args={[0.05, 8, 8]} position={[0, 0.04, 0]}>
            <meshStandardMaterial color="#888" />
          </Sphere>
        </animated.group>
      </group>

      {/* Magnetic Field Arrows */}
      <group visible={config.current !== 0}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <group key={i} position={[(i - 2.5) * 1.5, -0.8, 0.5]} rotation={[0, config.current > 0 ? 0 : Math.PI, 0]}>
             <Box args={[0.01, 0.01, 0.2]}>
               <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
             </Box>
          </group>
        ))}
      </group>

      {/* UI Overlay */}
      <Html position={[0, 3, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #ffff00', color: '#fff', textAlign: 'center', width: '220px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#ffff00' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>{config.desc}</p>
        </div>
      </Html>
    </group>
  )
}
