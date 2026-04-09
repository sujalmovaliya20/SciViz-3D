import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, Cylinder, Sphere, Cone, Html, Line, Box } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

export default function MagneticFieldWire({ currentStep = 0, isPlaying = false }) {
  const electronGrpRef = useRef()
  const ringsRef = useRef()

  const stepConfigs = [
    { label: 'Static Wire', desc: 'Copper wire with no current. No magnetic field.' },
    { label: 'Current UP', desc: 'Current flows UP. Concentric magnetic field lines form.' },
    { label: 'Right-Hand Rule', desc: 'Thumb UP (current) = Fingers curl counter-clockwise (field).' },
    { label: 'Current DOWN', desc: 'Current reverses. Field lines now move clockwise.' },
    { label: 'Compass Test', desc: 'Moving a compass around shows the field direction at any point.' }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]

  // Animation states
  const isCurrentUp = currentStep === 1 || currentStep === 2
  const isCurrentDown = currentStep === 3 || currentStep === 4
  const hasCurrent = isCurrentUp || isCurrentDown
  const currentDir = isCurrentUp ? 1 : isCurrentDown ? -1 : 0

  const { ringScale, handOpacity, compassPos } = useSpring({
    ringScale: hasCurrent ? 1 : 0,
    handOpacity: currentStep === 2 ? 1 : 0,
    compassPos: currentStep === 4 ? [2.5, 0, 2.5] : [10, 0, 0], // Move compass in step 4
    config: { tension: 120, friction: 14 }
  })

  useFrame((state, delta) => {
    if (!isPlaying) return
    const t = state.clock.elapsedTime

    // Animate electrons
    if (hasCurrent && electronGrpRef.current) {
      electronGrpRef.current.position.y += currentDir * delta * 3
      if (electronGrpRef.current.position.y > 2) electronGrpRef.current.position.y -= 4
      if (electronGrpRef.current.position.y < -2) electronGrpRef.current.position.y += 4
    }

    // Rotate field rings
    if (hasCurrent && ringsRef.current) {
      ringsRef.current.rotation.y += currentDir * delta * 1.5
    }
  })

  return (
    <group>
      {/* Lights & Environment */}
      <ambientLight intensity={0.4} color="#1a2a4a" />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -4, 0]} />

      {/* Copper Wire */}
      <Cylinder args={[0.08, 0.08, 8, 16]}>
        <meshStandardMaterial color="#b87333" metalness={0.7} roughness={0.3} />
      </Cylinder>

      {/* Electrons */}
      <group ref={electronGrpRef} visible={hasCurrent}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Sphere key={i} args={[0.04, 8, 8]} position={[0, (i / 11) * 8 - 4, 0]}>
            <meshBasicMaterial color="#00e5ff" />
          </Sphere>
        ))}
      </group>

      {/* Magnetic Field Rings */}
      <animated.group ref={ringsRef} scale={ringScale}>
        {[-2, -1, 0, 1, 2].map((y, ringIdx) => (
          <group key={ringIdx} position={[0, y, 0]}>
            {[1, 2, 3, 4, 5].map((r, i) => (
              <group key={i}>
                <Torus args={[r, 0.015, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshBasicMaterial 
                    color="#00e5ff" 
                    transparent 
                    opacity={0.6 / (i + 1)} 
                  />
                </Torus>
                {/* Direction Arrows on Rings */}
                {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, arrowIdx) => (
                  <mesh 
                    key={arrowIdx} 
                    position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} 
                    rotation={[0, -angle, 0]}
                  >
                    <coneGeometry args={[0.06, 0.15, 8]} />
                    <meshBasicMaterial color="#00e5ff" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </animated.group>

      {/* Right Hand Rule Visualization (Step 2) */}
      <animated.group position={[1.5, 0, 0]} visible={handOpacity.to(o => o > 0.1)}>
        {/* Thumb (Current) */}
        <Cylinder args={[0.1, 0.1, 1.2]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#ffcc44" />
        </Cylinder>
        <Cone args={[0.2, 0.4, 16]} position={[0, 1.4, 0]}>
          <meshStandardMaterial color="#ffcc44" />
        </Cone>
        <Html position={[0, 1.8, 0]} center>
          <div style={{ color: '#ffcc44', fontSize: '10px', fontWeight: 'bold' }}>CURRENT</div>
        </Html>

        {/* Fingers (Magnetic Field) */}
        <Torus args={[0.5, 0.08, 16, 32, Math.PI * 1.2]} rotation={[Math.PI / 2, 0, 0]} position={[-0.5, 0, 0]}>
          <meshStandardMaterial color="#00e5ff" />
        </Torus>
        <Html position={[-1.2, 0, 0]} center>
          <div style={{ color: '#00e5ff', fontSize: '10px', fontWeight: 'bold' }}>FIELD</div>
        </Html>
      </animated.group>

      {/* Compass (Step 4) */}
      <animated.group position={compassPos} visible={currentStep === 4}>
        {/* Compass Body */}
        <Cylinder args={[0.4, 0.4, 0.1, 32]}>
          <meshStandardMaterial color="#222" />
        </Cylinder>
        {/* Needle */}
        <group rotation={[0, Math.PI / 4, 0]}> {/* Points tangent to field */}
           <Box args={[0.05, 0.05, 0.4]} position={[0, 0.06, 0.2]}>
             <meshBasicMaterial color="#ff0000" />
           </Box>
           <Box args={[0.05, 0.05, 0.4]} position={[0, 0.06, -0.2]}>
             <meshBasicMaterial color="#ffffff" />
           </Box>
        </group>
        <Html position={[0, 0.6, 0]} center>
          <div style={{ color: '#fff', fontSize: '10px' }}>COMPASS</div>
        </Html>
      </animated.group>

      {/* Labels */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.8)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #00e5ff', color: '#fff', textAlign: 'center', width: '220px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#00e5ff' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>{config.desc}</p>
        </div>
      </Html>
    </group>
  )
}
