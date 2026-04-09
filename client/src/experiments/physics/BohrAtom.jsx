import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Html, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function BohrAtom({ currentStep = 0, isPlaying = false }) {
  const electronRef = useRef();

  const stepConfigs = [
    { n: 1, label: "Ground State (n=1)", desc: "Electron rests in the lowest stable energy level. E = -13.6 eV." },
    { n: 2, label: "Excitation (n=2)", desc: "Photon absorbed! Electron gains energy to jump to n=2." },
    { n: 3, label: "Higher Energy (n=3)", desc: "Atom in highly excited state (n=3). E = -1.51 eV." },
    { n: 2, label: "Emission (n=3 → 2)", desc: "Electron drops back, emitting a red photon (Balmer series)." },
    { n: 2, showSpectrum: true, label: "Hydrogen Spectrum", desc: "Discrete energy leaps emit specific light frequencies." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { radius, energy } = useSpring({
    radius: config.n * 1.5,
    energy: -13.6 / (config.n * config.n),
    config: { tension: 80, friction: 12 }
  });

  const [t, setT] = useState(0);

  useFrame((state, delta) => {
    if (isPlaying) {
      // Speed inversely proportional to orbit size (Kepler's third analog)
      const currentR = radius.get();
      const speed = 4 / Math.sqrt(currentR); 
      setT(prev => prev + delta * speed);
      
      if (electronRef.current) {
        electronRef.current.position.set(
          Math.cos(t) * currentR,
          0,
          Math.sin(t) * currentR
        );
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 0, 0]} intensity={4} color="#ff4d6d" distance={10} />
      
      {/* Nucleus */}
      <Float speed={5} rotationIntensity={2}>
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={0.5} />
        </Sphere>
        <Html position={[0, 0.8, 0]} center>
          <div style={{ color: '#ff4d6d', fontSize: '12px', fontWeight: 'bold' }}>+e</div>
        </Html>
      </Float>

      {/* Orbits */}
      {[1, 2, 3, 4].map((i) => (
        <Torus key={i} args={[i * 1.5, 0.015, 16, 64]} rotation={[Math.PI/2, 0, 0]}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={i === config.n ? 0.6 : 0.15} />
          {i === config.n && (
            <Html position={[i * 1.5, 0, 0]}>
              <div className="mono" style={{ color: '#00e5ff', textShadow: '0 0 4px #000' }}>n={i}</div>
            </Html>
          )}
        </Torus>
      ))}

      {/* Electron */}
      <group ref={electronRef}>
        <Sphere args={[0.18, 16, 16]}>
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
        </Sphere>
        <Html position={[0, -0.4, 0]} center>
          <div style={{ color: '#00e5ff', fontSize: '10px' }}>&minus;e</div>
        </Html>
      </group>

      {/* Photon Emission / Absorption visuals */}
      {currentStep === 1 && <PhotonIncoming isPlaying={isPlaying} />}
      {currentStep === 3 && <PhotonOutgoing isPlaying={isPlaying} />}

      {/* Spectrum Overlay */}
      {config.showSpectrum && (
        <Html position={[5, 0, 0]} center>
          <div style={{
            background: 'rgba(6,8,15,0.9)', border: '1px solid #1e2a3a', borderRadius: '8px',
            padding: '12px', width: '200px', display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '10px', color: '#8899bb', letterSpacing: '1px' }}>EMISSION SPECTRUM</div>
            <div style={{ height: '40px', background: '#000', position: 'relative', borderRadius: '4px', border: '1px solid #334' }}>
              {/* Balmer alpha line (n=3 to 2) red */}
              <div style={{ position: 'absolute', left: '80%', top: 0, bottom: 0, width: '2px', background: '#ff0000', boxShadow: '0 0 8px #ff0000' }} />
              {/* Balmer beta (n=4 to 2) blue-green */}
              <div style={{ position: 'absolute', left: '40%', top: 0, bottom: 0, width: '2px', background: '#00ffff', boxShadow: '0 0 8px #00ffff' }} />
              {/* Balmer gamma (n=5 to 2) blue */}
              <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '2px', background: '#4169e1', boxShadow: '0 0 8px #4169e1' }} />
              {/* Balmer delta (n=6 to 2) violet */}
              <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, width: '2px', background: '#8a2be2', boxShadow: '0 0 8px #8a2be2' }} />
            </div>
          </div>
        </Html>
      )}

      {/* Energy Level Display */}
      <Html position={[0, -4.5, 0]} center>
        <div className="glass mono" style={{ padding: '0.8rem', fontSize: '14px', border: '1px solid #00e5ff', color: '#00e5ff' }}>
          <animated.div>
            {energy.to(e => `Energy: ${e.toFixed(2)} eV`)}
          </animated.div>
        </div>
      </Html>

      {/* UI Overlay */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          background: 'rgba(6,8,15,0.9)', border: '1px solid #1e2a3a', borderRadius: '8px',
          padding: '10px 16px', color: '#e0eaff', fontFamily: 'Space Mono, monospace',
          fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'center'
        }}>
          <div style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '4px' }}>
            {config.label}
          </div>
          <div style={{ color: '#4a5a7a' }}>{config.description}</div>
        </div>
      </Html>

      <gridHelper args={[40, 40, 0x1e2a3a, 0x111820]} position={[0, -6, 0]} />
    </group>
  );
}

function PhotonIncoming({ isPlaying }) {
  const lineRef = useRef();
  const [t, setT] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) {
      setT(prev => (prev + delta * 3) % Math.PI);
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for(let i=0; i<20; i++) {
       const x = 5 - (i/20)*5; // coming from right to center
       const y = Math.sin(x * 10 - t * 10) * 0.2;
       pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [t]);

  return (
    <Line points={points} color="#ffff00" lineWidth={3} transparent opacity={0.6} />
  )
}

function PhotonOutgoing({ isPlaying }) {
  const lineRef = useRef();
  const [t, setT] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) {
      setT(prev => (prev + delta * 3) % Math.PI);
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for(let i=0; i<20; i++) {
       const x = 2 + (i/20)*5; // going from origin to right
       const y = Math.sin(x * 10 - t * 10) * 0.2;
       pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [t]);

  return (
    <Line points={points} color="#ff0000" lineWidth={3} transparent opacity={0.6} />
  )
}
