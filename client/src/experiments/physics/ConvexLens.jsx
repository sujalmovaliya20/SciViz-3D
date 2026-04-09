import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Html, Line, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

export default function ConvexLens({ currentStep = 0, isPlaying = false }) {
  const f = 3 // Focal length
  
  const stepConfigs = [
    { label: 'Convex Lens', desc: 'F = 3.0cm. Principal axis and focus points (F, 2F) shown.', u: -100 },
    { label: 'Object beyond 2F', desc: 'u = -10cm. Image is real, inverted, and diminished between F and 2F.', u: -10 },
    { label: 'Object at 2F', desc: 'u = -6cm. Image is real, inverted, and same size at 2F.', u: -6 },
    { label: 'Object between F and 2F', desc: 'u = -4.5cm. Image is real, inverted, and magnified beyond 2F.', u: -4.5 },
    { label: 'Object inside F', desc: 'u = -1.5cm. Image is virtual, upright, and magnified on same side.', u: -1.5 }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]
  const u = config.u
  
  // Lens Formula: 1/v - 1/u = 1/f  => 1/v = 1/f + 1/u => v = (f*u) / (f+u)
  const v = (f * u) / (f + u)
  const m = v / u // Magnification
  const h_obj = 1.5
  const h_img = h_obj * m

  // Spring for object position
  const { objX, imgX, imgH, opacity } = useSpring({
    objX: u,
    imgX: v,
    imgH: h_img,
    opacity: currentStep > 0 ? 1 : 0,
    config: { tension: 120, friction: 14 }
  })

  // Ray points
  // Ray 1: Parallel to axis -> Through F
  const ray1 = [
    [u, h_obj, 0], [0, h_obj, 0], [v, h_img, 0]
  ]
  // Ray 2: Through optical center -> Straight
  const ray2 = [
    [u, h_obj, 0], [0, 0, 0], [v, h_img, 0]
  ]

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Principal Axis */}
      <Line points={[[-12, 0, 0], [12, 0, 0]]} color="#555" lineWidth={1} dashed dashSize={0.2} />

      {/* Focus & 2F markers */}
      {[-6, -3, 3, 6].map(x => (
        <group key={x} position={[x, 0, 0]}>
          <Sphere args={[0.1, 8, 8]}>
             <meshBasicMaterial color="#00e5ff" />
          </Sphere>
          <Html position={[0, -0.4, 0]} center>
            <div style={{ color: '#00e5ff', fontSize: '10px' }}>{Math.abs(x) === 3 ? 'F' : '2F'}</div>
          </Html>
        </group>
      ))}

      {/* Lens (Lathe-like shape) */}
      <group rotation={[0, 0, Math.PI / 2]}>
         <Cylinder args={[2, 2, 0.4, 32]} scale={[1, 0.4, 1]}>
           <meshPhysicalMaterial 
             color="#88ccff" 
             transparent 
             opacity={0.4} 
             transmission={0.8} 
             thickness={1}
             roughness={0}
           />
         </Cylinder>
      </group>

      {/* Object Arrow */}
      <animated.group position-x={objX} visible={currentStep > 0}>
         <Line points={[[0, 0, 0], [0, h_obj, 0]]} color="#ffff00" lineWidth={3} />
         <Sphere args={[0.08, 8, 8]} position={[0, h_obj, 0]}>
           <meshBasicMaterial color="#ffff00" />
         </Sphere>
         <Html position={[0, h_obj + 0.4, 0]} center>
            <div style={{ color: '#ffff00', fontSize: '10px' }}>Object</div>
         </Html>
      </animated.group>

      {/* Image Arrow */}
      <animated.group position-x={imgX} visible={currentStep > 0 && Math.abs(v) < 20}>
         <Line points={[[0, 0, 0], [0, imgH, 0]]} color="#00ff00" lineWidth={3} />
         <Sphere args={[0.08, 8, 8]} position={[0, imgH, 0]}>
           <meshBasicMaterial color="#00ff00" />
         </Sphere>
         <Html position={[0, h_img > 0 ? h_img + 0.4 : h_img - 0.4, 0]} center>
            <div style={{ color: '#00ff00', fontSize: '10px' }}>{v < 0 ? 'Virtual Image' : 'Real Image'}</div>
         </Html>
      </animated.group>

      {/* Rays */}
      <group visible={currentStep > 0}>
         <Line points={ray1} color="#ffffff" lineWidth={1} transparent opacity={0.3} />
         <Line points={ray2} color="#ffffff" lineWidth={1} transparent opacity={0.3} />
      </group>

      {/* Labels */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #00e5ff', color: '#fff', textAlign: 'center', width: '280px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#00e5ff' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>{config.desc}</p>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#00ff00', fontFamily: 'monospace' }}>
            u = {u.toFixed(1)}cm | v = {v.toFixed(1)}cm | m = {m.toFixed(2)}
          </div>
        </div>
      </Html>

      <gridHelper args={[24, 24, 0x1e2a3a, 0x0a1018]} position={[0, -4, 0]} />
    </group>
  )
}
