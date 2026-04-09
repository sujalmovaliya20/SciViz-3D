import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Line, Html, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function MagneticFieldBar({ controlValues, currentStep = 0, isPlaying = false }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (isPlaying && meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const stepConfigs = [
    {
      label: "Bar Magnet",
      description: "A permanent magnet with North and South poles.",
      showLines: false,
      lineProgress: 0,
      showFilings: false,
      showCompass: false
    },
    {
      label: "Field Lines Emerging",
      description: "Lines emerge from the North pole.",
      showLines: true,
      lineProgress: 0.3,
      showFilings: false,
      showCompass: false
    },
    {
      label: "Complete Field",
      description: "Lines form closed loops, entering the South pole.",
      showLines: true,
      lineProgress: 1.0,
      showFilings: false,
      showCompass: false
    },
    {
      label: "Iron Filings",
      description: "Filings align along the invisible magnetic field lines.",
      showLines: true,
      lineProgress: 1.0,
      showFilings: true,
      showCompass: false
    },
    {
      label: "Compass Alignment",
      description: "A compass needle aligns tangent to the field lines.",
      showLines: true,
      lineProgress: 1.0,
      showFilings: true,
      showCompass: true
    }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { lineProgress, filingsOpacity, compassScale } = useSpring({
    lineProgress: config.lineProgress,
    filingsOpacity: config.showFilings ? 0.8 : 0,
    compassScale: config.showCompass ? 1 : 0,
    config: { tension: 80, friction: 20 }
  });

  return (
    <group>
      <ambientLight intensity={1.0} color="#1a2a4a" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group ref={meshRef}>
          {/* North Pole */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial color="#ff4d6d" roughness={0.3} metalness={0.5} />
            <Text position={[0, 0, 0.26]} fontSize={0.2} color="white" font="/fonts/Inter-Bold.woff">N</Text>
          </mesh>
          
          {/* South Pole */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial color="#00e5ff" roughness={0.3} metalness={0.5} />
            <Text position={[0, 0, 0.26]} fontSize={0.2} color="white" font="/fonts/Inter-Bold.woff">S</Text>
          </mesh>

          <FieldLines progress={lineProgress} visible={config.showLines} />
          
          <IronFilings opacity={filingsOpacity} />
          
          <animated.group scale={compassScale} position={[1.5, 0.5, 0]} rotation={[0, 0, -Math.PI/6]}>
            <Compass />
          </animated.group>
          <animated.group scale={compassScale} position={[-1.5, -0.5, 0]} rotation={[0, 0, Math.PI - Math.PI/6]}>
            <Compass />
          </animated.group>
          <animated.group scale={compassScale} position={[0, 2.0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <Compass />
          </animated.group>
        </group>
      </Float>

      <Html position={[0, 3.5, 0]} center>
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
          <div style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '4px' }}>
            {config.label}
          </div>
          <div style={{ color: '#4a5a7a' }}>{config.description}</div>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x161b22, 0x161b22]} position={[0, -2, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#06080f" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function FieldLines({ progress, visible }) {
  const lines = useMemo(() => {
    const l = [];
    const count = 24;
    const radius = 2.5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const points = [];
      const curveCount = 40;
      for (let j = 0; j <= curveCount; j++) {
        const t = j / curveCount;
        const x = Math.cos(angle) * Math.sin(t * Math.PI) * radius;
        const y = Math.cos(t * Math.PI) * 1.5;
        const z = Math.sin(angle) * Math.sin(t * Math.PI) * radius;
        points.push(new THREE.Vector3(x, y, z));
      }
      l.push(points);
    }
    return l;
  }, []);

  if (!visible) return null;

  return (
    <group>
      {lines.map((pts, i) => (
        <AnimatedLine key={i} points={pts} progress={progress} />
      ))}
    </group>
  );
}

function AnimatedLine({ points, progress }) {
  const lineRef = useRef();
  const maxPts = points.length;
  
  useFrame(() => {
    if (lineRef.current) {
      const drawCount = Math.max(2, Math.floor(progress.get() * maxPts));
      lineRef.current.geometry.setDrawRange(0, drawCount);
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={points.length} 
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))} 
          itemSize={3} 
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.4} linewidth={1} />
    </line>
  );
}

function IronFilings({ opacity }) {
  const filings = useMemo(() => {
    const arr = [];
    for(let i=0; i<300; i++) {
      const r = 1 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const x = Math.sin(phi) * Math.cos(theta) * r;
      const y = Math.cos(phi) * r * 0.8;
      const z = Math.sin(phi) * Math.sin(theta) * r;
      
      const pos = new THREE.Vector3(x, y, z);
      const align = new THREE.Vector3().copy(pos).normalize();
      
      arr.push({ pos, align });
    }
    return arr;
  }, []);

  return (
    <animated.group opacity={opacity} transparent>
      <animated.mesh>
        <instancedMesh args={[null, null, filings.length]}>
          <cylinderGeometry args={[0.01, 0.01, 0.1, 4]} />
          <animated.meshStandardMaterial color="#8b949e" transparent opacity={opacity} />
          {filings.map((f, i) => {
            const dummy = new THREE.Object3D();
            dummy.position.copy(f.pos);
            dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), f.align);
            dummy.updateMatrix();
            return <primitive key={i} object={dummy} attachArray="matrix" />;
          })}
        </instancedMesh>
      </animated.mesh>
      {/* Fallback for instancedMesh opacity animation issue in some versions */}
      {filings.map((f, i) => {
        const rot = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), f.align);
        const euler = new THREE.Euler().setFromQuaternion(rot);
        return (
          <mesh key={i} position={f.pos} rotation={euler}>
            <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
            <animated.meshStandardMaterial color="#6b7280" transparent opacity={opacity} />
          </mesh>
        );
      })}
    </animated.group>
  );
}

function Compass() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
        <meshStandardMaterial color="#1e2a3a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.01, 16]} />
        <meshStandardMaterial color="#06080f" />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI/2]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshStandardMaterial color="#ff4d6d" />
      </mesh>
      <mesh position={[0, -0.07, 0]} rotation={[0, 0, -Math.PI/2]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshStandardMaterial color="#00e5ff" />
      </mesh>
    </group>
  )
}
