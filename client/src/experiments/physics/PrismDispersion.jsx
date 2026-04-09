import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Html, Line, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

export default function PrismDispersion({ currentStep = 0, isPlaying = false }) {
  const stepConfigs = [
    { label: 'Glass Prism', desc: 'A triangular glass prism. Light enters and bends based on wavelength.' },
    { label: 'Incident Beam', desc: 'White light beam enters the left face of the prism.' },
    { label: 'Internal Dispersion', desc: 'Different colors bend at different angles inside the glass.' },
    { label: 'VIBGYOR Spectrum', desc: 'The full visible spectrum emerges. Violet bends most, Red bends least.' },
    { label: 'Wavelength Data', desc: 'Violet (~380nm) to Red (~700nm). Higher frequency = more bending.' }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]

  // Spectrum data
  const spectrum = [
    { name: 'Violet', color: '#8B00FF', wavelength: '380nm', angle: -0.4 },
    { name: 'Indigo', color: '#4B0082', wavelength: '430nm', angle: -0.32 },
    { name: 'Blue', color: '#0000FF', wavelength: '480nm', angle: -0.25 },
    { name: 'Green', color: '#00FF00', wavelength: '530nm', angle: -0.15 },
    { name: 'Yellow', color: '#FFFF00', wavelength: '580nm', angle: -0.05 },
    { name: 'Orange', color: '#FF7F00', wavelength: '620nm', angle: 0.05 },
    { name: 'Red', color: '#FF0000', wavelength: '700nm', angle: 0.15 }
  ]

  const { rayScale, prismScale } = useSpring({
    rayScale: currentStep >= 3 ? 1 : 0,
    prismScale: 1,
    config: { tension: 120, friction: 14 }
  })

  // Prism Geometry
  const prismShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 2)
    s.lineTo(-2, -1)
    s.lineTo(2, -1)
    s.closePath()
    return s
  }, [])

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Prism */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
         <extrudeGeometry args={[prismShape, { depth: 2, bevelEnabled: false }]} />
         <meshPhysicalMaterial 
           color="#88aaff" 
           transparent 
           opacity={0.3} 
           transmission={0.8} 
           thickness={2}
           roughness={0}
         />
      </mesh>

      {/* Input White Beam */}
      <group visible={currentStep >= 1}>
         <Cylinder args={[0.08, 0.08, 5, 16]} rotation={[0, 0, Math.PI / 2.5]} position={[-4, 0.5, 1]}>
            <meshBasicMaterial color="#ffffff" />
         </Cylinder>
         <Html position={[-4, 1.5, 1]} center>
            <div style={{ color: '#fff', fontSize: '10px' }}>White Light</div>
         </Html>
      </group>

      {/* Internal & Output Rays (Dispersion) */}
      <group position={[0, 0, 1]}>
        {spectrum.map((s, i) => (
          <group key={i} visible={currentStep >= 2}>
            {/* Internal Ray (Simplified) */}
            <Line 
              points={[[-1, 0, 0], [1.5, s.angle * 1.5, 0]]} 
              color={s.color} 
              lineWidth={2} 
              transparent 
              opacity={currentStep === 2 ? 0.6 : 0.3}
            />
            {/* Emerging Ray */}
            <animated.group position={[1.5, s.angle * 1.5, 0]} rotation={[0, 0, s.angle]} scale-x={rayScale}>
               <Line points={[[0, 0, 0], [4, -s.angle * 2, 0]]} color={s.color} lineWidth={4} />
               <Html position={[4.5, -s.angle * 2, 0]} center visible={currentStep >= 4}>
                  <div style={{ color: s.color, fontSize: '9px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                    {s.name} ({s.wavelength})
                  </div>
               </Html>
            </animated.group>
          </group>
        ))}
      </group>

      {/* Labels */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #88aaff', color: '#fff', textAlign: 'center', width: '250px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#88aaff' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>{config.desc}</p>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -4, 0]} />
    </group>
  )
}
