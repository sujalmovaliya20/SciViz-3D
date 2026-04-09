import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Html, Line, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

export default function OhmsLaw({ currentStep = 0, isPlaying = false }) {
  const electronGrpRef = useRef()

  const stepConfigs = [
    { label: "Circuit Setup", desc: "A simple circuit with battery, resistor, and meters. Switch is OPEN.", v: 0, r: 12, i: 0, switchOpen: true },
    { label: "Current Flow", desc: "Switch CLOSED. I = V/R = 6/12 = 0.5A. Electrons flow slowly.", v: 6, r: 12, i: 0.5, switchOpen: false },
    { label: "Higher Voltage", desc: "Double the voltage (12V). Current doubles (1.0A). Bulb is brighter.", v: 12, r: 12, i: 1.0, switchOpen: false },
    { label: "Higher Resistance", desc: "Increase resistance to 24Ω. Current drops back to 0.5A.", v: 12, r: 24, i: 0.5, switchOpen: false },
    { label: "Ohm's Law Graph", desc: "Plotting V vs I shows a straight line through the origin.", v: 12, r: 24, i: 0.5, switchOpen: false }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]

  // Spring animations for needle and glow
  const { needleAngleV, needleAngleA, glow, switchAngle } = useSpring({
    needleAngleV: (config.v / 12) * Math.PI - Math.PI / 2,
    needleAngleA: (config.i / 1.0) * Math.PI - Math.PI / 2,
    glow: config.i * 0.8,
    switchAngle: config.switchOpen ? -0.5 : 0,
    config: { tension: 120, friction: 14 }
  })

  // Wires Path
  const wirePoints = [
    [-4, 0, 0], [-4, 2, 0], [4, 2, 0], [4, -2, 0], [-4, -2, 0], [-4, 0, 0]
  ]

  useFrame((state, delta) => {
    if (!isPlaying || config.i === 0) return
    if (electronGrpRef.current) {
      electronGrpRef.current.children.forEach((el, i) => {
        const t = (state.clock.elapsedTime * config.i * 0.4 + i / 20) % 1
        const segment = Math.floor(t * 5)
        const subT = (t * 5) % 1
        const p1 = wirePoints[segment]
        const p2 = wirePoints[segment + 1]
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
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />

      {/* Battery */}
      <Box args={[1, 1.5, 0.6]} position={[-4, 0, 0]}>
        <meshStandardMaterial color="#ffc107" />
        <Box args={[0.4, 0.2, 0.4]} position={[0, 0.85, 0]}>
          <meshStandardMaterial color="#888" metalness={1} />
        </Box>
        <Html position={[0, 0, 0.4]} center>
          <div style={{ color: '#000', fontWeight: 800, fontSize: '12px' }}>{config.v}V</div>
        </Html>
      </Box>

      {/* Switch */}
      <group position={[0, 2, 0]}>
         <Sphere args={[0.1, 8, 8]} position={[-0.5, 0, 0]}> <meshBasicMaterial color="#fff" /> </Sphere>
         <Sphere args={[0.1, 8, 8]} position={[0.5, 0, 0]}> <meshBasicMaterial color="#fff" /> </Sphere>
         <animated.group position={[-0.5, 0, 0]} rotation-z={switchAngle}>
            <Box args={[1.1, 0.05, 0.1]} position={[0.5, 0, 0]}>
               <meshStandardMaterial color="#555" />
            </Box>
         </animated.group>
      </group>

      {/* Meters */}
      <Meter label="V" position={[-2, 2, 0]} angle={needleAngleV} />
      <Meter label="A" position={[2, 2, 0]} angle={needleAngleA} />

      {/* Resistor (Zigzag) */}
      <group position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
         {[...Array(5)].map((_, i) => (
           <Box key={i} args={[0.2, 0.1, 0.4]} position={[0, (i-2)*0.25, i%2?0.1:-0.1]} rotation={[0, i%2?0.5:-0.5, 0]}>
             <meshStandardMaterial color="#ff8c00" />
           </Box>
         ))}
         <Html position={[1.5, 0, 0]} center>
           <div style={{ color: '#ff8c00', fontSize: '12px' }}>{config.r}Ω</div>
         </Html>
      </group>

      {/* Bulb */}
      <group position={[0, -2, 0]}>
         <Sphere args={[0.4, 16, 16]}>
            <animated.meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffff00" 
              emissiveIntensity={glow} 
            />
         </Sphere>
         <Torus args={[0.45, 0.02, 8, 32]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#555" />
         </Torus>
      </group>

      {/* Wires */}
      <Line points={wirePoints} color="#444" lineWidth={2} />

      {/* Electrons */}
      <group ref={electronGrpRef} visible={config.i > 0}>
         {[...Array(20)].map((_, i) => (
           <Sphere key={i} args={[0.08, 8, 8]}>
             <meshBasicMaterial color="#00e5ff" />
           </Sphere>
         ))}
      </group>

      {/* VI Graph Overlay */}
      {currentStep >= 4 && (
        <Html position={[5, 1, 0]} center>
           <div style={{
             background: 'rgba(0,0,0,0.9)', padding: '15px', borderRadius: '12px',
             border: '1px solid #00ff00', width: '200px'
           }}>
             <div style={{ color: '#00ff00', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>V-I CHARACTERISTIC</div>
             <svg width="170" height="120" style={{ overflow: 'visible' }}>
                <line x1="20" y1="100" x2="160" y2="100" stroke="#555" /> {/* x-axis */}
                <line x1="20" y1="10" x2="20" y2="100" stroke="#555" /> {/* y-axis */}
                <line x1="20" y1="100" x2="150" y2="20" stroke="#00ff00" strokeWidth="2" /> {/* Line */}
                <circle cx="20" cy="100" r="4" fill="#00ff00" />
                <text x="165" y="105" fill="#555" fontSize="10">V</text>
                <text x="10" y="10" fill="#555" fontSize="10">I</text>
             </svg>
             <div style={{ color: '#888', fontSize: '10px', marginTop: '8px' }}>Slope = 1/R (Constant)</div>
           </div>
        </Html>
      )}

      {/* Labels */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #ffcc00', color: '#fff', textAlign: 'center', width: '240px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#ffcc00' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>{config.desc}</p>
          <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'monospace', color: '#00ff00' }}>
            V={config.v}V | R={config.r}Ω | I={config.i}A
          </div>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -4, 0]} />
    </group>
  )
}

function Meter({ label, position, angle }) {
  return (
    <group position={position}>
       <Torus args={[0.5, 0.05, 8, 32, Math.PI]} rotation={[0, 0, Math.PI]}>
          <meshStandardMaterial color="#222" />
       </Torus>
       <Cylinder args={[0.5, 0.5, 0.02, 32]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#333" />
       </Cylinder>
       <Html position={[0, -0.2, 0]} center>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>{label}</div>
       </Html>
       {/* Needle */}
       <animated.group rotation-z={angle}>
          <Box args={[0.02, 0.5, 0.02]} position={[0, 0.25, 0.02]}>
             <meshBasicMaterial color="#ff0000" />
          </Box>
       </animated.group>
    </group>
  )
}
