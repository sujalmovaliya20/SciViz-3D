// Required imports for Three.js React components:
// - Html, Text, etc → from '@react-three/drei'
// - useFrame, useThree → from '@react-three/fiber'
// - useState, useRef, etc → from 'react'
// - THREE → from 'three'

import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Html, Text, OrbitControls, Float,
  Sparkles, Line, RoundedBox
} from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import GrabbableObject from './GrabbableObject'
import GestureCursor3D from './GestureCursor3D'
import useGestureStore from '../store/useGestureStore'

// ── LAB BENCH ──────────────────────────────────────────
function LabBench({ position, color='#1a2a3a' }) {
  return (
    <group position={position}>
      {/* Bench top */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.15, 2.5]} />
        <meshStandardMaterial 
          color={color} metalness={0.3} roughness={0.7}
        />
      </mesh>
      {/* 4 legs */}
      {[[-3.5,-1,-1],[3.5,-1,-1],[-3.5,-1,1],[3.5,-1,1]].map((lp,i) => (
        <mesh key={i} position={lp} castShadow>
          <boxGeometry args={[0.15, 2, 0.15]} />
          <meshStandardMaterial color="#0d1520" metalness={0.8}/>
        </mesh>
      ))}
      {/* Shelf underneath */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[7.8, 0.08, 2.2]} />
        <meshStandardMaterial color="#0d1520" roughness={0.9}/>
      </mesh>
    </group>
  )
}

// ── BENCH 1 — MAGNETISM ────────────────────────────────
function BarMagnet({ position }) {
  const groupRef = useRef()
  useFrame(state => {
    if(groupRef.current)
      groupRef.current.rotation.y = 
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })
  return (
    <group ref={groupRef} position={position}>
      {/* N pole - red half */}
      <mesh position={[-0.75, 0, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.4]} />
        <meshStandardMaterial 
          color="#ff3355" emissive="#ff1133" 
          emissiveIntensity={0.4} metalness={0.6}
        />
      </mesh>
      {/* S pole - blue half */}
      <mesh position={[0.75, 0, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.4]} />
        <meshStandardMaterial 
          color="#3366ff" emissive="#1144cc"
          emissiveIntensity={0.3} metalness={0.6}
        />
      </mesh>
      {/* N label */}
      <PhysicsLabel text="N" position={[-0.75, 0.5, 0]} color="#ff4466" />
      {/* S label */}
      <PhysicsLabel text="S" position={[0.75, 0.5, 0]} color="#4488ff" />
      {/* Magnetic field lines (arcs) */}
      {[0.8,1.4,2.0].map((r,i) => (
        <mesh key={i} rotation={[Math.PI/2,0,0]}
          position={[0, 0, 0]}>
          <torusGeometry args={[r, 0.02, 8, 32, Math.PI]} />
          <meshStandardMaterial 
            color="#00e5ff" 
            emissive="#00e5ff"
            emissiveIntensity={0.6-i*0.15}
            transparent opacity={0.5-i*0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function Compass({ position }) {
  const needleRef = useRef()
  useFrame(state => {
    if(needleRef.current) {
      needleRef.current.rotation.y = 
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + Math.PI/4
    }
  })
  return (
    <group position={position}>
      {/* Compass body */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.8}/>
      </mesh>
      {/* Compass face */}
      <mesh position={[0,0.06,0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.02, 32]} />
        <meshStandardMaterial color="#eeeedd"/>
      </mesh>
      {/* Needle group */}
      <group ref={needleRef} position={[0,0.09,0]}>
        {/* Red half - N */}
        <mesh position={[0.1,0,0]} rotation={[0,0,Math.PI/2]}>
          <coneGeometry args={[0.04,0.2,8]} />
          <meshStandardMaterial 
            color="#ff3333" emissive="#ff1111"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* White half - S */}
        <mesh position={[-0.1,0,0]} rotation={[0,0,-Math.PI/2]}>
          <coneGeometry args={[0.04,0.2,8]} />
          <meshStandardMaterial color="#ffffff"/>
        </mesh>
      </group>
      <PhysicsLabel text="Compass" position={[0,0.5,0]} color="#ffcc44" />
    </group>
  )
}

function IronFilingTray({ position }) {
  const particles = useRef(
    Array.from({length:200}, () => ({
      x: (Math.random()-0.5)*1.6,
      z: (Math.random()-0.5)*0.8,
      angle: Math.random()*Math.PI
    }))
  )
  return (
    <group position={position}>
      {/* Tray */}
      <mesh>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#333" metalness={0.5}/>
      </mesh>
      {/* Tray walls */}
      {[
        [[0, 0.1, 0.5],[2,0.2,0.05]],
        [[0, 0.1,-0.5],[2,0.2,0.05]],
        [[1, 0.1, 0],[0.05,0.2,1]],
        [[-1,0.1, 0],[0.05,0.2,1]]
      ].map(([p,s],i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={s} />
          <meshStandardMaterial color="#333" metalness={0.5}/>
        </mesh>
      ))}
      {/* Iron filings as tiny boxes aligned to field */}
      {particles.current.map((p,i) => (
        <mesh 
          key={i}
          position={[p.x, 0.04, p.z]}
          rotation={[0, p.angle, 0]}
        >
          <boxGeometry args={[0.04, 0.01, 0.008]} />
          <meshStandardMaterial 
            color="#888" metalness={0.9} roughness={0.1}
          />
        </mesh>
      ))}
      <PhysicsLabel text="Iron Filings" position={[0, 0.5, 0]} color="#aaaaaa" />
    </group>
  )
}

// ── BENCH 2 — OPTICS ──────────────────────────────────
function OpticalBench({ position }) {
  return (
    <group position={position}>
      {/* Rail */}
      <mesh>
        <boxGeometry args={[5, 0.08, 0.12]} />
        <meshStandardMaterial color="#555" metalness={0.7}/>
      </mesh>
      {/* Object (arrow) */}
      <mesh position={[-2, 0.3, 0]}>
        <boxGeometry args={[0.05, 0.6, 0.05]} />
        <meshStandardMaterial 
          color="#ffffff" emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Lens */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial 
          color="#88bbff" transparent opacity={0.4}
          metalness={0.1} roughness={0}
        />
      </mesh>
      {/* Image (inverted arrow) */}
      <mesh position={[1.5, 0.2, 0]} rotation={[0,0,Math.PI]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#ff4d6d" emissive="#ff4d6d"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Light ray lines */}
      <Line
        points={[[-2,0.6,0],[0,0.6,0],[1.5,-0.2,0]]}
        color="#ffff44"
        lineWidth={1.5}
        transparent opacity={0.6}
      />
      <Line
        points={[[-2,0.6,0],[0,0,0],[1.5,-0.2,0]]}
        color="#ffff44"
        lineWidth={1.5}
        transparent opacity={0.4}
      />
      <PhysicsLabel text="Convex Lens Setup" position={[0, 1, 0]} color="#88bbff" />
    </group>
  )
}

function GlassPrism({ position }) {
  const groupRef = useRef()
  useFrame(state => {
    if(groupRef.current)
      groupRef.current.rotation.y += 0.005
  })
  
  const SPECTRUM_COLORS = [
    '#8B00FF','#4B0082','#0000FF',
    '#00FF00','#FFFF00','#FF7F00','#FF0000'
  ]
  
  return (
    <group ref={groupRef} position={position}>
      {/* Prism body */}
      <mesh>
        <coneGeometry args={[0.4, 0.7, 3]} />
        <meshStandardMaterial 
          color="#88aaff" transparent opacity={0.35}
          metalness={0.1} roughness={0}
        />
      </mesh>
      {/* White input beam */}
      <mesh position={[-0.8, 0, 0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial 
          color="#ffffff" emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Spectrum rays */}
      {SPECTRUM_COLORS.map((color, i) => {
        const spread = (i - 3) * 0.08
        return (
          <mesh 
            key={i}
            position={[0.5+i*0.12, spread, 0]}
            rotation={[0, 0, Math.PI/2 - spread]}
          >
            <cylinderGeometry args={[0.015,0.015,0.6,8]}/>
            <meshStandardMaterial
              color={color} emissive={color}
              emissiveIntensity={0.8}
              transparent opacity={0.8}
            />
          </mesh>
        )
      })}
      <PhysicsLabel text="Glass Prism" position={[0, 0.8, 0]} color="#ffcc44" />
    </group>
  )
}

function PlaneMirror({ position }) {
  return (
    <group position={position}>
      {/* Mirror surface */}
      <mesh>
        <boxGeometry args={[0.05, 0.8, 0.5]} />
        <meshStandardMaterial 
          color="#aabbcc" metalness={1} roughness={0}
        />
      </mesh>
      {/* Mirror stand */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.7}/>
      </mesh>
      {/* Incident ray */}
      <Line
        points={[[-0.8, 0.5, 0],[0, 0, 0]]}
        color="#ffff44" lineWidth={2}
        transparent opacity={0.7}
      />
      {/* Reflected ray */}
      <Line
        points={[[0, 0, 0],[0.8, 0.5, 0]]}
        color="#ffcc00" lineWidth={2}
        transparent opacity={0.7}
      />
    </group>
  )
}

// ── BENCH 3 — ELECTRICITY ─────────────────────────────
function ElectricCircuit({ position }) {
  const electronRefs = useRef([])
  const t = useRef(0)
  
  useFrame((_, delta) => {
    t.current += delta * 0.8
    electronRefs.current.forEach((ref, i) => {
      if (!ref) return
      const progress = (t.current * 0.5 + i/8) % 1
      // Circuit path: rectangle
      const path = getCircuitPoint(progress)
      ref.position.set(path.x, path.y + 0.1, path.z)
    })
  })

  const getCircuitPoint = (p) => {
    // Rectangle path
    const perimeter = 8
    const d = p * perimeter
    if (d < 2) return { x: -1+d, y: 0, z: -0.5 }
    if (d < 3) return { x: 1, y: 0, z: -0.5+(d-2) }
    if (d < 5) return { x: 1-(d-3), y: 0, z: 0.5 }
    return { x: -1, y: 0, z: 0.5-(d-5) }
  }

  return (
    <group position={position}>
      {/* Battery */}
      <mesh position={[-1, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.2]} />
        <meshStandardMaterial 
          color="#ffcc44" metalness={0.4}
        />
      </mesh>
      {/* + terminal */}
      <mesh position={[-1, 0.42, 0]}>
        <boxGeometry args={[0.05, 0.08, 0.05]} />
        <meshStandardMaterial color="#ff4444"/>
      </mesh>
      {/* Circuit wires */}
      <Line
        points={[[-1,-0.5,-0.5],[1,-0.5,-0.5],[1,-0.5,0.5],[-1,-0.5,0.5],[-1,-0.5,-0.5]]}
        color="#b87333" lineWidth={3}
      />
      {/* Resistor */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial color="#ff8800"/>
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0.1, 0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffaa" emissive="#ffff44"
          emissiveIntensity={0.8} transparent opacity={0.7}
        />
      </mesh>
      <pointLight position={[0,0.3,0.5]} color="#ffff44" 
        intensity={1} distance={2}/>
      {/* Electrons */}
      {Array.from({length:8}).map((_,i) => (
        <mesh 
          key={i}
          ref={el => electronRefs.current[i] = el}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial 
            color="#00e5ff" emissive="#00e5ff"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      <Html transform occlude position={[0, 0.8, 0]} center distanceFactor={5}>
        <div style={{
          color:'#ffcc44', fontSize:'10px',
          fontFamily:'Space Mono,monospace',
          pointerEvents:'none'
        }}>Electric Circuit</div>
      </Html>
    </group>
  )
}

function Galvanometer({ position }) {
  const needleRef = useRef()
  useFrame(state => {
    if(needleRef.current) {
      needleRef.current.rotation.z = 
        Math.sin(state.clock.elapsedTime * 1.5) * 0.5
    }
  })
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.3]} />
        <meshStandardMaterial color="#333" metalness={0.6}/>
      </mesh>
      {/* Dial face */}
      <mesh position={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.2,0.2,0.02,32]}/>
        <meshStandardMaterial color="#eeeedd"/>
      </mesh>
      {/* Needle */}
      <group ref={needleRef} position={[0,0,0.18]}>
        <mesh position={[0,0.08,0]}>
          <boxGeometry args={[0.02,0.15,0.01]}/>
          <meshStandardMaterial color="#ff3333"/>
        </mesh>
      </group>
      <PhysicsLabel text="Galvanometer" position={[0,0.5,0]} color="#aaaaaa" />
    </group>
  )
}

// ── BENCH 4 — MODERN PHYSICS ──────────────────────────
function BohrAtomModel({ position }) {
  const electronRefs = useRef([])
  const angles = useRef([0, Math.PI*2/3, Math.PI*4/3])
  const radii = [0.6, 1.0, 1.4]
  const speeds = [0.8, 0.5, 0.3]

  useFrame((_, delta) => {
    angles.current = angles.current.map(
      (a,i) => a + delta * speeds[i]
    )
    electronRefs.current.forEach((ref, i) => {
      if (!ref) return
      ref.position.set(
        Math.cos(angles.current[i]) * radii[i],
        Math.sin(angles.current[i]) * radii[i],
        0
      )
    })
  })

  return (
    <group position={position}>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]}/>
        <meshStandardMaterial 
          color="#ff6633" emissive="#ff4411"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight color="#ff6633" intensity={1} distance={3}/>
      {/* Orbits */}
      {radii.map((r,i) => (
        <mesh key={i} rotation={[Math.PI/2,0,i*0.3]}>
          <torusGeometry args={[r, 0.015, 8, 64]}/>
          <meshStandardMaterial 
            color="#334455" transparent opacity={0.5}
          />
        </mesh>
      ))}
      {/* Electrons */}
      {radii.map((_,i) => (
        <mesh key={i} ref={el => electronRefs.current[i]=el}>
          <sphereGeometry args={[0.06,12,12]}/>
          <meshStandardMaterial 
            color="#00e5ff" emissive="#00e5ff"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      <PhysicsLabel text="Bohr Atom (Hydrogen)" position={[0, 1.8, 0]} color="#ff6633" />
    </group>
  )
}

function GeigerCounter({ position }) {
  const [count, setCount] = useState(0)
  const [flash, setFlash] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setCount(c => c+1)
        setFlash(true)
        setTimeout(() => setFlash(false), 100)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.6, 0.35, 0.2]}/>
        <meshStandardMaterial color="#334433" metalness={0.5}/>
      </mesh>
      {/* Detection tube */}
      <mesh position={[0.5, 0, 0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.06,0.06,0.4,12]}/>
        <meshStandardMaterial color="#555" metalness={0.8}/>
      </mesh>
      {/* Flash indicator */}
      {flash && (
        <pointLight color="#ff4444" intensity={3} distance={2}/>
      )}
      <PhysicsLabel text={`☢️ Counts: ${count}`} position={[0, 0.5, 0]} color="#44ff44" />
    </group>
  )
}

// ── LAB FLOOR ─────────────────────────────────────────
function LabFloor() {
  return (
    <group>
      {/* Base floor */}
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[0,-0.5,0]} receiveShadow>
        <planeGeometry args={[40,30]}/>
        <meshStandardMaterial 
          color="#0a0f18" roughness={0.7} metalness={0.2}
        />
      </mesh>

      {/* Zone floor highlights */}
      {/* Magnetism zone - red tint */}
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[-9,-0.49,-8]}>
        <planeGeometry args={[12,10]}/>
        <meshStandardMaterial 
          color="#ff4d6d" transparent opacity={0.04}
        />
      </mesh>
      {/* Optics zone - blue tint */}
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[9,-0.49,-8]}>
        <planeGeometry args={[12,10]}/>
        <meshStandardMaterial 
          color="#88bbff" transparent opacity={0.04}
        />
      </mesh>
      {/* Electricity zone - yellow tint */}
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[-9,-0.49,4]}>
        <planeGeometry args={[12,10]}/>
        <meshStandardMaterial 
          color="#ffcc44" transparent opacity={0.04}
        />
      </mesh>
      {/* Modern Physics zone - green tint */}
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[9,-0.49,4]}>
        <planeGeometry args={[12,10]}/>
        <meshStandardMaterial 
          color="#44ff44" transparent opacity={0.04}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper 
        args={[40, 40, '#1e2a3a', '#0d1520']} 
        position={[0,-0.48,0]}
      />

      {/* Zone separator lines */}
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[0,-0.47,-2]}>
        <planeGeometry args={[0.08,28]}/>
        <meshStandardMaterial 
          color="#334455" transparent opacity={0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} 
        position={[0,-0.47,-2]}>
        <planeGeometry args={[38,0.08]}/>
        <meshStandardMaterial 
          color="#334455" transparent opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// ── BLACKBOARD ────────────────────────────────────────
function Blackboard({ position = [0, 5, -14.8] }) {
  return (
    <group position={position}>
      {/* Board mesh - wide enough */}
      <mesh castShadow>
        <boxGeometry args={[12, 5, 0.12]}/>
        <meshStandardMaterial 
          color="#0a1a0a" roughness={0.95}
        />
      </mesh>
      
      {/* Frame pieces */}
      {[
        { pos:[0, 2.6, 0],  size:[12.3, 0.2, 0.15] },
        { pos:[0,-2.6, 0],  size:[12.3, 0.2, 0.15] },
        { pos:[6.15, 0, 0], size:[0.2, 5.2, 0.15]  },
        { pos:[-6.15,0, 0], size:[0.2, 5.2, 0.15]  },
      ].map((f, i) => (
        <mesh key={i} position={f.pos}>
          <boxGeometry args={f.size}/>
          <meshStandardMaterial color="#5a3010"/>
        </mesh>
      ))}

      {/* Chalk tray */}
      <mesh position={[0, -2.8, 0.1]}>
        <boxGeometry args={[12, 0.18, 0.25]}/>
        <meshStandardMaterial color="#3a1a00"/>
      </mesh>

      {/* Formulas - attached to board */}
      <Html
        transform={true}
        occlude={true}
        position={[0, 0.3, 0.08]}
        distanceFactor={9}
        center
      >
        <div style={{
          width: '400px',
          padding: '10px',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          <div style={{
            color: '#d0e8c8',
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            lineHeight: 2.2,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            <div>F = ma &nbsp;&nbsp;&nbsp;&nbsp; E = mc²</div>
            <div>V = IR &nbsp;&nbsp;&nbsp;&nbsp; P = IV</div>
            <div style={{fontSize:'17px'}}>
              1/f = 1/v − 1/u &nbsp;&nbsp; λ = h/mv
            </div>
            <div style={{
              color:'#88ff88', fontSize:'16px'
            }}>
              Eₙ = −13.6/n² eV
            </div>
          </div>
        </div>
      </Html>

      {/* PHYSICS LAB title on board */}
      <Html
        transform={true}
        occlude={true}
        position={[0, 2.1, 0.08]}
        distanceFactor={9}
        center
      >
        <div style={{
          color: '#ffffff88',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '14px',
          letterSpacing: '4px',
          pointerEvents: 'none'
        }}>
          PHYSICS LABORATORY
        </div>
      </Html>
    </group>
  )
}

// ── AREA SIGN ─────────────────────────────────────────
function AreaSign({ position, text, icon, color }) {
  return (
    <group position={position}>
      {/* Wide background panel */}
      <mesh>
        <boxGeometry args={[5, 0.8, 0.1]}/>
        <meshStandardMaterial
          color="#0d1520"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      {/* Colored accent bar left */}
      <mesh position={[-2.3, 0, 0.06]}>
        <boxGeometry args={[0.15, 0.8, 0.05]}/>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      {/* Colored accent bar right */}
      <mesh position={[2.3, 0, 0.06]}>
        <boxGeometry args={[0.15, 0.8, 0.05]}/>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      {/* Bottom glow line */}
      <mesh position={[0, -0.42, 0.06]}>
        <boxGeometry args={[5, 0.04, 0.05]}/>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
        />
      </mesh>

      {/* Sign text */}
      <Html
        transform={true}
        occlude={true}
        position={[0, 0, 0.08]}
        distanceFactor={7}
        center
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          <span style={{fontSize:'20px'}}>{icon}</span>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '18px',
            color: '#ffffff',
            letterSpacing: '2px'
          }}>
            {text}
          </span>
        </div>
      </Html>

      {/* Colored glow below */}
      <pointLight
        color={color}
        intensity={2}
        distance={10}
        position={[0, -1.5, 1]}
      />
    </group>
  )
}

// ── CUSTOM HTML LABEL ─────────────────────────────────
function PhysicsLabel({ text, position, color='#e0eaff' }) {
  return (
    <Html
      position={position}
      center
      transform={true}
      occlude={true}
      distanceFactor={5}
    >
      <div style={{
        background: 'rgba(6,8,15,0.88)',
        border: `1px solid ${color}44`,
        borderRadius: '6px',
        padding: '3px 10px',
        color: color,
        fontFamily: 'Space Mono, monospace',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        fontWeight: 700
      }}>
        {text}
      </div>
    </Html>
  )
}

// ── MAIN PHYSICS LAB INTERIOR ─────────────────────────
export default function PhysicsLabInterior({ 
  onExperimentOpen,
  gestureEnabled = false
}) {
  const [inspecting, setInspecting] = useState(null)
  const navigate = useNavigate()

  return (
    <Suspense fallback={<Html center><div style={{color:'#aaccff'}}>Loading Lab...</div></Html>}>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#1a2a4a"/>
      <pointLight position={[0,8,0]} intensity={1} color="#aaccff"/>
      <pointLight position={[-9,4,-8]} intensity={2} color="#ff4d6d" distance={8}/>
      <pointLight position={[9,4,-8]} intensity={2} color="#88bbff" distance={8}/>
      <pointLight position={[-9,4,4]} intensity={2} color="#ffcc44" distance={8}/>
      <pointLight position={[9,4,4]} intensity={2} color="#44ff44" distance={8}/>

      {/* Blackboard Spotlight */}
      <spotLight
        position={[0, 10, -10]}
        target-position={[0, 5, -14.8]}
        intensity={3}
        color="#ffffee"
        angle={0.4}
        penumbra={0.3}
        castShadow
      />

      {/* Ceiling light panels */}
      {[[-10,10.5,-5], [10,10.5,-5], [-10,10.5,5], [10,10.5,5]].map((pos, i) => (
        <group key={i}>
          <mesh position={pos}>
            <boxGeometry args={[3, 0.1, 1.5]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#aaccff"
              emissiveIntensity={0.8}
            />
          </mesh>
          <rectAreaLight
            position={[pos[0], pos[1]-0.1, pos[2]]}
            width={3} height={1.5}
            intensity={8}
            color="#aaccff"
            rotation={[Math.PI/2, 0, 0]}
          />
        </group>
      ))}

      {/* Room Structure */}
      <LabFloor />

      {/* Walls */}
      <mesh position={[0, 5, -15]} receiveShadow>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#080c14" roughness={0.9}/>
      </mesh>
      <mesh position={[-20, 5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#080c14" roughness={0.9}/>
      </mesh>
      <mesh position={[20, 5, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#080c14" roughness={0.9}/>
      </mesh>
      <mesh position={[0, 11, 0]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#060810" roughness={1}/>
      </mesh>

      {/* Benches */}
      <LabBench position={[-9,0.5,-8.5]} color="#1a2a3a"/>
      <LabBench position={[9,0.5,-8.5]}  color="#1a2030"/>
      <LabBench position={[-9,0.5,4]}  color="#1a2a1a"/>
      <LabBench position={[9,0.5,4]}   color="#1a2a1a"/>

      {/* Blackboard */}
      <Blackboard position={[0, 5, -14.8]}/>

      {/* Area Signs */}
      <AreaSign position={[-9, 4.5, -11.5]} text="MAGNETISM" icon="🧲" color="#ff4d6d"/>
      <AreaSign position={[9, 4.5, -11.5]}  text="OPTICS" icon="🔭" color="#88bbff"/>
      <AreaSign position={[-9, 4.5, 2.5]}   text="ELECTRICITY" icon="⚡" color="#ffcc44"/>
      <AreaSign position={[9, 4.5, 2.5]}    text="MODERN PHYSICS" icon="☢️" color="#44ff44"/>

      {/* Experiment Props with Repositioning */}
      {/* Bench 1 - Magnetism */}
      <BarMagnet position={[-11, 1.35, -9.5]}/>
      <Compass position={[-9, 1.35, -9.5]}/>
      <IronFilingTray position={[-7, 1.25, -9.5]}/>

      {/* Bench 2 - Optics */}
      <OpticalBench position={[9, 1.25, -8.5]}/>
      <GlassPrism position={[12, 1.5, -9.5]}/>
      <PlaneMirror position={[6.5, 1.5, -9.5]}/>

      {/* Bench 3 - Electricity */}
      <ElectricCircuit position={[-9, 1.2, 3.5]}/>
      <Galvanometer position={[-11, 1.5, 4.5]}/>
      <GrabbableObject
        id="resistor-lab"
        initialPosition={[-9, 2.8, 3.5]}
        color="#ff8800"
        shape="box"
        label="Resistor (10Ω)"
        onInspect={setInspecting}
      />

      {/* Bench 4 - Modern Physics */}
      <BohrAtomModel position={[9, 1.5, 3.5]}/>
      <GeigerCounter position={[11, 1.5, 4.5]}/>

      {/* Grabbable Objects — 1.5 units above bench */}
      <GrabbableObject
        id="bar-magnet-lab"
        initialPosition={[-11, 2.8, -9.5]}
        color="#ff4d6d"
        shape="cylinder"
        label="Bar Magnet"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="compass-lab"
        initialPosition={[-9, 2.8, -9.5]}
        color="#00e5ff"
        shape="sphere"
        label="Compass"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="horseshoe-magnet"
        initialPosition={[-7, 2.8, -9.5]}
        color="#ff8800"
        shape="torus"
        label="Horseshoe Magnet"
        onInspect={setInspecting}
      />

      <GrabbableObject
        id="convex-lens-lab"
        initialPosition={[7, 2.8, -9.5]}
        color="#88bbff"
        shape="sphere"
        label="Convex Lens"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="prism-lab"
        initialPosition={[9, 2.8, -9.5]}
        color="#a855f7"
        shape="cone"
        label="Glass Prism"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="mirror-lab"
        initialPosition={[11, 2.8, -9.5]}
        color="#aabbcc"
        shape="box"
        label="Plane Mirror"
        onInspect={setInspecting}
      />

      <GrabbableObject
        id="battery-lab"
        initialPosition={[-11, 2.8, 3.5]}
        color="#ffcc44"
        shape="cylinder"
        label="Battery (6V)"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="bulb-lab"
        initialPosition={[-7, 2.8, 3.5]}
        color="#ffffaa"
        shape="sphere"
        label="Light Bulb"
        onInspect={setInspecting}
      />

      <GrabbableObject
        id="geiger-lab"
        initialPosition={[7, 2.8, 3.5]}
        color="#44ff44"
        shape="box"
        label="Geiger Counter"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="atom-model-lab"
        initialPosition={[9, 2.8, 3.5]}
        color="#ff6633"
        shape="sphere"
        label="Atom Model"
        onInspect={setInspecting}
      />
      <GrabbableObject
        id="spectroscope"
        initialPosition={[11, 2.8, 3.5]}
        color="#00ffcc"
        shape="cylinder"
        label="Spectroscope"
        onInspect={setInspecting}
      />

      {/* Gesture Cursor */}
      <GestureCursor3D enabled={gestureEnabled}/>

      {/* Inspect Panel */}
      {inspecting && (
        <Html position={[0,5,0]} center>
          <div style={{
            background:'rgba(6,8,15,0.97)',
            border:`1px solid ${inspecting.color}`,
            borderRadius:'16px',
            padding:'24px',
            minWidth:'280px',
            boxShadow:`0 0 30px ${inspecting.color}44`
          }}>
            <h3 style={{
              color:inspecting.color,
              fontFamily:'Syne,sans-serif',
              fontWeight:800, fontSize:'18px',
              marginBottom:'10px'
            }}>
              {inspecting.label}
            </h3>
            <p style={{
              color:'#4a5a7a',
              fontFamily:'Space Mono,monospace',
              fontSize:'11px', lineHeight:1.6,
              marginBottom:'16px'
            }}>
              Click "Open Experiment" to explore 
              this in full 3D interactive mode.
            </p>
            <div style={{display:'flex',gap:'8px'}}>
              <button
                onClick={() => {
                  const map = {
                    'Bar Magnet':'magnetic-field-bar',
                    'Convex Lens':'convex-lens',
                    'Glass Prism':'prism-dispersion',
                    'Plane Mirror':'reflection',
                    'Battery (6V)':'ohms-law',
                    'Resistor (10Ω)':'ohms-law',
                    'Light Bulb':'ohms-law',
                    'Atom Model':'bohr-atom',
                    'Geiger Counter':'radioactive-decay',
                    'Compass':'oersted',
                    'Spectroscope':'prism-dispersion',
                  }
                  const key = map[inspecting.label]
                  if(key) navigate(`/experiment/${key}`)
                  setInspecting(null)
                }}
                style={{
                  flex:1, padding:'9px',
                  background:inspecting.color,
                  color:'#000', border:'none',
                  borderRadius:'8px',
                  fontFamily:'Syne,sans-serif',
                  fontWeight:800, fontSize:'13px',
                  cursor:'pointer'
                }}
              >Open Experiment →</button>
              <button
                onClick={() => setInspecting(null)}
                style={{
                  padding:'9px 14px',
                  background:'transparent',
                  color:'#4a5a7a',
                  border:'1px solid #1e2a3a',
                  borderRadius:'8px',
                  cursor:'pointer', fontSize:'13px'
                }}
              >✕</button>
            </div>
          </div>
        </Html>
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        target={[0, 2, -4]}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minDistance={4}
        maxDistance={30}
        maxAzimuthAngle={Math.PI / 1.2}
        minAzimuthAngle={-Math.PI / 1.2}
      />
    </Suspense>
  )
}
