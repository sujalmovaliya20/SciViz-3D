import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function MolecularOrbital({ currentStep = 0 }) {
  const stepConfigs = [
    { dist: 4, sigma: 0, anti: 0, label: "Isolated Atoms", desc: "Two separated Hydrogen atoms with 1s atomic orbitals." },
    { dist: 2, sigma: 0, anti: 0, label: "Approach", desc: "Orbitals begin to overlap as atoms come closer." },
    { dist: 1.5, sigma: 1, anti: 0, label: "Bonding MO (σ1s)", desc: "Constructive interference! Electron density concentrates between nuclei. Lower energy." },
    { dist: 1.5, sigma: 0, anti: 1, label: "Antibonding MO (σ*1s)", desc: "Destructive interference! A nodal plane forms between nuclei where electron density is zero. Higher energy." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { atomDist, sigmaVol, antiVol } = useSpring({
    atomDist: config.dist,
    sigmaVol: config.sigma,
    antiVol: config.anti,
    config: { tension: 60, friction: 15 }
  });

  const grpRef = useRef();
  useFrame((state, delta) => {
    if (grpRef.current) {
      grpRef.current.rotation.y += delta * 0.2;
      grpRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      <group ref={grpRef}>
        {/* Nuclei */}
        <animated.group position-x={atomDist.to(d => -d/2)}>
          <Sphere args={[0.2, 16, 16]}>
             <meshStandardMaterial color="#ff4d4d" />
          </Sphere>
          {/* 1s AO */}
          <animated.mesh scale={sigmaVol.to(s => 1-s).to(x => Math.max(0, x))}>
             <sphereGeometry args={[1.2, 32, 32]} />
             <animated.meshPhysicalMaterial color="#00e5ff" transparent opacity={antiVol.to(a => Math.max(0.1, 0.4 - a*0.4))} transmission={0.9} />
          </animated.mesh>
        </animated.group>

        <animated.group position-x={atomDist.to(d => d/2)}>
          <Sphere args={[0.2, 16, 16]}>
             <meshStandardMaterial color="#ff4d4d" />
          </Sphere>
          {/* 1s AO */}
          <animated.mesh scale={sigmaVol.to(s => 1-s).to(x => Math.max(0, x))}>
             <sphereGeometry args={[1.2, 32, 32]} />
             <animated.meshPhysicalMaterial color="#00e5ff" transparent opacity={antiVol.to(a => Math.max(0.1, 0.4 - a*0.4))} transmission={0.9} />
          </animated.mesh>
        </animated.group>

        {/* Sigma Bonding MO */}
        <animated.mesh scale={sigmaVol} visible={sigmaVol.to(s => s > 0)}>
          <capsuleGeometry args={[1.4, Math.max(0.1, config.dist-0.5), 32, 32]} />
          <meshPhysicalMaterial color="#22c55e" transparent opacity={0.6} transmission={0.9} />
        </animated.mesh>

        {/* Sigma* Antibonding MO */}
        <animated.group scale={antiVol} visible={antiVol.to(a => a > 0)}>
           {/* Left Lobe */}
           <mesh position={[-1.2, 0, 0]} rotation={[0,0,Math.PI/2]}>
              <capsuleGeometry args={[1.2, 1, 32, 32]} />
              <meshPhysicalMaterial color="#00e5ff" transparent opacity={0.6} transmission={0.9} />
           </mesh>
           {/* Right Lobe */}
           <mesh position={[1.2, 0, 0]} rotation={[0,0,Math.PI/2]}>
              <capsuleGeometry args={[1.2, 1, 32, 32]} />
              <meshPhysicalMaterial color="#ff4d6d" transparent opacity={0.6} transmission={0.9} />
           </mesh>
           {/* Nodal Plane Indicator */}
           <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[5, 5]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.2} />
           </mesh>
           <Html position={[0, 3, 0]} center><div style={{ color: '#fff', fontSize:'10px' }}>Nodal Plane (Zero Electron Density)</div></Html>
        </animated.group>
      </group>

      {/* Energy Level Diagram Overlay */}
      <Html position={[5, 0, 0]} center>
         <div style={{ background: '#0d1117', border: '1px solid #1e2a3a', padding: '16px', borderRadius: '8px', color: '#fff', width: '200px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>MO Energy Diagram</div>
            <div style={{ position: 'relative', height: '150px' }}>
               {/* H 1s Left */}
               <div style={{ position: 'absolute', top: '50%', left: '10%', width: '30%', height: '2px', background: '#00e5ff' }}>
                  <div style={{ position:'absolute', top:'-16px', left:'0', fontSize:'10px' }}>H 1s</div>
               </div>
               {/* H 1s Right */}
               <div style={{ position: 'absolute', top: '50%', right: '10%', width: '30%', height: '2px', background: '#00e5ff' }}>
                  <div style={{ position:'absolute', top:'-16px', right:'0', fontSize:'10px' }}>H 1s</div>
               </div>
               {/* Sigma Binding */}
               <div style={{ position: 'absolute', top: '80%', left: '35%', width: '30%', height: '4px', background: config.sigma ? '#22c55e' : '#334', transition: 'all 0.5s' }}>
                  <div style={{ position:'absolute', top:'10px', left:'20%', fontSize:'10px', color: '#22c55e' }}>σ₁s</div>
               </div>
               {/* Sigma Anti */}
               <div style={{ position: 'absolute', top: '20%', left: '35%', width: '30%', height: '4px', background: config.anti ? '#ff4d6d' : '#334', transition: 'all 0.5s' }}>
                  <div style={{ position:'absolute', top:'-16px', left:'15%', fontSize:'10px', color: '#ff4d6d' }}>σ*₁s</div>
               </div>
            </div>
         </div>
      </Html>

      {/* UI Overlay */}
      <Html position={[0, -4, 0]} center>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
    </group>
  );
}
