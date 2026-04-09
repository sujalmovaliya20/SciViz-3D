import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Html, Tube, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class SaltBridgeCurve extends THREE.Curve {
  getPoint(t) {
    const x = (t - 0.5) * 6; // from -3 to 3
    // Arch shape using parabola: y = -a*x^2 + k
    const y = -0.5 * (x * x) + 3;
    return new THREE.Vector3(x, y, 0);
  }
}

export default function DanielCell({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { showWire: 0, showBridge: 0, iFlow: 0, volt: 0, cuScale: 1, znScale: 1, label: "Two Half Cells", desc: "Zinc in ZnSO₄ (left, colorless). Copper in CuSO₄ (right, blue)." },
    { showWire: 0, showBridge: 0, iFlow: 0, volt: 0, cuScale: 1, znScale: 1, label: "Electrodes Added", desc: "Metal electrodes dipped into their respective solutions." },
    { showWire: 1, showBridge: 0, iFlow: 1, volt: 0, cuScale: 1, znScale: 1, label: "External Circuit connected", desc: "Electrons flow Zn → Cu. Reaction stops quickly without Salt Bridge." },
    { showWire: 1, showBridge: 1, iFlow: 1, volt: 1.1, cuScale: 1, znScale: 1, label: "Salt Bridge Inserted", desc: "Circuit completes! Ions flow. Continuous 1.10V produced." },
    { showWire: 1, showBridge: 1, iFlow: 1, volt: 1.1, cuScale: 1.2, znScale: 0.8, label: "Reaction Over Time", desc: "Zn electrode dissolves (oxidizes). Cu electrode grows (reduces)." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { wireOp, bridgeOp, voltVal, cuSize, znSize } = useSpring({
    wireOp: config.showWire,
    bridgeOp: config.showBridge,
    voltVal: config.volt,
    cuSize: config.cuScale,
    znSize: config.znScale,
    config: { tension: 60, friction: 15 }
  });

  const bridgePath = new SaltBridgeCurve();
  const elRefs = useRef([]);
  const bridgeIonsRef = useRef([]);

  useFrame((state, delta) => {
    if (isPlaying && config.iFlow) {
      // Electron flow left to right (-3 to 3) at y=4
      elRefs.current.forEach((el, index) => {
         if (!el) return;
         let x = el.position.x + delta * 3 * (config.showBridge ? 1 : 0.2); // Slows if no bridge
         if (x > 3) x = -3;
         el.position.x = x;
      });

      // Salt bridge internal flow
      if (config.showBridge) {
        bridgeIonsRef.current.forEach((el, index) => {
           if (!el) return;
           let t = (el.userData.t || (index/10)) + delta * 0.1;
           if (t > 1) t -= 1;
           el.userData.t = t;
           // One type flows left, one flows right
           const actualT = el.userData.dir === 'left' ? 1 - t : t;
           const pos = bridgePath.getPoint(actualT);
           el.position.copy(pos);
        });
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* LEFT HALF CELL (Zinc) */}
      <group position={[-3, 0, 0]}>
         {/* Beaker Glass */}
         <Box args={[3.2, 4.2, 3.2]}>
            <meshPhysicalMaterial transmission={0.9} roughness={0.1} color="#e0eaff" transparent opacity={0.3} />
         </Box>
         {/* ZnSO4 Solution */}
         <Box args={[3, 3, 3]} position={[0, -0.5, 0]}>
            <meshPhysicalMaterial transmission={0.9} color="#ffffff" transparent opacity={0.2} />
         </Box>
         <Html position={[-0.5, -0.5, 1.5]} center><div style={{ color: '#fff', fontSize:'12px' }}>Zn²⁺ + SO₄²⁻</div></Html>
         
         {/* Zinc Electrode (Anode - ) */}
         {config.currentStep >= 1 && (
           <animated.group scale-x={znSize} scale-z={znSize}>
             <Cylinder args={[0.5, 0.5, 5]} position={[0, 1, 0]}>
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
             </Cylinder>
             <Html position={[-1, 3, 0]} center><div style={{ color: '#94a3b8', fontWeight:'bold' }}>Zn Anode (-)</div></Html>
           </animated.group>
         )}
      </group>

      {/* RIGHT HALF CELL (Copper) */}
      <group position={[3, 0, 0]}>
         {/* Beaker Glass */}
         <Box args={[3.2, 4.2, 3.2]}>
            <meshPhysicalMaterial transmission={0.9} roughness={0.1} color="#e0eaff" transparent opacity={0.3} />
         </Box>
         {/* CuSO4 Solution */}
         <Box args={[3, 3, 3]} position={[0, -0.5, 0]}>
            <meshPhysicalMaterial transmission={0.9} color="#0055ff" transparent opacity={0.6} />
         </Box>
         <Html position={[0.5, -0.5, 1.5]} center><div style={{ color: '#fff', fontSize:'12px' }}>Cu²⁺ + SO₄²⁻</div></Html>

         {/* Copper Electrode (Cathode + ) */}
         {config.currentStep >= 1 && (
           <animated.group scale-x={cuSize} scale-z={cuSize}>
             <Cylinder args={[0.5, 0.5, 5]} position={[0, 1, 0]}>
               <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.3} />
             </Cylinder>
             <Html position={[1, 3, 0]} center><div style={{ color: '#b87333', fontWeight:'bold' }}>Cu Cathode (+)</div></Html>
           </animated.group>
         )}
      </group>

      {/* External Wire & Voltmeter */}
      <animated.group opacity={wireOp} transparent>
         <Line points={[[-3, 3.5, 0], [-3, 5, 0], [3, 5, 0], [3, 3.5, 0]]} color="#333" lineWidth={3} />
         
         {/* Voltmeter Box */}
         <Box args={[1.5, 1, 0.5]} position={[0, 5, 0]}>
            <meshStandardMaterial color="#1e293b" />
            <Html position={[0, 0, 0.3]} center>
               <div style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', color: config.volt > 0 ? '#22c55e' : '#ff4d6d', fontWeight: 'bold' }}>
                  <animated.span>{voltVal.to(v => v.toFixed(2))}</animated.span> V
               </div>
            </Html>
         </Box>

         {/* Electrons flowing on wire */}
         <group>
           {[...Array(6)].map((_, i) => (
             <mesh key={`el-${i}`} ref={el => elRefs.current[i] = el} position={[-3 + i*(6/5), 5, 0]}>
               <sphereGeometry args={[0.1, 8, 8]} />
               <meshBasicMaterial color="#ffff00" />
               {(i===3) && <Html position={[0,0.3,0]} center><div style={{ color:'#ffff00', fontSize:'10px'}}>e⁻ flow</div></Html>}
             </mesh>
           ))}
         </group>
      </animated.group>

      {/* Salt Bridge */}
      <animated.group opacity={bridgeOp} transparent>
         <Tube args={[bridgePath, 32, 0.4, 8, false]}>
            <meshPhysicalMaterial transmission={0.9} color="#e2e8f0" transparent opacity={0.5} roughness={0.1} />
         </Tube>
         <Html position={[0, 3.5, 0]} center>
            <div style={{ color: '#00e5ff', fontWeight: 'bold', background: '#000', padding: '2px 6px', borderRadius: '4px' }}>Salt Bridge (KCl)</div>
         </Html>

         {/* Ions inside bridge */}
         <group>
           {[...Array(10)].map((_, i) => (
             <mesh key={`ion-${i}`} ref={el => {
                bridgeIonsRef.current[i] = el;
                if(el && !el.userData.dir) el.userData.dir = i % 2 === 0 ? 'left' : 'right';
             }}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color={i % 2 === 0 ? '#ff4d6d' : '#00e5ff'} />
             </mesh>
           ))}
         </group>
      </animated.group>

      {/* Equations Overlay */}
      {config.currentStep >= 4 && (
        <Html position={[0, -3.5, 0]} center>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #1e2a3a', borderRadius: '4px', textAlign: 'center' }}>
               <div style={{ color: '#4a5a7a', fontSize: '10px' }}>OXIDATION (Anode)</div>
               <div style={{ color: '#ff4d6d', fontFamily: 'monospace' }}>Zn(s) → Zn²⁺(aq) + 2e⁻</div>
            </div>
            <div style={{ background: '#0d1117', padding: '8px', border: '1px solid #1e2a3a', borderRadius: '4px', textAlign: 'center' }}>
               <div style={{ color: '#4a5a7a', fontSize: '10px' }}>REDUCTION (Cathode)</div>
               <div style={{ color: '#00e5ff', fontFamily: 'monospace' }}>Cu²⁺(aq) + 2e⁻ → Cu(s)</div>
            </div>
          </div>
        </Html>
      )}

      {/* UI Overlay */}
      <Html position={[0, 6.5, 0]} center>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.1, 0]} />
    </group>
  );
}
