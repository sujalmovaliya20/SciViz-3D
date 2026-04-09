// Required imports for Three.js React components:
// - Html, Text, etc → from '@react-three/drei'
// - useFrame, useThree → from '@react-three/fiber'
// - useState, useRef, etc → from 'react'
// - THREE → from 'three'

import { 
  useRef, useState, useEffect, 
  useCallback, Suspense 
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, Html, Text, 
  useTexture, Sky, Environment,
  Float, Sparkles, Line
} from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import useGestureStore from '../../store/useGestureStore'
import LabProp from './LabProp'
import GestureCursor3D from '../GestureCursor3D'
import {
  Beaker, ConicalFlask, TestTubeRack, BunsenBurner,
  MeasuringCylinder, TripodStand, WeighingBalance,
  Dropper, RoundBottomFlask, TestTube
} from './ChemProps'
import { 
  ElectrolysisSetup, 
  TitrationSetup, 
  FlameTest 
} from './ChemExperiments'

export default function ChemistryLab({ gestureEnabled }) {
  const [inspecting, setInspecting] = useState(null)
  const [activeExperiment, setActiveExperiment] = useState(null)

  return (
    <>
      {/* ── LIGHTING ── realistic lab lighting */}
      <ambientLight intensity={0.6} color="#e8f4ff" />
      
      {/* Overhead fluorescent lights */}
      <rectAreaLight
        width={3} height={1}
        intensity={8} color="#f0f8ff"
        position={[-3, 4.8, -2]}
        rotation={[-Math.PI/2, 0, 0]}
      />
      <rectAreaLight
        width={3} height={1}
        intensity={8} color="#f0f8ff"
        position={[3, 4.8, -2]}
        rotation={[-Math.PI/2, 0, 0]}
      />
      <rectAreaLight
        width={3} height={1}
        intensity={8} color="#f0f8ff"
        position={[0, 4.8, 3]}
        rotation={[-Math.PI/2, 0, 0]}
      />

      {/* Window light from left */}
      <directionalLight
        position={[-10, 6, 0]}
        intensity={1.5}
        color="#fff9e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* ── ROOM STRUCTURE ── */}
      <LabRoom />

      {/* ── LAB FURNITURE ── */}
      <LabBenches />

      {/* ── GRABBABLE PROPS ── */}
      <LabProps 
        onInspect={setInspecting}
        onStartExperiment={setActiveExperiment}
      />

      {/* ── EXPERIMENT SETUPS ── */}
      {/* Bench 1 (Left Front) */}
      <ElectrolysisSetup 
        position={[-7, 0.95, 2]} 
      />
      
      {/* Bench 2 (Right Front) */}
      <TitrationSetup 
        position={[7, 0.95, 2]} 
      />
      <FlameTest 
        position={[8, 0.95, 2.3]}
        chemical="NaCl"
      />

      {/* Wall mounted elements */}
      <ChemicalShelf position={[-8, 3.5, -7.9]}/>
      <ChemicalShelf position={[8, 3.5, -7.9]}/>
      <VentilationControl position={[9.9, 4, -4]}/>

      {/* ── GESTURE CURSOR ── */}
      <GestureCursor3D enabled={gestureEnabled} />

      {/* ── WALK CONTROLS ── */}
      <WalkControls />

      {/* ── UI OVERLAY ── */}
      {inspecting && (
        <Html center>
          <div style={{
            background: 'rgba(13,17,23,0.95)',
            border: `1px solid ${inspecting.color}`,
            borderRadius: '12px',
            padding: '20px',
            color: '#fff',
            fontFamily: 'Space Mono, monospace',
            minWidth: '240px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${inspecting.color}33`
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: inspecting.color }}>{inspecting.label}</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.9 }}>
              {inspecting.info || `Standard ${inspecting.label.toLowerCase()} for chemical laboratory use.`}
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setInspecting(null)}
                style={{
                  background: inspecting.color,
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  )
}

// ── ROOM WALLS FLOOR CEILING ──────────────────────────
function LabRoom() {
  const wallColor = '#e8e0d0'
  const floorColor = '#b0a898'
  const ceilColor = '#f5f5f0'

  return (
    <group>
      {/* Floor — tiled */}
      <mesh rotation={[-Math.PI/2, 0, 0]} 
        position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI/2, 0, 0]} 
        position={[0, 5, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color={ceilColor} roughness={0.9}/>
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -8]} receiveShadow>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8}/>
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 2.5, 8]} 
        rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8}/>
      </mesh>

      {/* Left wall with windows */}
      <mesh position={[-10, 2.5, 0]} 
        rotation={[0, Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8}/>
      </mesh>

      {/* Windows on left wall */}
      {[-3, 3].map((z, i) => (
        <group key={i} position={[-9.9, 2.8, z]}>
          {/* Window frame */}
          <mesh>
            <boxGeometry args={[0.1, 2.2, 1.8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Window glass */}
          <mesh position={[0.06, 0, 0]}>
            <planeGeometry args={[1.6, 2.0]} />
            <meshStandardMaterial
              color="#a8d4f5"
              transparent opacity={0.3}
              roughness={0}
              metalness={0}
            />
          </mesh>
        </group>
      ))}

      {/* Right wall */}
      <mesh position={[10, 2.5, 0]}
        rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial color={wallColor} roughness={0.8}/>
      </mesh>

      {/* Skirting boards */}
      {[
        [0, 0.05, -7.9, 0], [0, 0.05, 7.9, Math.PI],
        [-9.9, 0.05, 0, Math.PI/2], [9.9, 0.05, 0, -Math.PI/2]
      ].map(([x, y, z, ry], i) => (
        <mesh key={i} position={[x, y, z]} 
          rotation={[0, ry, 0]}>
          <boxGeometry args={[20, 0.1, 0.15]} />
          <meshStandardMaterial color="#8a8070" />
        </mesh>
      ))}

      {/* Whiteboard on back wall - clean version */}
      <group position={[0, 2.8, -7.8]}>
        <mesh>
          <boxGeometry args={[5, 1.8, 0.05]} />
          <meshStandardMaterial
            color="#e8ffe8" roughness={0.1}
          />
        </mesh>
        <Html 
          position={[0, 0, 0.1]} 
          center 
          transform
          occlude
          distanceFactor={6}
        >
          <div style={{
            width: '300px', padding: '12px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px', color: '#1a4a1a',
            lineHeight: 1.6,
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}>
            <div style={{fontWeight:700, fontSize:'12px', marginBottom:'4px'}}>
              🧪 CHEMISTRY LABORATORY
            </div>
            <div>Phase 9: Interactive Simulations</div>
            <div style={{marginTop:'4px', opacity:0.7}}>
              • Molecular Analysis active<br/>
              • Ventilation systems optimal<br/>
              • Safety protocols engaged
            </div>
          </div>
        </Html>
      </group>

      {/* Fume hood on back wall */}
      <FumeHood position={[6, 0, -7.5]} />

      {/* Storage shelves on right wall */}
      <StorageShelves position={[9.5, 0, -3]} />

      {/* Sink on back-left */}
      <Sink position={[-7, 0, -7.5]} />

      {/* ── ADDITIONAL ROOM ELEMENTS ── */}
      <SafetyShower position={[-9.8, 0, 0]} />
      <FireExtinguisher position={[-9.8, 0, 5]} />
      <StorageCabinet position={[9.8, 0, -6]} />
      <StorageCabinet position={[9.8, 0, -4.5]} />
    </group>
  )
}

// ── LAB BENCHES ──────────────────────────────────────
function LabBenches() {
  const benchColor = '#2a1f14'
  const legColor = '#1a1510'

  const benches = [
    { pos: [-7, 0, 2], rot: 0 },     // Bench 1: Front-Left
    { pos: [7, 0, 2], rot: 0 },      // Bench 2: Front-Right
    { pos: [-7, 0, -6], rot: 0 },    // Bench 3: Back-Left
    { pos: [7, 0, -6], rot: 0 },     // Bench 4: Back-Right
  ]

  return (
    <group>
      {benches.map((b, i) => (
        <group key={i} position={b.pos}>
          {/* Bench top */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.08, 1.4]} />
            <meshStandardMaterial
              color={benchColor}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
          {/* Bench legs */}
          {[[-2, -2], [-2, 2], [2, -2], [2, 2]].map(
            ([lx, lz], li) => (
              <mesh key={li} 
                position={[lx*0.9, 0.44, lz*0.3]} castShadow>
                <boxGeometry args={[0.08, 0.88, 0.08]} />
                <meshStandardMaterial color={legColor}/>
              </mesh>
            )
          )}
          {/* Under-bench shelf */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[3.8, 0.05, 1.1]} />
            <meshStandardMaterial color={benchColor} roughness={0.5}/>
          </mesh>
          {/* Reagent shelf at back of bench */}
          <mesh position={[0, 1.35, -0.6]} rotation={[0,0,0]}>
            <boxGeometry args={[4.2, 0.04, 0.2]} />
            <meshStandardMaterial color="#888070" roughness={0.5}/>
          </mesh>
          {/* Shelf supports */}
          {[-2, 0, 2].map((sx, si) => (
            <mesh key={si} position={[sx, 1.15, -0.6]}>
              <boxGeometry args={[0.04, 0.4, 0.2]} />
              <meshStandardMaterial color="#666"/>
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// ── FUME HOOD ─────────────────────────────────────────
function FumeHood({ position }) {
  return (
    <group position={position}>
      {/* Cabinet body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2, 2.4, 0.8]} />
        <meshStandardMaterial color="#d0cfc8" roughness={0.4}/>
      </mesh>
      {/* Glass front */}
      <mesh position={[0, 1.5, 0.41]}>
        <boxGeometry args={[1.8, 1.2, 0.02]} />
        <meshStandardMaterial
          color="#88aacc" transparent opacity={0.25}
          roughness={0} metalness={0.1}
        />
      </mesh>
      {/* Sash handle */}
      <mesh position={[0, 1.5, 0.43]}>
        <boxGeometry args={[1.6, 0.05, 0.03]}/>
        <meshStandardMaterial color="#555" metalness={0.8}/>
      </mesh>
      {/* Work surface */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2, 0.08, 0.8]}/>
        <meshStandardMaterial color="#222" roughness={0.2}/>
      </mesh>
      <Html 
        position={[0, 2.6, 0.45]} 
        center 
        transform
        occlude
        distanceFactor={5}
      >
        <div style={{
          background:'rgba(0,0,0,0.85)',
          color:'#ffcc44',
          fontFamily:'Space Mono,monospace',
          fontSize:'10px', padding:'3px 10px',
          borderRadius:'4px', whiteSpace:'nowrap',
          border: '1px solid #ffcc44',
          boxShadow: '0 0 10px rgba(255, 204, 68, 0.3)',
          pointerEvents: 'none'
        }}>
          ⚠️ FUME HOOD — Ventilation ON
        </div>
      </Html>
    </group>
  )
}

// ── SINK ──────────────────────────────────────────────
function Sink({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Sink basin */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]}/>
        <meshStandardMaterial 
          color="#aabbcc" metalness={0.7} roughness={0.3}
        />
      </mesh>
      {/* Sink basin interior (deeper) */}
      <mesh position={[0, 0.77, 0]}>
        <boxGeometry args={[1.0, 0.12, 0.65]}/>
        <meshStandardMaterial 
          color="#8899aa" metalness={0.6} roughness={0.4}
        />
      </mesh>
      {/* Tap/Faucet vertical pipe */}
      <mesh position={[0, 1.1, -0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 8]}/>
        <meshStandardMaterial 
          color="#cccccc" metalness={0.9} roughness={0.1}
        />
      </mesh>
      {/* Tap horizontal arm */}
      <mesh 
        position={[0, 1.2, -0.2]} 
        rotation={[Math.PI/2, 0, 0]}
      >
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]}/>
        <meshStandardMaterial 
          color="#cccccc" metalness={0.9} roughness={0.1}
        />
      </mesh>
      {/* Tap nozzle */}
      <mesh position={[0, 1.13, -0.11]}>
        <cylinderGeometry args={[0.015, 0.025, 0.06, 8]}/>
        <meshStandardMaterial 
          color="#aaaaaa" metalness={0.8} roughness={0.2}
        />
      </mesh>
      {/* Drain */}
      <mesh position={[0, 0.79, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 12]}/>
        <meshStandardMaterial 
          color="#666" metalness={0.9}
        />
      </mesh>
      {/* Water drops (animated) */}
      <WaterDrip position={[0, 1.1, -0.11]}/>
    </group>
  )
}

function WaterDrip({ position }) {
  const dropRef = useRef()
  const dropY = useRef(0)
  
  useFrame((_, delta) => {
    if (!dropRef.current) return
    dropY.current -= delta * 0.8
    dropRef.current.position.y = position[1] + dropY.current
    if (dropY.current < -0.4) dropY.current = 0
  })
  
  return (
    <mesh ref={dropRef} position={position}>
      <sphereGeometry args={[0.015, 6, 6]}/>
      <meshStandardMaterial
        color="#88aaff"
        transparent opacity={0.7}
      />
    </mesh>
  )
}

// ── SAFETY SHOWER ─────────────────────────────────────
function SafetyShower({ position = [0, 0, 0] }) {
  return (
    <group position={position} rotation={[0, Math.PI/2, 0]}>
      {/* Vertical pipe */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 5, 8]}/>
        <meshStandardMaterial color="#2d5a27" metalness={0.6}/>
      </mesh>
      {/* Horizontal pull arm */}
      <mesh position={[0.3, 4.2, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]}/>
        <meshStandardMaterial color="#2d5a27" metalness={0.6}/>
      </mesh>
      {/* Shower head */}
      <mesh position={[0.6, 4.0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.1, 16]}/>
        <meshStandardMaterial color="#cccccc" metalness={0.8}/>
      </mesh>
      {/* Pull handle ring */}
      <mesh position={[0.6, 3.2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.1, 0.015, 8, 16]}/>
        <meshStandardMaterial color="#ffcc44" metalness={0.7}/>
      </mesh>
      <Html
        position={[0.6, 4.5, 0]}
        center transform occlude
        distanceFactor={6}
      >
        <div style={{
          background:'#2d5a27',
          color:'#fff',
          padding:'2px 8px',
          borderRadius:'4px',
          fontFamily:'Space Mono,monospace',
          fontSize:'9px',
          fontWeight:700,
          whiteSpace:'nowrap',
          border:'1px solid #fff4'
        }}>🚿 SAFETY SHOWER</div>
      </Html>
    </group>
  )
}

// ── FIRE EXTINGUISHER ─────────────────────────────────
function FireExtinguisher({ position = [0, 0, 0] }) {
  return (
    <group position={position} rotation={[0, Math.PI/2, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 12]}/>
        <meshStandardMaterial color="#cc1100" metalness={0.5}/>
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 12]}/>
        <meshStandardMaterial color="#333" metalness={0.8}/>
      </mesh>
      {/* Hose */}
      <mesh position={[0.08, 0.8, 0]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]}/>
        <meshStandardMaterial color="#222"/>
      </mesh>
      <Html
        position={[0, 1.3, 0]}
        center transform occlude
        distanceFactor={5}
      >
        <div style={{
          color:'#ff4444',
          fontFamily:'Space Mono,monospace',
          fontSize:'9px',
          fontWeight:700,
          pointerEvents:'none',
          background:'rgba(0,0,0,0.4)',
          padding:'2px 4px',
          borderRadius:'20px'
        }}>🧯 FIRE EXT.</div>
      </Html>
    </group>
  )
}

// ── STORAGE CABINET ───────────────────────────────────
function StorageCabinet({ position = [0, 0, 0] }) {
  return (
    <group position={position} rotation={[0, -Math.PI/2, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.8, 2.4, 0.6]}/>
        <meshStandardMaterial color="#3a4a3a" roughness={0.8}/>
      </mesh>
      {/* Doors vertical line */}
      <mesh position={[0, 1.2, 0.31]}>
        <boxGeometry args={[0.02, 2.3, 0.01]}/>
        <meshStandardMaterial color="#2a3a2a"/>
      </mesh>
      {/* Handles */}
      <mesh position={[-0.1, 1.2, 0.32]}>
        <boxGeometry args={[0.03, 0.25, 0.03]}/>
        <meshStandardMaterial color="#888" metalness={0.8}/>
      </mesh>
      <mesh position={[0.1, 1.2, 0.32]}>
        <boxGeometry args={[0.03, 0.25, 0.03]}/>
        <meshStandardMaterial color="#888" metalness={0.8}/>
      </mesh>
      <Html
        position={[0, 2.5, 0.32]}
        center transform occlude
        distanceFactor={6}
      >
        <div style={{
          color:'#889988',
          fontFamily:'Space Mono,monospace',
          fontSize:'10px',
          fontWeight:700,
          pointerEvents:'none',
          textTransform:'uppercase'
        }}>Storage 0{Math.floor(Math.random()*9+1)}</div>
      </Html>
    </group>
  )
}

// ── MICROSCOPE ────────────────────────────────────────
function Microscope({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.25, 0.06, 0.2]}/>
        <meshStandardMaterial color="#222" metalness={0.7}/>
      </mesh>
      {/* Arm */}
      <mesh position={[0, 0.3, -0.05]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.06, 0.6, 0.06]}/>
        <meshStandardMaterial color="#333" metalness={0.7}/>
      </mesh>
      {/* Stage */}
      <mesh position={[0, 0.25, 0.04]}>
        <boxGeometry args={[0.2, 0.02, 0.16]}/>
        <meshStandardMaterial color="#444" metalness={0.6}/>
      </mesh>
      {/* Lens body */}
      <mesh position={[0, 0.45, 0.04]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 10]}/>
        <meshStandardMaterial color="#555" metalness={0.8}/>
      </mesh>
      {/* Eyepiece */}
      <mesh position={[0, 0.65, -0.05]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.15, 8]}/>
        <meshStandardMaterial color="#222" metalness={0.6}/>
      </mesh>
    </group>
  )
}

// ── STORAGE SHELVES ───────────────────────────────────
function StorageShelves({ position }) {
  return (
    <group position={position}>
      {[0, 1, 2].map(row => (
        <mesh key={row} position={[0, 0.6 + row*0.9, 0]}>
          <boxGeometry args={[0.05, 0.03, 3]}/>
          <meshStandardMaterial color="#8a8070"/>
        </mesh>
      ))}
      {/* Side supports */}
      {[-1.4, 1.4].map((z, i) => (
        <mesh key={i} position={[0, 1.3, z]}>
          <boxGeometry args={[0.05, 2.6, 0.05]}/>
          <meshStandardMaterial color="#8a8070"/>
        </mesh>
      ))}
    </group>
  )
}

// ── CHEMICAL SHELF ───────────────────────────────────
function ChemicalShelf({ position }) {
  const chemicals = [
    { label:'H₂SO₄', color:'#ff4444', name:'Sulfuric Acid' },
    { label:'KMnO₄', color:'#aa00ff', name:'Potassium Permanganate' },
    { label:'Na₂CO₃',color:'#ffffff', name:'Sodium Carbonate' },
    { label:'HCl',   color:'#ffff44', name:'Hydrochloric Acid' },
    { label:'NaOH',  color:'#4444ff', name:'Sodium Hydroxide' },
    { label:'CuSO₄', color:'#4488ff', name:'Copper Sulphate' },
  ]

  return (
    <group position={position}>
      {/* Shelf board */}
      <mesh>
        <boxGeometry args={[3.5, 0.06, 0.4]}/>
        <meshStandardMaterial color="#2a1a0a" roughness={0.8}/>
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 0.5, -0.18]}>
        <boxGeometry args={[3.5, 1, 0.04]}/>
        <meshStandardMaterial color="#1a1208" roughness={0.9}/>
      </mesh>

      {/* Bottles */}
      {chemicals.map((chem, i) => {
        const x = (i - 2.5) * 0.58
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Bottle body */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.4, 12]}/>
              <meshStandardMaterial
                color={chem.color}
                transparent opacity={0.65}
                metalness={0.1} roughness={0}
              />
            </mesh>
            {/* Bottle neck */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.04, 0.08, 0.12, 12]}/>
              <meshStandardMaterial
                color={chem.color}
                transparent opacity={0.65}
              />
            </mesh>
            {/* Cap */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.06, 12]}/>
              <meshStandardMaterial color="#333" metalness={0.8}/>
            </mesh>
            {/* Label - attached to bottle */}
            <Html
              position={[0, 0.25, 0.12]}
              center transform occlude
              distanceFactor={4}
            >
              <div style={{
                background:'rgba(255,255,255,0.92)',
                border:`1px solid ${chem.color}`,
                borderRadius:'3px',
                padding:'1px 4px',
                color:'#000',
                fontFamily:'Space Mono,monospace',
                fontSize:'9px',
                fontWeight:700,
                whiteSpace:'nowrap',
                pointerEvents:'none'
              }}>
                {chem.label}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

// ── VENTILATION CONTROL ───────────────────────────────
function VentilationControl({ position }) {
  const [on, setOn] = useState(true)
  return (
    <group position={position}>
      {/* Panel box on wall */}
      <mesh>
        <boxGeometry args={[0.8, 0.4, 0.06]}/>
        <meshStandardMaterial color="#1a2a1a" metalness={0.5}/>
      </mesh>
      {/* LED indicator */}
      <mesh position={[-0.25, 0, 0.04]}>
        <sphereGeometry args={[0.04, 8, 8]}/>
        <meshStandardMaterial
          color={on ? '#44ff44' : '#ff4444'}
          emissive={on ? '#44ff44' : '#ff4444'}
          emissiveIntensity={1}
        />
      </mesh>
      <Html
        position={[0, 0, 0.06]}
        center transform occlude
        distanceFactor={4}
      >
        <button
          onClick={() => setOn(!on)}
          style={{
            background:'transparent',
            border:'none',
            color: on ? '#44ff44' : '#ff4444',
            fontFamily:'Space Mono,monospace',
            fontSize:'10px',
            fontWeight:700,
            cursor:'pointer',
            whiteSpace:'nowrap'
          }}
        >
          💨 {on ? 'VENT ON' : 'VENT OFF'}
        </button>
      </Html>
    </group>
  )
}

// ── GRABBABLE PROPS CONTAINER ────────────────────────
function LabProps({ onInspect, onStartExperiment }) {
  return (
    <group>
      {/* ── BENCH 1 (Front Left) - Electrolysis + pH ── */}
      <group position={[-7, 1, 2]}>
        <Beaker id="b1" position={[-1.2, 0, 0]} 
          liquidColor="#4488ff" label="Beaker — Distilled Water"/>
        <Beaker id="b2" position={[-0.6, 0, 0]} 
          liquidColor="#2255aa" label="Beaker — CuSO₄ Solution"/>
        <TestTubeRack id="rack1" position={[0.2, 0, 0]}/>
        <WeighingBalance id="wb1" position={[1.2, 0, 0]}/>
      </group>

      {/* ── BENCH 2 (Front Right) - Titration + Indicators ── */}
      <group position={[7, 1, 2]}>
        <ConicalFlask id="cf1" position={[-1.2, 0, 0]}
          liquidColor="#ff4488" label="Flask — HCl Solution"/>
        <Beaker id="b3" position={[-0.6, 0, 0]}
          liquidColor="#ff8800" label="Beaker — NaOH Solution"/>
        <MeasuringCylinder id="mc1" position={[0.2, 0, 0]}/>
        <Dropper id="dr1" position={[0.8, 0, 0.2]}
          liquidColor="#ff8800"/>
      </group>

      {/* ── BENCH 3 (Back Left) - General Ware ── */}
      <group position={[-7, 1, -6]}>
        <RoundBottomFlask id="rbf1" position={[-1, 0, 0]}
          liquidColor="#ff6600"/>
        <ConicalFlask id="cf2" position={[-0.4, 0, 0]}
          liquidColor="#44aaff" label="Flask — Water"/>
        <TestTube id="tt1" position={[0.2, 0, 0.1]}
          liquidColor="#ff4444" label="Test Tube — Indicator"/>
        <BunsenBurner id="bb1" position={[1, 0, -0.2]} isLit={false}/>
        <TripodStand id="tp1" position={[0.8, 0, 0.2]}/>
      </group>

      {/* ── BENCH 4 (Back Right) - Misc / Secondary ── */}
      <group position={[7, 1, -6]}>
        <TestTube id="tt2" position={[-1, 0, 0]}
          liquidColor="#ffcc44" label="Test Tube — Neutral"/>
        <TestTube id="tt3" position={[-0.7, 0, 0]}
          liquidColor="#44ff88" label="Test Tube — Base"/>
        <Dropper id="dr2" position={[0, 0, 0.1]}
          liquidColor="#aa44ff"/>
        <BunsenBurner id="bb2" position={[1, 0, -0.2]} isLit={true}/>
        <TripodStand id="tp2" position={[1, 0.9, -0.2]}/>
        <Microscope position={[0.2, 0, 0]}/>
      </group>
    </group>
  )
}

// ── WALK CONTROLS (WASD + mouse look) ─────────────────
function WalkControls() {
  const { camera, gl } = useThree()
  const keys = useRef({})
  const isPointerLocked = useRef(false)
  const yaw = useRef(0)
  const pitch = useRef(0)

  useEffect(() => {
    const onCanvasClick = () => {
      gl.domElement.requestPointerLock()
    }
    const onKey = (e, down) => {
      keys.current[e.code] = down
    }
    const onMouseMove = (e) => {
      if (!isPointerLocked.current) return
      yaw.current -= e.movementX * 0.002
      pitch.current -= e.movementY * 0.002
      pitch.current = Math.max(-0.8, Math.min(0.8, pitch.current))
    }
    const onPointerLock = () => {
      isPointerLocked.current = 
        document.pointerLockElement === gl.domElement
    }

    gl.domElement.addEventListener('click', onCanvasClick)
    window.addEventListener('keydown', e => onKey(e, true))
    window.addEventListener('keyup', e => onKey(e, false))
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLock)

    return () => {
      gl.domElement.removeEventListener('click', onCanvasClick)
      window.removeEventListener('keydown', e => onKey(e, true))
      window.removeEventListener('keyup', e => onKey(e, false))
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLock)
    }
  }, [gl])

  useFrame((_, delta) => {
    const speed = 4 * delta
    const k = keys.current

    // Apply rotation
    camera.rotation.order = 'YXZ'
    camera.rotation.y = yaw.current
    camera.rotation.x = pitch.current

    // Movement direction
    const dir = new THREE.Vector3()
    if (k['KeyW'] || k['ArrowUp'])    dir.z -= 1
    if (k['KeyS'] || k['ArrowDown'])  dir.z += 1
    if (k['KeyA'] || k['ArrowLeft'])  dir.x -= 1
    if (k['KeyD'] || k['ArrowRight']) dir.x += 1

    if (dir.length() > 0) {
      dir.normalize()
      dir.applyEuler(new THREE.Euler(0, yaw.current, 0))
      
      const newX = camera.position.x + dir.x * speed
      const newZ = camera.position.z + dir.z * speed

      // Boundary check — stay inside lab
      camera.position.x = Math.max(-9, Math.min(9, newX))
      camera.position.z = Math.max(-7, Math.min(7, newZ))
    }
    camera.position.y = 1.7 // eye height
  })

  return null
}

// ── STUBS FOR REMAINING SUGGESTED COMPONENTS ──────────
export function HotPlate({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.08, 0.4]}/>
        <meshStandardMaterial color="#333" metalness={0.7}/>
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[0.35, 0.01, 0.35]}/>
        <meshStandardMaterial color="#eee" roughness={0.1}/>
      </mesh>
    </group>
  )
}

export function CentrifugeMachine({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.4, 16]}/>
        <meshStandardMaterial color="#aaa" metalness={0.5}/>
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.25, 16, 12, 0, Math.PI*2, 0, Math.PI/2]}/>
        <meshStandardMaterial color="#88aaff" transparent opacity={0.3}/>
      </mesh>
    </group>
  )
}

export function pHMeter({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.15, 0.05, 0.2]}/>
        <meshStandardMaterial color="#333"/>
      </mesh>
      <mesh position={[0, 0.1, -0.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]}/>
        <meshStandardMaterial color="#555"/>
      </mesh>
    </group>
  )
}

export function WasteContainer({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.8, 12]}/>
        <meshStandardMaterial color="#cc4400" roughness={0.8}/>
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 12]}/>
        <meshStandardMaterial color="#333"/>
      </mesh>
    </group>
  )
}

export function GasCylinder({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.8, 12]}/>
        <meshStandardMaterial color="#555" metalness={0.8}/>
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.15, 12, 12, 0, Math.PI*2, 0, Math.PI/2]}/>
        <meshStandardMaterial color="#555" metalness={0.8}/>
      </mesh>
    </group>
  )
}
