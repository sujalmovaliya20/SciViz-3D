import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Cylinder, Box, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

export default function ElectrolyticCell({ 
  currentStep = 0, 
  isPlaying = false 
}) {
  const stepConfigs = [
    {
      label: 'Electrolytic Cell Setup',
      desc: 'A beaker contains CuSO₄ solution with two copper electrodes.',
      current: 0
    },
    {
      label: 'Ion Migration',
      desc: 'Battery ON. Cations (Cu²⁺) move to Cathode (-), Anions (SO₄²⁻) move to Anode (+).',
      current: 1
    },
    {
      label: 'Cathode Reaction',
      desc: 'Reduction: Cu²⁺ + 2e⁻ → Cu. Pure copper deposits on the cathode.',
      current: 1
    },
    {
      label: 'Anode Reaction', 
      desc: 'Oxidation: Cu → Cu²⁺ + 2e⁻. Copper dissolves from anode into solution.',
      current: 1
    },
    {
      label: 'Electroplating Complete',
      desc: 'Anode has thinned, Cathode has thickened with newly deposited copper.',
      current: 0
    }
  ]

  const config = stepConfigs[Math.min(currentStep, 4)]
  const groupRef = useRef()
  const ionGroupRef = useRef()

  // Generate random ion positions
  const ions = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      position: [Math.random() * 2.5 - 1.25, Math.random() * 3 - 2, Math.random() * 2.5 - 1.25],
      type: Math.random() > 0.5 ? 'Cu' : 'SO4'
    }))
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current && isPlaying) {
      groupRef.current.rotation.y += delta * 0.1
    }

    if (config.current > 0 && ionGroupRef.current && isPlaying) {
      ionGroupRef.current.children.forEach((ion, i) => {
        const type = ions[i].type
        if (type === 'Cu') {
          // Cations (+) go to Cathode (-) at x = -1.5
          ion.position.x -= delta * 0.5
          if (ion.position.x < -1.5) ion.position.x = 1.5
        } else {
          // Anions (-) go to Anode (+) at x = 1.5
          ion.position.x += delta * 0.5
          if (ion.position.x > 1.5) ion.position.x = -1.5
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4, 0]} />

      {/* Beaker */}
      <Cylinder args={[2, 2, 4.5, 32]} position={[0, -1, 0]}>
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.2} 
          roughness={0} 
          transmission={0.8} 
          thickness={0.5} 
        />
      </Cylinder>

      {/* Electrolyte (CuSO4 - Blue) */}
      <Cylinder args={[1.9, 1.9, 3.8, 32]} position={[0, -1.3, 0]}>
        <meshStandardMaterial color="#0077ff" transparent opacity={0.4} />
      </Cylinder>

      {/* Electrodes */}
      {/* Cathode (-) */}
      <group position={[-1.5, 0, 0]}>
        <Cylinder args={[0.3, 0.3, 4, 16]} scale-y={currentStep === 4 ? 1.2 : 1}>
          <meshStandardMaterial color={currentStep === 4 ? "#b87333" : "#7b3f00"} metalness={0.8} />
        </Cylinder>
        <Html position={[0, 2.5, 0]} center>
          <div style={{ color: '#ff4d6d', fontWeight: 'bold', fontSize: '10px' }}>CATHODE (-)</div>
        </Html>
      </group>

      {/* Anode (+) */}
      <group position={[1.5, 0, 0]}>
        <Cylinder args={[currentStep === 4 ? 0.15 : 0.3, currentStep === 4 ? 0.15 : 0.3, 4, 16]}>
          <meshStandardMaterial color="#b87333" metalness={0.8} />
        </Cylinder>
        <Html position={[0, 2.5, 0]} center>
          <div style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '10px' }}>ANODE (+)</div>
        </Html>
      </group>

      {/* Ions */}
      <group ref={ionGroupRef} visible={config.current > 0}>
        {ions.map((ion, i) => (
          <Sphere key={i} args={[0.08, 8, 8]} position={ion.position}>
            <meshStandardMaterial 
              color={ion.type === 'Cu' ? '#ffcc00' : '#ffffff'} 
              emissive={ion.type === 'Cu' ? '#ffcc00' : '#ffffff'}
              emissiveIntensity={0.5}
            />
          </Sphere>
        ))}
      </group>

      {/* Battery & Wires (Simplified) */}
      <group position={[0, 3, 0]}>
        <Box args={[1.5, 0.8, 0.5]}>
          <meshStandardMaterial color="#333" />
        </Box>
        <Html position={[0, 0, 0.3]} center>
          <div style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: '12px' }}>BATTERY</div>
        </Html>
        <Line 
          points={[[-0.75, 0, 0], [-1.5, 0, 0], [-1.5, -0.5, 0]]} 
          color="#ff4d6d" 
          lineWidth={2} 
        />
        <Line 
          points={[[0.75, 0, 0], [1.5, 0, 0], [1.5, -0.5, 0]]} 
          color="#00e5ff" 
          lineWidth={2} 
        />
      </group>

      {/* Info Label */}
      <Html position={[0, -4.5, 0]} center>
        <div style={{
          background: 'rgba(6, 8, 15, 0.9)', border: '1px solid #1e2a3a', borderRadius: '12px',
          padding: '16px 24px', color: '#e0eaff', fontFamily: 'Space Mono, monospace',
          fontSize: '13px', width: '320px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div style={{ color: '#00e5ff', fontWeight: 800, marginBottom: '8px', fontSize: '15px' }}>
            {config.label}
          </div>
          <div style={{ color: '#4a5a7a', lineHeight: 1.4 }}>{config.desc}</div>
        </div>
      </Html>

      <OrbitControls enableZoom={false} />
    </group>
  )
}
