import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Html, Line, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

export default function Reflection({ currentStep = 0, isPlaying = false }) {
  const stepConfigs = [
    { label: 'Plane Mirror', desc: 'A flat reflective surface. Ready for light incidence.', angle: 40, showInc: false, showRef: false },
    { label: 'Incident Ray', desc: 'Light hits the mirror at an angle ∠i = 40° to the normal.', angle: 40, showInc: true, showRef: false },
    { label: 'Reflected Ray', desc: 'Law of Reflection: Angle of incidence = Angle of reflection (i=r).', angle: 40, showInc: true, showRef: true },
    { label: 'Angle Measures', desc: 'Both angles are 40° from the normal line.', angle: 40, showInc: true, showRef: true },
    { label: 'Variable Angle', desc: 'Symmetry is maintained even as the incident angle changes to 60°.', angle: 60, showInc: true, showRef: true }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]
  const angle = (config.angle * Math.PI) / 180

  // Spring animations for angles and ray visibility
  const { rayAngle, arcRotation, rayOpacity } = useSpring({
    rayAngle: angle,
    arcRotation: angle,
    rayOpacity: config.showInc ? 1 : 0,
    config: { tension: 120, friction: 14 }
  })

  // Ray geometry
  const rayLen = 5
  
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Mirror */}
      <Box args={[10, 0.1, 4]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#888" metalness={1} roughness={0.1} />
        {/* Mirror Surface Glow */}
        <Box args={[10, 0.01, 4]} position={[0, 0.06, 0]}>
           <meshStandardMaterial color="#ccddee" transparent opacity={0.2} emissive="#88aaff" emissiveIntensity={0.2} />
        </Box>
      </Box>

      {/* Normal Line */}
      <Line 
        points={[[0, 4, 0], [0, 0, 0]]} 
        color="#ffffff" 
        lineWidth={1} 
        dashed 
        dashSize={0.2} 
        visible={currentStep >= 1}
      />

      {/* Incident Ray (Animated Angle) */}
      <animated.group visible={config.showInc} rotation-z={rayAngle}>
         <Line points={[[0, rayLen, 0], [0, 0, 0]]} color="#00e5ff" lineWidth={4} />
         <Html position={[0, rayLen + 0.5, 0]} center>
            <div style={{ color: '#00e5ff', fontSize: '12px', fontWeight: 800 }}>Incident Ray</div>
         </Html>
      </animated.group>

      {/* Reflected Ray (Animated Angle) */}
      <animated.group visible={config.showRef} rotation-z={rayAngle.to(a => -a)}>
         <Line points={[[0, rayLen, 0], [0, 0, 0]]} color="#ffff00" lineWidth={4} />
         <Html position={[0, rayLen + 0.5, 0]} center>
            <div style={{ color: '#ffff00', fontSize: '12px', fontWeight: 800 }}>Reflected Ray</div>
         </Html>
      </animated.group>

      {/* Angle Arcs */}
      <group visible={currentStep >= 3}>
         {/* ∠i Arc */}
         <Torus args={[1, 0.02, 8, 32, angle]} rotation={[Math.PI / 2, 0, Math.PI / 2]} />
         <Html position={[-0.7, 1.2, 0]} center>
            <div style={{ color: '#00e5ff', fontSize: '14px', fontWeight: 800 }}>∠i={config.angle}°</div>
         </Html>
         
         {/* ∠r Arc */}
         <Torus args={[1, 0.02, 8, 32, angle]} rotation={[Math.PI / 2, 0, Math.PI / 2 - angle]} />
         <Html position={[0.7, 1.2, 0]} center>
            <div style={{ color: '#ffff00', fontSize: '14px', fontWeight: 800 }}>∠r={config.angle}°</div>
         </Html>
      </group>

      {/* Light Particle Animation */}
      {isPlaying && config.showRef && (
        <ReflectParticle angle={config.angle} length={rayLen} />
      )}

      {/* Labels */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #00e5ff', color: '#fff', textAlign: 'center', width: '250px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#00e5ff' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>{config.desc}</p>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -2, 0]} />
    </group>
  )
}

function ReflectParticle({ angle, length }) {
  const ref = useRef()
  const rad = (angle * Math.PI) / 180
  
  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.5) % 1
    if (t < 0.5) {
      // Incident path
      const subT = t * 2
      const dist = length * (1 - subT)
      ref.current.position.set(
        -Math.sin(rad) * dist,
        Math.cos(rad) * dist,
        0
      )
    } else {
      // Reflected path
      const subT = (t - 0.5) * 2
      const dist = length * subT
      ref.current.position.set(
        Math.sin(rad) * dist,
        Math.cos(rad) * dist,
        0
      )
    }
  })

  return (
    <Sphere ref={ref} args={[0.08, 16, 16]}>
      <meshBasicMaterial color="#ffffff" />
      <pointLight intensity={0.5} color="#ffffff" />
    </Sphere>
  )
}
