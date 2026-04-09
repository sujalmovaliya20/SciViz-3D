import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function ConcaveMirror({ currentStep = 0, isPlaying = false, resetKey }) {
  
  const stepConfigs = [
    {
      objectPos: -20,
      label: "Object at ∞",
      imagePos: -3,
      imageLabel: "Image at F (real, inverted, point)",
      imageScale: 0.1,
      rayColor: "#ffcc00",
      description: "Parallel rays converge at focal point F"
    },
    {
      objectPos: -8,
      label: "Object beyond C",
      imagePos: -4.5,
      imageLabel: "Image between F & C (real, inverted, diminished)",
      imageScale: 0.6,
      rayColor: "#ff6b35",
      description: "Real, inverted, diminished image"
    },
    {
      objectPos: -6,
      label: "Object at C",
      imagePos: -6,
      imageLabel: "Image at C (real, inverted, same size)",
      imageScale: 1.0,
      rayColor: "#ff4d6d",
      description: "Real, inverted, same size image at C"
    },
    {
      objectPos: -3.01,
      label: "Object at F",
      imagePos: -50,
      imageLabel: "Image at ∞ (no image formed)",
      imageScale: 0.01,
      rayColor: "#a855f7",
      description: "Reflected rays are parallel — image at infinity"
    },
    {
      objectPos: -1.5,
      label: "Object between P and F",
      imagePos: 8,
      imageLabel: "Virtual, erect, magnified image (behind mirror)",
      imageScale: 1.8,
      rayColor: "#22c55e",
      description: "Virtual, erect, magnified — acts as magnifying glass"
    }
  ]

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)]
  
  return (
    <>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#00e5ff" />
      
      <gridHelper args={[40, 40, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
      
      <Line 
        points={[[-12, 0, 0], [8, 0, 0]]} 
        color="#334455" 
        lineWidth={1} 
        dashed 
      />
      
      <ConcaveMirrorMesh />
      
      <FocalMarker position={[-3, 0, 0]} label="F" color="#00e5ff" />
      <FocalMarker position={[-6, 0, 0]} label="C" color="#ff4d6d" />
      <FocalMarker position={[0, 0, 0]} label="P" color="#ffffff" />
      
      <AnimatedArrow 
        positionX={config.objectPos}
        height={1.5}
        color="#ffffff"
        label={config.label}
      />
      
      <AnimatedArrow
        positionX={config.imagePos}
        height={1.5 * config.imageScale}
        color={config.imageScale > 1 ? "#22c55e" : "#ff4d6d"}
        label={config.imageLabel}
        opacity={config.imageScale > 0.05 ? 0.7 : 0}
        inverted={config.imagePos < 0}
      />
      
      <RayDiagram 
        objectPos={config.objectPos}
        imagePos={config.imagePos}
        rayColor={config.rayColor}
        isPlaying={isPlaying}
      />
      
      <Html position={[0, 3, 0]} center>
        <div style={{
          background: 'rgba(6,8,15,0.9)',
          border: '1px solid #1e2a3a',
          borderRadius: '8px',
          padding: '10px 16px',
          color: '#e0eaff',
          fontFamily: 'Space Mono, monospace',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }}>
          <div style={{ color: config.rayColor, fontWeight: 700, marginBottom: '4px' }}>
            {config.label}
          </div>
          <div style={{ color: '#4a5a7a' }}>{config.description}</div>
        </div>
      </Html>
    </>
  )
}

function ConcaveMirrorMesh() {
  return (
    <mesh position={[0.5, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
      <sphereGeometry args={[6, 32, 32, 0, 0.45]} />
      <meshStandardMaterial color="#8b949e" metalness={1} roughness={0.1} side={THREE.DoubleSide} />
    </mesh>
  )
}

function FocalMarker({ position, label, color }) {
  return (
    <Sphere args={[0.08]} position={position}>
      <meshStandardMaterial color={color} />
      <Html position={[0,-0.4,0]} center>
         <div style={{ color, fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold' }}>{label}</div>
      </Html>
    </Sphere>
  )
}

function AnimatedArrow({ positionX, height, color, label, opacity = 1, inverted = false }) {
  const { x, h } = useSpring({ 
    x: positionX,
    h: inverted ? -height : height,
    config: { tension: 120, friction: 20 }
  })
  
  return (
    <animated.group position-x={x}>
      {/* Arrow shaft */}
      <animated.mesh position-y={h.to(val => val/2)}>
        <animated.cylinderGeometry args={[0.04, 0.04, h.to(Math.abs), 8]} />
        <meshStandardMaterial color={color} opacity={opacity} transparent />
      </animated.mesh>
      {/* Arrowhead */}
      <animated.mesh position-y={h.to(val => val > 0 ? val + 0.2 : val - 0.2)} rotation-z={inverted ? Math.PI : 0}>
        <coneGeometry args={[0.12, 0.3, 8]} />
        <meshStandardMaterial color={color} opacity={opacity} transparent />
      </animated.mesh>
      {/* Label */}
      <animated.group position-y={h.to(val => val > 0 ? val + 0.6 : val - 0.6)} position-x={0.3}>
        <Html center>
          <div style={{ 
            color, fontSize: '11px', 
            fontFamily: 'Space Mono, monospace',
            whiteSpace: 'nowrap',
            textShadow: '0 0 8px rgba(0,0,0,0.8)',
            opacity: opacity
          }}>
            {label}
          </div>
        </Html>
      </animated.group>
    </animated.group>
  )
}

function RayDiagram({ objectPos, imagePos, rayColor, isPlaying }) {
  const progress = useRef(0)
  const [p, setP] = useState(1)
  
  useFrame((_, delta) => {
    if (isPlaying && progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 0.5)
      setP(progress.current)
    } else if (!isPlaying) {
      progress.current = 0
      setP(0)
    }
  })
  
  const { objX, imgX } = useSpring({ 
    objX: objectPos,
    imgX: imagePos,
    config: { tension: 120, friction: 20 }
  });

  const objH = 1.5
  const mirrorX = 0
  const cX = -6
  
  return (
    <group>
      {/* Ray 1: parallel → through F */}
      <animated.line>
        <animated.bufferGeometry>
          <animated.bufferAttribute
            attach="attributes-position"
            array={useSpring({
              from: { pos: [objectPos, objH, 0, mirrorX, objH, 0, imagePos > 0 ? 5 : imagePos, imagePos > 0 ? -objH*0.5 : 0, 0] },
              to: { pos: [objectPos, objH, 0, mirrorX, objH, 0, imagePos > 0 ? 5 : imagePos, imagePos > 0 ? -objH*0.5 : 0, 0] }
            }).pos}
            itemSize={3}
            count={3}
          />
        </animated.bufferGeometry>
        <lineBasicMaterial color={rayColor} opacity={p} transparent linewidth={2} />
      </animated.line>
      {/* Ray 2: through C → back through C */}
      <animated.line>
        <animated.bufferGeometry>
          <animated.bufferAttribute
            attach="attributes-position"
            array={useSpring({
              from: { pos: [objectPos, objH, 0, cX, 0, 0, imagePos > 0 ? 5 : imagePos, imagePos > 0 ? -objH*0.5 : 0, 0] },
              to: { pos: [objectPos, objH, 0, cX, 0, 0, imagePos > 0 ? 5 : imagePos, imagePos > 0 ? -objH*0.5 : 0, 0] }
            }).pos}
            itemSize={3}
            count={3}
          />
        </animated.bufferGeometry>
        <lineBasicMaterial color={rayColor} opacity={p * 0.8} transparent linewidth={2} />
      </animated.line>
    </group>
  )
}
