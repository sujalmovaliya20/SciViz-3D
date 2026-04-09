import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class HelixCurve extends THREE.Curve {
  constructor(offset = 0) {
    super();
    this.offset = offset;
  }
  getPoint(t) {
    const height = 12; // -6 to 6
    const y = t * height - 6;
    const turns = 3;
    const angle = t * Math.PI * 2 * turns + this.offset;
    const radius = 1.5;
    return new THREE.Vector3(Math.cos(angle)*radius, y, Math.sin(angle)*radius);
  }
}

export default function DNAHelix({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { unwindRatio: 0, zoomZ: 10, focusY: 0, label: "Double Helix", desc: "DNA naturally coils into a right-handed double helix structure." },
    { unwindRatio: 0, zoomZ: 4, focusY: 0, label: "A-T Base Pair", desc: "Adenine (Yellow) always pairs with Thymine (Orange) via 2 Hydrogen Bonds." },
    { unwindRatio: 0, zoomZ: 4, focusY: 1.2, label: "G-C Base Pair", desc: "Guanine (Green) always pairs with Cytosine (Blue) via 3 Hydrogen Bonds." },
    { unwindRatio: 1, zoomZ: 12, focusY: 0, label: "Unwound DNA", desc: "When unwound, we see two antiparallel backbones (5'→3' and 3'→5')." },
    { unwindRatio: 1, zoomZ: 12, focusY: 0, label: "DNA Dimensions", desc: "DNA is approximately 2.0 nm wide, with 3.4 nm per full helical turn." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { unwind, camZ, camY } = useSpring({
    unwind: config.unwindRatio,
    camZ: config.zoomZ,
    camY: config.focusY,
    config: { tension: 60, friction: 15 }
  });

  const pathA = useMemo(() => new HelixCurve(0), []);
  const pathB = useMemo(() => new HelixCurve(Math.PI), []);
  
  const numBPs = 36;
  
  // Base pair generation
  const bps = useMemo(() => {
    const pairs = [];
    for(let i=0; i<numBPs; i++) {
        const t = i / (numBPs - 1);
        const ptA = pathA.getPoint(t);
        const ptB = pathB.getPoint(t);
        // Randomly assign AT or GC
        const type = Math.random() > 0.5 ? 'AT' : 'GC';
        // Randomly flip order
        const flip = Math.random() > 0.5;
        pairs.push({ t, ptA, ptB, type, flip });
    }
    return pairs;
  }, [pathA, pathB]);

  const groupRef = useRef();

  useFrame((state, delta) => {
     if (groupRef.current) {
         // Auto-spin unless unwound
         groupRef.current.rotation.y += delta * 0.2 * (1 - config.unwindRatio);
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -10, -5]} intensity={0.5} color="#ffffff" />

      {/* Camera target proxy: we'll animate the main group opposite to camera moves */}
      <animated.group position-z={camZ.to(z => 10 - z)} position-y={camY.to(y => -y)}>
        <group ref={groupRef}>
          
          {/* Backbones */}
          {bps.map((_, i) => {
             if (i === bps.length - 1) return null;
             const p1A = bps[i].ptA;
             const p2A = bps[i+1].ptA;
             const p1B = bps[i].ptB;
             const p2B = bps[i+1].ptB;

             return (
               <group key={`bone-${i}`}>
                 {/* Backbone A (Animated interpolation between helical and straight) */}
                 <animated.mesh position={unwind.to(u => {
                    const h1 = p1A.clone().lerp(p2A, 0.5);
                    const flatX = -1.5;
                    const flatY = THREE.MathUtils.lerp(p1A.y, p2A.y, 0.5);
                    const flat = new THREE.Vector3(flatX, flatY, 0);
                    return h1.lerp(flat, u);
                 })}>
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.5} />
                 </animated.mesh>
                 
                 {/* Backbone B */}
                 <animated.mesh position={unwind.to(u => {
                    const h1 = p1B.clone().lerp(p2B, 0.5);
                    const flatX = 1.5;
                    const flatY = THREE.MathUtils.lerp(p1B.y, p2B.y, 0.5);
                    const flat = new THREE.Vector3(flatX, flatY, 0);
                    return h1.lerp(flat, u);
                 })}>
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshStandardMaterial color="#f43f5e" roughness={0.2} metalness={0.5} />
                 </animated.mesh>
               </group>
             )
          })}

          {/* Base Pairs */}
          {bps.map((bp, i) => {
              
              // Colors
              let c1, c2;
              if (bp.type === 'AT') {
                  c1 = bp.flip ? '#facc15' : '#fb923c'; // A: yellow, T: orange
                  c2 = bp.flip ? '#fb923c' : '#facc15';
              } else {
                  c1 = bp.flip ? '#22c55e' : '#60a5fa'; // G: green, C: blue
                  c2 = bp.flip ? '#60a5fa' : '#22c55e';
              }

              return (
                 <animated.group key={`rung-${i}`} position={unwind.to(u => {
                     const hCenter = bp.ptA.clone().lerp(bp.ptB, 0.5);
                     const flatCenter = new THREE.Vector3(0, bp.ptA.y, 0);
                     return hCenter.lerp(flatCenter, u);
                 })}
                 rotation={unwind.to(u => {
                     // Helical angle
                     const angle = Math.atan2(bp.ptB.z - bp.ptA.z, bp.ptB.x - bp.ptA.x);
                     // Flat angle = 0
                     return [0, THREE.MathUtils.lerp(angle, 0, u), 0];
                 })}>
                     {/* Left Base */}
                     <mesh position={[-0.75, 0, 0]} rotation={[0,0,Math.PI/2]}>
                         <cylinderGeometry args={[0.12, 0.12, 1.4]} />
                         <meshStandardMaterial color={c1} roughness={0.4} />
                     </mesh>
                     {/* Right Base */}
                     <mesh position={[0.75, 0, 0]} rotation={[0,0,Math.PI/2]}>
                         <cylinderGeometry args={[0.12, 0.12, 1.4]} />
                         <meshStandardMaterial color={c2} roughness={0.4} />
                     </mesh>

                     {/* H-Bonds (Animated dashed lines, we just use tiny spheres here for simplicity) */}
                     <group>
                        {(bp.type === 'AT' ? [-0.2, 0.2] : [-0.3, 0, 0.3]).map((zOff, j) => (
                           <mesh key={`hbond-${j}`} position={[0, zOff, 0]}>
                              <sphereGeometry args={[0.04, 8, 8]} />
                              <meshBasicMaterial color="#ffffff" />
                           </mesh>
                        ))}
                     </group>

                     {/* Highlight specific pairs in step 1/2 */}
                     {Math.abs(bp.ptA.y - config.focusY) < 0.5 && config.zoomZ === 4 && (
                        (config.currentStep === 1 && bp.type === 'AT') || 
                        (config.currentStep === 2 && bp.type === 'GC')
                     ) && (
                        <Html position={[0, 0, 0]} center>
                           <div style={{ padding:'2px 6px', background:'rgba(0,0,0,0.8)', border:`1px solid ${c1}`, borderRadius:'4px', color:'#fff', fontSize:'10px', whiteSpace:'nowrap' }}>
                              {bp.type === 'AT' ? (bp.flip ? 'T - A (2 bonds)' : 'A - T (2 bonds)') : (bp.flip ? 'C - G (3 bonds)' : 'G - C (3 bonds)')}
                           </div>
                        </Html>
                     )}
                 </animated.group>
              );
          })}

          {/* Labels for Step 3 & 4 */}
          {config.unwindRatio === 1 && (
             <Html position={[0, 0, 0]} center>
                <div style={{ position:'relative' }}>
                  {config.currentStep === 3 && (
                    <>
                      <div style={{ position:'absolute', top:'-180px', left:'-80px', color:'#38bdf8', fontSize:'12px', fontWeight:'bold' }}>5' End</div>
                      <div style={{ position:'absolute', bottom:'-180px', left:'-80px', color:'#38bdf8', fontSize:'12px', fontWeight:'bold' }}>3' End</div>
                      <div style={{ position:'absolute', top:'-180px', right:'-80px', color:'#f43f5e', fontSize:'12px', fontWeight:'bold' }}>3' End</div>
                      <div style={{ position:'absolute', bottom:'-180px', right:'-80px', color:'#f43f5e', fontSize:'12px', fontWeight:'bold' }}>5' End</div>
                    </>
                  )}
                  {config.currentStep === 4 && (
                    <>
                      <div style={{ position:'absolute', top:'0px', left:'-120px', borderTop:'1px solid #fff', borderBottom:'1px solid #fff', height:'3.4em', padding:'0 8px', color:'#00e5ff', fontSize:'12px', display:'flex', alignItems:'center' }}>
                         3.4 nm (1 turn)
                      </div>
                      <div style={{ position:'absolute', top:'60px', left:'-50px', borderLeft:'1px solid #fff', borderRight:'1px solid #fff', width:'100px', textAlign:'center', color:'#ff4d6d', fontSize:'12px' }}>
                         2.0 nm width
                      </div>
                    </>
                  )}
                </div>
             </Html>
          )}

        </group>
      </animated.group>

      {/* UI Overlay */}
      <Html position={[0, -4.5, 0]} center>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -6, 0]} />
    </group>
  );
}
