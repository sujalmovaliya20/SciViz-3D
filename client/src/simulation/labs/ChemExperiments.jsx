// Required imports for Three.js React components:
// - Html, Text, etc → from '@react-three/drei'
// - useFrame, useThree → from '@react-three/fiber'
// - useState, useRef, etc → from 'react'
// - THREE → from 'three'

import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// ── ELECTROLYSIS EXPERIMENT ───────────────────────────
export function ElectrolysisSetup({ position }) {
  const [isActive, setIsActive] = useState(false)
  const bubblesRef = useRef([])

  useFrame((_, delta) => {
    if (!isActive) return
    bubblesRef.current.forEach((b, i) => {
      if (!b) return
      b.position.y += delta * (0.3 + i * 0.05)
      if (b.position.y > 1.5) {
        b.position.y = 0.1
        b.position.x = (Math.random() - 0.5) * 0.3
      }
    })
  })

  return (
    <group position={position}>
      {/* Glass container */}
      <mesh>
        <boxGeometry args={[1.2, 1.5, 0.6]}/>
        <meshStandardMaterial
          color="#88aaff"
          transparent opacity={0.15}
          metalness={0.1} roughness={0}
        />
      </mesh>
      {/* Water fill */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.1, 1.0, 0.5]}/>
        <meshStandardMaterial
          color="#4488ff"
          transparent opacity={0.25}
        />
      </mesh>
      {/* Cathode electrode */}
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.06, 1.2, 0.06]}/>
        <meshStandardMaterial color="#888" metalness={0.9}/>
      </mesh>
      {/* Anode electrode */}
      <mesh position={[0.3, 0, 0]}>
        <boxGeometry args={[0.06, 1.2, 0.06]}/>
        <meshStandardMaterial color="#cc8800" metalness={0.9}/>
      </mesh>
      {/* Bubbles */}
      {Array.from({length: 6}).map((_, i) => (
        <mesh
          key={i}
          ref={el => bubblesRef.current[i] = el}
          position={[
            i < 3 ? -0.3 : 0.3,
            0.1 + i * 0.2,
            (Math.random()-0.5)*0.2
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]}/>
          <meshStandardMaterial
            color={i < 3 ? "#aaddff" : "#ffaaaa"}
            transparent opacity={0.7}
          />
        </mesh>
      ))}

      {/* Activation button */}
      <Html
        position={[0, 1.2, 0]}
        center transform occlude
        distanceFactor={5}
      >
        <div style={{
          textAlign:'center',
          pointerEvents:'all'
        }}>
          <div style={{
            background:'rgba(6,8,15,0.92)',
            border:`1px solid ${isActive ? '#00e5ff' : '#334455'}`,
            borderRadius:'8px',
            padding:'8px 12px',
            color: isActive ? '#00e5ff' : '#4a5a7a',
            fontFamily:'Space Mono,monospace',
            fontSize:'11px',
            marginBottom:'6px',
            minWidth:'130px',
            boxShadow:'0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              fontWeight:700, marginBottom:'4px',
              color: isActive ? '#00e5ff' : '#8899bb'
            }}>
              ⚡ Electrolysis
            </div>
            {isActive ? (
              <>
                <div>Cathode: H₂ ↑</div>
                <div>Anode: O₂ ↑</div>
                <div style={{
                  fontSize:'10px', marginTop:'4px',
                  color:'#4a5a7a'
                }}>2H₂O → 2H₂ + O₂</div>
              </>
            ) : (
              <div style={{fontSize:'10px'}}>
                Click to start
              </div>
            )}
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            style={{
              padding:'5px 16px',
              background: isActive ? '#ff4d6d' : '#00e5ff',
              color:'#000',
              border:'none',
              borderRadius:'6px',
              fontFamily:'Syne,sans-serif',
              fontWeight:700,
              fontSize:'11px',
              cursor:'pointer',
              boxShadow:'0 0 10px rgba(0,229,255,0.3)'
            }}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        </div>
      </Html>
    </group>
  )
}

// ── FLAME TEST EXPERIMENT ─────────────────────────────
export function FlameTest({ position, chemical='NaCl' }) {
  const FLAME_COLORS = {
    'NaCl': '#ffcc00',    // Yellow - sodium
    'KCl':  '#cc44ff',   // Violet - potassium
    'CaCl₂': '#ff4400',  // Brick red - calcium
    'CuCl₂': '#44ff88',  // Green - copper
    'LiCl':  '#ff2222',  // Crimson - lithium
    'BaCl₂': '#88ff44',  // Apple green - barium
  }
  const flameColor = FLAME_COLORS[chemical] || '#ff8800'

  return (
    <group position={position}>
      {/* Bunsen flame */}
      <mesh>
        <coneGeometry args={[0.06, 0.2, 16]}/>
        <meshStandardMaterial
          color={flameColor}
          emissive={flameColor}
          emissiveIntensity={3}
          transparent opacity={0.8}
        />
      </mesh>
      <pointLight 
        color={flameColor} 
        intensity={3} 
        distance={2}
      />
      
      {/* NaCl Flame test - attach to bench */}
      <Html
        position={[0, 0.5, 0]}
        center transform occlude
        distanceFactor={5}
      >
        <div style={{
          background:'rgba(6,8,15,0.88)',
          border:`1px solid ${flameColor}44`,
          borderRadius:'8px',
          padding:'6px 10px',
          color: flameColor,
          fontFamily:'Space Mono,monospace',
          fontSize:'10px',
          pointerEvents:'none',
          textAlign:'center'
        }}>
          <div style={{
            fontWeight:700,
            marginBottom:'3px',
            color: flameColor
          }}>
            🔥 {chemical} Flame Test
          </div>
          <div style={{opacity: 0.7}}>Color = element ID</div>
        </div>
      </Html>
    </group>
  )
}

// ── TITRATION EXPERIMENT ──────────────────────────────
export function TitrationSetup({ position }) {
  const [drops, setDrops] = useState(0)
  const [pH, setPH] = useState(7.0)

  const addDrop = () => {
    const newDrops = drops + 1
    setDrops(newDrops)
    // pH changes as NaOH added to HCl
    const newPH = Math.min(14, 1.0 + newDrops * 0.4)
    setPH(parseFloat(newPH.toFixed(1)))
  }

  const getColor = (ph) => {
    if (ph < 4) return '#ff4444'
    if (ph < 7) return '#ff8800'
    if (ph === 7) return '#44ff44'
    if (ph < 10) return '#4488ff'
    return '#aa44ff'
  }

  const getStatus = (ph) => {
    if (ph < 7) return 'Acidic'
    if (ph === 7) return 'Neutral ✓'
    return 'Basic'
  }

  return (
    <group position={position}>
      {/* Burette stand */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 2.5, 0.06]}/>
        <meshStandardMaterial color="#555" metalness={0.8}/>
      </mesh>
      {/* Base */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.4]}/>
        <meshStandardMaterial color="#333" metalness={0.8}/>
      </mesh>
      {/* Burette */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 12]}/>
        <meshStandardMaterial
          color="#88aaff" transparent opacity={0.4}
        />
      </mesh>
      {/* Conical flask */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.25, 0.1, 0.5, 16]}/>
        <meshStandardMaterial
          color={getColor(pH)}
          transparent opacity={0.5}
        />
      </mesh>

      {/* Info panel - attached above */}
      <Html
        position={[0.8, 0.8, 0]}
        center transform occlude
        distanceFactor={5}
      >
        <div style={{
          background:'rgba(6,8,15,0.92)',
          border:`1px solid ${getColor(pH)}66`,
          borderRadius:'8px',
          padding:'8px 12px',
          minWidth:'120px',
          textAlign:'center',
          pointerEvents:'all',
          boxShadow:'0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            color:'#8899bb',
            fontFamily:'Space Mono,monospace',
            fontSize: '10px',
            fontWeight:700,
            marginBottom:'6px'
          }}>
            🧪 TITRATION
          </div>
          <div style={{
            fontFamily:'Space Mono,monospace',
            fontSize:'11px', color:'#e0eaff',
            marginBottom:'3px'
          }}>
            Drops: {drops}
          </div>
          <div style={{
            fontSize:'13px',
            color: getColor(pH),
            fontWeight:700,
            fontFamily:'Syne,sans-serif',
            marginBottom:'3px'
          }}>
            pH: {pH}
          </div>
          <div style={{
            fontSize:'10px',
            color: getColor(pH),
            fontFamily:'Space Mono,monospace',
            marginBottom:'8px'
          }}>
            {getStatus(pH)}
          </div>
          <button
            onClick={addDrop}
            disabled={drops >= 30}
            style={{
              padding:'4px 12px',
              background: drops >= 30 ? '#1e2a3a' : '#a855f7',
              color: drops >= 30 ? '#4a5a7a' : '#fff',
              border:'none',
              borderRadius:'5px',
              fontFamily:'Syne,sans-serif',
              fontWeight:700,
              fontSize:'11px',
              cursor: drops >= 30 ? 'not-allowed' : 'pointer',
              marginRight:'4px',
              boxShadow:'0 0 10px rgba(168,85,247,0.3)'
            }}
          >
            + Drop
          </button>
          <button
            onClick={() => { setDrops(0); setPH(7.0) }}
            style={{
              padding:'4px 8px',
              background:'transparent',
              color:'#4a5a7a',
              border:'1px solid #1e2a3a',
              borderRadius:'5px',
              fontFamily:'Space Mono,monospace',
              fontSize:'10px',
              cursor:'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </Html>
    </group>
  )
}
