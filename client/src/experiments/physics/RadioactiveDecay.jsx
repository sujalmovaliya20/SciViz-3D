import React, { useState, useMemo, useEffect } from 'react';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function RadioactiveDecay({ currentStep, controlValues, isPlaying }) {
  const halfLife = controlValues.halfLife || 5; // seconds
  const [nuclei, setNuclei] = useState([]);

  useEffect(() => {
    const list = [];
    for (let x = -3; x <= 3; x++) {
      for (let y = -3; y <= 3; y++) {
        list.push({ id: `${x}-${y}`, pos: [x, y, 0], stable: false });
      }
    }
    setNuclei(list);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setNuclei(prev => prev.map(n => {
        if (!n.stable && Math.random() < (0.693 / (halfLife * 10))) {
          return { ...n, stable: true };
        }
        return n;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, halfLife]);

  const activeCount = nuclei.filter(n => !n.stable).length;

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {nuclei.map((n, i) => (
        <Sphere key={i} args={[0.3, 16, 16]} position={n.pos}>
          <meshStandardMaterial 
            color={n.stable ? '#757575' : '#ff4d6d'} 
            emissive={n.stable ? '#000' : '#ff4d6d'} 
            emissiveIntensity={n.stable ? 0 : 0.5} 
          />
        </Sphere>
      ))}

      <Html position={[0, 5, 0]} center>
         <div className="label glass syne-bold">RADIOACTIVE DECAY: N = N₀·e^(-λt)</div>
      </Html>

      <Html position={[5, 0, 0]}>
        <div className="glass mono" style={{ padding: '1rem' }}>
          Remaining: {activeCount} / {nuclei.length}
          <div style={{ marginTop: '0.5rem', color: '#ff4d6d' }}>
            N/N₀: {(activeCount / nuclei.length * 100).toFixed(1)}%
          </div>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -5, -1]} />
    </group>
  );
};
