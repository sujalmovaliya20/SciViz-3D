import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Html, Line, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

export default function RefractionGlassSlab({ currentStep = 0, isPlaying = false }) {
  const stepConfigs = [
    { label: 'Glass Slab', desc: 'A rectangular glass block (n=1.5). Ready for light propagation.' },
    { label: 'Incident Ray', desc: 'Light hits the surface at an angle θ₁. Bending starts at the interface.' },
    { label: 'Refraction', desc: 'Inside the slab, light slows down and bends toward the normal.', refracted: true },
    { label: 'Emergent Ray', desc: 'Light exits parallel to the incident ray but laterally displaced.', emergent: true },
    { label: "Snell's Law", desc: 'n₁sinθ₁ = n₂sinθ₂. Higher n means more bending toward normal.', emergent: true }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]

  const n1 = 1.0 // Air
  const n2 = 1.5 // Glass
  const angle1 = currentStep >= 4 ? 60 : 45 // Angle of incidence
  const rad1 = (angle1 * Math.PI) / 180
  const rad2 = Math.asin((n1 * Math.sin(rad1)) / n2)
  const angle2 = (rad2 * 180) / Math.PI

  // Ray geometry calculations
  const slabWidth = 6
  const slabThickness = 1.5 // We'll use depth for the visual thickness in the ray plane (XY)
  const entryY = 2
  const exitY = -2
  const thickness = 4 // Total Y height of slab

  // Incident ray (from top-left to [0, 2])
  const incLen = 3
  const incX = -incLen * Math.tan(rad1)
  
  // Refracted ray (inside)
  const refX = thickness * Math.tan(rad2)

  // Spring animations
  const { rayOpacity } = useSpring({
    rayOpacity: currentStep > 0 ? 1 : 0,
    config: { tension: 120, friction: 14 }
  })

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Glass Slab */}
      <Box args={[6, 4, 2]} position={[0, 0, 0]}>
        <meshPhysicalMaterial 
          color="#88aaff" 
          transparent 
          opacity={0.3} 
          roughness={0} 
          transmission={0.5} 
          thickness={2}
        />
      </Box>

      {/* Normal Lines */}
      <Line 
        points={[[0, 3, 0], [0, -3, 0]]} 
        color="#ffffff" 
        lineWidth={1} 
        dashed 
        dashScale={2} 
        dashSize={0.2}
        visible={currentStep > 0}
      />
      <Line 
        points={[[refX, 3, 0], [refX, -3, 0]]} 
        color="#ffffff" 
        lineWidth={1} 
        dashed 
        dashScale={2} 
        dashSize={0.2}
        visible={currentStep >= 3}
      />

      {/* Incident Ray */}
      <group visible={currentStep >= 1}>
        <Line 
          points={[[incX, 2 + incLen, 0], [0, 2, 0]]} 
          color="#ffff00" 
          lineWidth={3} 
        />
        <Html position={[incX / 2, 2 + incLen / 2, 0]} center>
          <div style={{ color: '#ffff00', fontSize: '10px' }}>θ₁ = {angle1}°</div>
        </Html>
      </group>

      {/* Refracted Ray */}
      <group visible={currentStep >= 2}>
        <Line 
          points={[[0, 2, 0], [refX, -2, 0]]} 
          color="#ffff00" 
          lineWidth={3} 
        />
        <Html position={[refX / 2, 0, 0]} center>
          <div style={{ color: '#00e5ff', fontSize: '10px' }}>θ₂ = {angle2.toFixed(1)}°</div>
        </Html>
      </group>

      {/* Emergent Ray */}
      <group visible={currentStep >= 3}>
        <Line 
          points={[[refX, -2, 0], [refX + (incLen * Math.tan(rad1)), -2 - incLen, 0]]} 
          color="#ffff00" 
          lineWidth={3} 
        />
        <Html position={[refX + 0.5, -3, 0]} center>
          <div style={{ color: '#00ff00', fontSize: '10px' }}>Lateral Displacement</div>
        </Html>
      </group>

      {/* Particle animating along path */}
      {isPlaying && currentStep >= 3 && (
        <RayParticle path={[
          [incX, 2 + incLen, 0], 
          [0, 2, 0], 
          [refX, -2, 0], 
          [refX + (incLen * Math.tan(rad1)), -2 - incLen, 0]
        ]} />
      )}

      {/* Labels */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.85)', padding: '12px 20px', borderRadius: '12px',
          border: '1px solid #88aaff', color: '#fff', textAlign: 'center', width: '250px'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#88aaff' }}>{config.label}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>{config.desc}</p>
          {currentStep === 4 && (
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#00ff00', fontFamily: 'monospace' }}>
              n₁sinθ₁ = n₂sinθ₂<br/>
              1.0 × sin({angle1}°) = 1.5 × sin({angle2.toFixed(1)}°)
            </div>
          )}
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x0a1018]} position={[0, -4, 0]} />
    </group>
  )
}

function RayParticle({ path }) {
  const ref = useRef()
  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.5) % 1
    const totalSegments = path.length - 1
    const segment = Math.floor(t * totalSegments)
    const subT = (t * totalSegments) % 1
    const p1 = path[segment]
    const p2 = path[segment + 1]
    if (ref.current && p1 && p2) {
      ref.current.position.set(
        p1[0] + (p2[0] - p1[0]) * subT,
        p1[1] + (p2[1] - p1[1]) * subT,
        p1[2] + (p2[2] - p1[2]) * subT
      )
    }
  })
  return (
    <Sphere ref={ref} args={[0.06, 8, 8]}>
      <meshBasicMaterial color="#ffffff" />
    </Sphere>
  )
}
