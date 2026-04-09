import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Html, Line } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

export default function CircuitSeriesParallel({ currentStep = 0, isPlaying = false }) {
  const electronGrpRef = useRef()

  const stepConfigs = [
    { label: 'Series Layout', desc: 'Components connected in a single loop.', isParallel: false, voltage: 6, current: 0.5, glow: 0.3 },
    { label: 'Series Current', desc: 'Current is same throughout. Electrons flow in one loop.', isParallel: false, voltage: 6, current: 0.5, glow: 0.3 },
    { label: 'Voltage Drop', desc: 'Voltage divides! Each bulb gets V/2 = 3V.', isParallel: false, voltage: 3, current: 0.5, glow: 0.3 },
    { label: 'Parallel Switch', desc: 'Bulbs now in parallel. Total current increases (I=2A).', isParallel: true, voltage: 6, current: 1.0, glow: 0.8 },
    { label: 'Full Brilliance', desc: 'Both bulbs get full 6V. Brightness is maximum.', isParallel: true, voltage: 6, current: 1.0, glow: 0.8 }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]

  // Spring for glow and transitions
  const { glowIntensity, morphFactor } = useSpring({
    glowIntensity: config.glow,
    morphFactor: config.isParallel ? 1 : 0,
    config: { tension: 60, friction: 12 }
  })

  // Paths for electrons
  // Series: Rectangle loop
  const seriesPoints = [
    [-5, 0, 0], [-5, 2, 0], [0, 2, 0], [5, 2, 0], [5, -2, 0], [0, -2, 0], [-5, -2, 0], [-5, 0, 0]
  ]
  // Parallel: Two loops or complex path
  const parallelPoints = [
     [-5,0,0], [-5,2,0], [-2,2,0], [-2,3,0], [2,3,0], [2,2,0], [5,2,0], [5,-2,0], [2,-2,0], [2,-1,0], [-2,-1,0], [-2,-2,0], [-5,-2,0], [-5,0,0]
  ]

  useFrame((state, delta) => {
    if (!isPlaying || currentStep === 0) return
    const t = state.clock.elapsedTime
    if (electronGrpRef.current) {
      electronGrpRef.current.children.forEach((el, i) => {
         const offset = (i / 15) + (t * config.current * 0.2)
         const p = offset % 1
         // Simple interpolation for demo (linear path logic)
         const path = config.isParallel ? parallelPoints : seriesPoints
         const segment = Math.floor(p * (path.length - 1))
         const subT = (p * (path.length - 1)) % 1
         const p1 = path[segment]
         const p2 = path[segment + 1]
         if (p1 && p2) {
           el.position.set(
             p1[0] + (p2[0] - p1[0]) * subT,
             p1[1] + (p2[1] - p1[1]) * subT,
             p1[2] + (p2[2] - p1[2]) * subT
           )
         }
      })
    }
  })

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1} />

      {/* Battery */}
      <Box args={[1, 2, 0.5]} position={[-5, 0, 0]}>
        <meshStandardMaterial color="#ffc107" emissive="#ffc107" emissiveIntensity={0.2} />
        <Html position={[0, 1.2, 0]} center>
          <div style={{ color: '#ffc107', fontWeight: 800, fontSize: '12px' }}>6V</div>
        </Html>
      </Box>

      {/* Bulbs (Animated intensity) */}
      <group position={[0, config.isParallel ? 1 : 0, 0]}>
         <Sphere args={[0.4, 16, 16]} position={[2, 0, 0]}>
           <animated.meshStandardMaterial 
             color="#ffffff" 
             emissive="#ffff00" 
             emissiveIntensity={glowIntensity} 
           />
           <Html position={[0, 0.6, 0]} center>
             <div style={{ color: '#ffff00', fontSize: '10px' }}>{config.voltage}V</div>
           </Html>
         </Sphere>
         <Sphere args={[0.4, 16, 16]} position={[-2, 0, 0]} visible={!config.isParallel}>
            <animated.meshStandardMaterial color="#ffffff" emissive="#ffff00" emissiveIntensity={glowIntensity} />
         </Sphere>
      </group>

      {/* Parallel specific Bulb 2 */}
      <Sphere args={[0.4, 16, 16]} position={[0, -1, 0]} visible={config.isParallel}>
          <animated.meshStandardMaterial color="#ffffff" emissive="#ffff00" emissiveIntensity={glowIntensity} />
      </Sphere>

      {/* Wires (Represented by Lines) */}
      <Line 
        points={config.isParallel ? parallelPoints : seriesPoints} 
        color="#555" 
        lineWidth={2} 
      />

      {/* Electrons */}
      <group ref={electronGrpRef} visible={currentStep > 0}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Sphere key={i} args={[0.08, 8, 8]}>
            <meshBasicMaterial color="#00e5ff" />
          </Sphere>
        ))}
      </group>

      {/* Labels */}
      <Html position={[0, 4, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.8)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #00e5ff', color: '#fff', textAlign: 'center', width: '250px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#00e5ff' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>{config.desc}</p>
          <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'monospace', color: '#00ff00' }}>
            V = 6V | I = {config.current}A
          </div>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -3, 0]} />
    </group>
  )
}
