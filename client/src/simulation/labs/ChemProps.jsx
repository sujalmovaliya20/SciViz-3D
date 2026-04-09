// Required imports for Three.js React components:
// - Html, Text, etc → from '@react-three/drei'
// - useFrame, useThree → from '@react-three/fiber'
// - useState, useRef, etc → from 'react'
// - THREE → from 'three'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Html,
  Text,
  OrbitControls,
  Float,
  Sparkles,
  Line,
  Sphere,
  Box,
  Cylinder,
  Torus
} from '@react-three/drei'
import * as THREE from 'three'
import LabProp from './LabProp'

// ── BEAKER ────────────────────────────────────────────
export function Beaker({ 
  position, liquidColor='#4488ff', 
  liquidLevel=0.6, label='Beaker', id 
}) {
  return (
    <LabProp id={id} position={position}
      color={liquidColor} shape="beaker" label={label}
      info={`Contains: ${label} solution`}
    >
      {/* Glass body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15,0.13,0.45,16,1,true]}/>
        <meshStandardMaterial
          color="#aaccee" transparent opacity={0.3}
          roughness={0} metalness={0.1} side={2}
        />
      </mesh>
      {/* Bottom */}
      <mesh position={[0,-0.225,0]}>
        <cylinderGeometry args={[0.13,0.13,0.01,16]}/>
        <meshStandardMaterial color="#aaccee" transparent opacity={0.4}/>
      </mesh>
      {/* Liquid */}
      <mesh position={[0,-0.225+liquidLevel*0.45*0.5,0]}>
        <cylinderGeometry args={[0.125,0.122,liquidLevel*0.44,16]}/>
        <meshStandardMaterial
          color={liquidColor} transparent opacity={0.75}
          roughness={0.1}
        />
      </mesh>
      {/* Graduation marks */}
      {[0.25,0.5,0.75].map((h,i) => (
        <mesh key={i} position={[0.145,-0.1+h*0.35,0]}>
          <boxGeometry args={[0.02,0.005,0.005]}/>
          <meshStandardMaterial color="#333"/>
        </mesh>
      ))}
      {/* Spout */}
      <mesh position={[0.14,0.18,0]} rotation={[0,0,-0.3]}>
        <boxGeometry args={[0.04,0.02,0.02]}/>
        <meshStandardMaterial color="#aaccee" transparent opacity={0.4}/>
      </mesh>
    </LabProp>
  )
}

// ── CONICAL FLASK (ERLENMEYER) ────────────────────────
export function ConicalFlask({ 
  position, liquidColor='#44cc88', label='Flask', id 
}) {
  return (
    <LabProp id={id} position={position}
      color={liquidColor} label={label}
    >
      {/* Flask body — cone shape */}
      <mesh castShadow>
        <cylinderGeometry args={[0.16,0.05,0.4,16,1,true]}/>
        <meshStandardMaterial
          color="#aaccee" transparent opacity={0.3}
          side={2} roughness={0}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0,0.26,0]}>
        <cylinderGeometry args={[0.04,0.05,0.15,12,1,true]}/>
        <meshStandardMaterial
          color="#aaccee" transparent opacity={0.3} side={2}
        />
      </mesh>
      {/* Liquid */}
      <mesh position={[0,-0.08,0]}>
        <cylinderGeometry args={[0.14,0.04,0.25,16]}/>
        <meshStandardMaterial
          color={liquidColor} transparent opacity={0.7}
        />
      </mesh>
      {/* Bottom */}
      <mesh position={[0,-0.2,0]}>
        <cylinderGeometry args={[0.16,0.16,0.01,16]}/>
        <meshStandardMaterial color="#aaccee" transparent opacity={0.4}/>
      </mesh>
    </LabProp>
  )
}

// ── TEST TUBE ─────────────────────────────────────────
export function TestTube({ 
  position, liquidColor='#ff4488', label='Test Tube', id 
}) {
  return (
    <LabProp id={id} position={position}
      color={liquidColor} label={label}
    >
      <mesh castShadow rotation={[0.1,0,0]}>
        <cylinderGeometry args={[0.04,0.035,0.35,12,1,true]}/>
        <meshStandardMaterial
          color="#ccddee" transparent opacity={0.35}
          side={2} roughness={0}
        />
      </mesh>
      <mesh position={[0,-0.175,0.006]} rotation={[0.1,0,0]}>
        <sphereGeometry args={[0.035,12,8,0,Math.PI*2,0,Math.PI/2]}/>
        <meshStandardMaterial
          color="#ccddee" transparent opacity={0.35}
        />
      </mesh>
      {/* Liquid */}
      <mesh position={[0,-0.06,0.008]} rotation={[0.1,0,0]}>
        <cylinderGeometry args={[0.033,0.030,0.18,12]}/>
        <meshStandardMaterial
          color={liquidColor} transparent opacity={0.8}
        />
      </mesh>
    </LabProp>
  )
}

// ── TEST TUBE RACK ────────────────────────────────────
export function TestTubeRack({ position, id }) {
  const colors = ['#ff4488','#44ff88','#4488ff','#ffcc44','#ff8844','#aa44ff']
  return (
    <LabProp id={id} position={position}
      color="#886644" label="Test Tube Rack"
    >
      {/* Rack base */}
      <mesh position={[0,-0.05,0]}>
        <boxGeometry args={[0.5,0.04,0.12]}/>
        <meshStandardMaterial color="#886644" roughness={0.6}/>
      </mesh>
      {/* Top rail */}
      <mesh position={[0,0.2,0]}>
        <boxGeometry args={[0.5,0.02,0.04]}/>
        <meshStandardMaterial color="#886644"/>
      </mesh>
      {/* Test tubes in rack */}
      {colors.map((col, i) => (
        <group key={i} position={[-0.2 + i*0.08, 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025,0.022,0.28,10,1,true]}/>
            <meshStandardMaterial
              color="#ccddee" transparent opacity={0.35} side={2}
            />
          </mesh>
          <mesh position={[0,-0.07,0]}>
            <cylinderGeometry args={[0.022,0.019,0.12,10]}/>
            <meshStandardMaterial
              color={col} transparent opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </LabProp>
  )
}

// ── BUNSEN BURNER ─────────────────────────────────────
export function BunsenBurner({ position, id, isLit=false }) {
  return (
    <LabProp id={id} position={position}
      color="#ff6600" label="Bunsen Burner"
      info="Gas burner — use to heat substances"
    >
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08,0.1,0.06,16]}/>
        <meshStandardMaterial color="#333" metalness={0.9}/>
      </mesh>
      {/* Barrel */}
      <mesh position={[0,0.12,0]} castShadow>
        <cylinderGeometry args={[0.025,0.035,0.18,12]}/>
        <meshStandardMaterial color="#444" metalness={0.85}/>
      </mesh>
      {/* Air hole ring */}
      <mesh position={[0,0.05,0]}>
        <torusGeometry args={[0.03,0.008,8,16]}/>
        <meshStandardMaterial color="#555" metalness={0.9}/>
      </mesh>
      {/* Gas pipe */}
      <mesh position={[0.06,0,0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.008,0.008,0.12,8]}/>
        <meshStandardMaterial color="#666" metalness={0.8}/>
      </mesh>
      {/* FLAME when lit */}
      {isLit && (
        <group position={[0, 0.24, 0]}>
          <mesh>
            <coneGeometry args={[0.04, 0.12, 12]}/>
            <meshStandardMaterial
              color="#ff6600" emissive="#ff4400"
              emissiveIntensity={2} transparent opacity={0.85}
            />
          </mesh>
          <mesh position={[0,0.04,0]}>
            <coneGeometry args={[0.025, 0.08, 12]}/>
            <meshStandardMaterial
              color="#ffcc00" emissive="#ffaa00"
              emissiveIntensity={3} transparent opacity={0.7}
            />
          </mesh>
          <pointLight color="#ff6600" intensity={2} distance={1.5}/>
        </group>
      )}
    </LabProp>
  )
}

// ── MEASURING CYLINDER ────────────────────────────────
export function MeasuringCylinder({ position, id }) {
  return (
    <LabProp id={id} position={position}
      color="#4499ff" label="Measuring Cylinder (100ml)"
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.055,0.05,0.5,14,1,true]}/>
        <meshStandardMaterial
          color="#aaddff" transparent opacity={0.3}
          side={2} roughness={0}
        />
      </mesh>
      <mesh position={[0,-0.25,0]}>
        <cylinderGeometry args={[0.055,0.07,0.04,14]}/>
        <meshStandardMaterial color="#aaddff" transparent opacity={0.35}/>
      </mesh>
      {/* Water level */}
      <mesh position={[0,-0.05,0]}>
        <cylinderGeometry args={[0.048,0.048,0.3,14]}/>
        <meshStandardMaterial
          color="#4499ff" transparent opacity={0.65}
        />
      </mesh>
      {/* Graduation lines */}
      {[0,1,2,3,4].map(i => (
        <mesh key={i} position={[0.053,-0.2+i*0.1,0]}>
          <boxGeometry args={[0.015,0.003,0.003]}/>
          <meshStandardMaterial color="#333"/>
        </mesh>
      ))}
    </LabProp>
  )
}

// ── TRIPOD STAND ──────────────────────────────────────
export function TripodStand({ position, id }) {
  return (
    <LabProp id={id} position={position}
      color="#888888" label="Tripod Stand"
    >
      {/* Ring */}
      <mesh position={[0,0.3,0]}>
        <torusGeometry args={[0.1,0.012,8,24]}/>
        <meshStandardMaterial color="#777" metalness={0.8}/>
      </mesh>
      {/* Three legs */}
      {[0,120,240].map((deg,i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <mesh key={i}
            position={[Math.sin(rad)*0.1, 0.1, Math.cos(rad)*0.1]}
            rotation={[Math.cos(rad)*0.5, 0, -Math.sin(rad)*0.5]}
          >
            <cylinderGeometry args={[0.008,0.008,0.4,6]}/>
            <meshStandardMaterial color="#666" metalness={0.85}/>
          </mesh>
        )
      })}
      {/* Wire gauze on ring */}
      <mesh position={[0,0.31,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[0.095,20]}/>
        <meshStandardMaterial
          color="#aaa" metalness={0.6} wireframe={false}
          transparent opacity={0.7}
        />
      </mesh>
    </LabProp>
  )
}

// ── WEIGHING BALANCE ──────────────────────────────────
export function WeighingBalance({ position, id }) {
  return (
    <LabProp id={id} position={position}
      color="#dddddd" label="Electronic Balance"
      info="Measures mass in grams. Place object on pan."
    >
      {/* Base unit */}
      <mesh castShadow>
        <boxGeometry args={[0.35,0.06,0.25]}/>
        <meshStandardMaterial color="#e0e0e0" roughness={0.3}/>
      </mesh>
      {/* Display screen */}
      <mesh position={[0,0.05,0.1]}>
        <boxGeometry args={[0.18,0.04,0.02]}/>
        <meshStandardMaterial color="#003300" roughness={0.1}/>
      </mesh>
      <Html
        position={[0, 0.07, 0.12]}
        center
        transform
        occlude
        distanceFactor={3}
      >
        <div style={{
          color: '#00ff44',
          fontFamily: 'Space Mono, monospace',
          fontSize: '12px',
          fontWeight: 700,
          textShadow: '0 0 5px rgba(0,255,68,0.5)',
          background: 'rgba(0,20,0,0.8)',
          padding: '2px 6px',
          borderRadius: '2px',
          pointerEvents: 'none'
        }}>
          0.00 g
        </div>
      </Html>
      {/* Pan */}
      <mesh position={[0,0.06,0]}>
        <cylinderGeometry args={[0.12,0.12,0.01,20]}/>
        <meshStandardMaterial color="#ccc" metalness={0.7}/>
      </mesh>
      {/* Pan support */}
      <mesh position={[0,0.04,0]}>
        <cylinderGeometry args={[0.015,0.015,0.04,8]}/>
        <meshStandardMaterial color="#aaa" metalness={0.8}/>
      </mesh>
    </LabProp>
  )
}

// ── DROPPER / PIPETTE ─────────────────────────────────
export function Dropper({ position, liquidColor='#ff4466', id }) {
  return (
    <LabProp id={id} position={position}
      color={liquidColor} label="Dropper"
    >
      {/* Rubber bulb */}
      <mesh position={[0,0.15,0]}>
        <sphereGeometry args={[0.04,12,12]}/>
        <meshStandardMaterial color="#cc2200" roughness={0.6}/>
      </mesh>
      {/* Glass tube */}
      <mesh castShadow>
        <cylinderGeometry args={[0.012,0.008,0.28,10,1,true]}/>
        <meshStandardMaterial
          color="#cceeee" transparent opacity={0.5}
          side={2} roughness={0}
        />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0,-0.4,0]}>
        <cylinderGeometry args={[0.007,0.005,0.15,8]}/>
        <meshStandardMaterial
          color={liquidColor} transparent opacity={0.8}
        />
      </mesh>
    </LabProp>
  )
}

// ── ROUND BOTTOM FLASK ────────────────────────────────
export function RoundBottomFlask({ 
  position, liquidColor='#ff8800', id 
}) {
  return (
    <LabProp id={id} position={position}
      color={liquidColor} label="Round Bottom Flask"
    >
      {/* Sphere body */}
      <mesh castShadow>
        <sphereGeometry args={[0.14,20,20]}/>
        <meshStandardMaterial
          color="#aaccee" transparent opacity={0.28}
          side={2} roughness={0}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0,0.18,0]}>
        <cylinderGeometry args={[0.035,0.055,0.2,12,1,true]}/>
        <meshStandardMaterial
          color="#aaccee" transparent opacity={0.28}
          side={2} roughness={0}
        />
      </mesh>
      {/* Liquid */}
      <mesh position={[0,-0.04,0]}>
        <sphereGeometry args={[0.11,16,16,0,Math.PI*2,Math.PI/3,Math.PI/2]}/>
        <meshStandardMaterial
          color={liquidColor} transparent opacity={0.7}
        />
      </mesh>
    </LabProp>
  )
}
