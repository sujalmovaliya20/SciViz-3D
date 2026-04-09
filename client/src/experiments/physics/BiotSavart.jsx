import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Html, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function BiotSavart({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { numLoops: 1, iActive: 0, showField: 0, highlightCenter: 0, label: "Circular Current Loop", desc: "A single copper wire loop. No current flowing." },
    { numLoops: 1, iActive: 1, showField: 0, highlightCenter: 0, label: "Current Flows", desc: "Electrons flow in a circle. Current generates a magnetic field." },
    { numLoops: 1, iActive: 1, showField: 1, highlightCenter: 0, label: "Biot-Savart Field", desc: "Magnetic field vectors distributed across the space around loop." },
    { numLoops: 1, iActive: 1, showField: 1, highlightCenter: 1, label: "Center Field Maximum", desc: "B = (μ₀ * I) / (2 * R). Field is strongest precisely at the center axis." },
    { numLoops: 5, iActive: 1, showField: 1, highlightCenter: 1, label: "Multiple Loops Overlay", desc: "Stacking loops multiplies the field → Principles of a Solenoid." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { iFlow, fieldBlend, centerBlend, loopsScale } = useSpring({
    iFlow: config.iActive,
    fieldBlend: config.showField,
    centerBlend: config.highlightCenter,
    loopsScale: config.numLoops === 5 ? 1 : 0, // blends additional loops opacity
    config: { tension: 60, friction: 15 }
  });

  const R = 3; // Loop radius

  // Create a 5x5 grid of Vector indicators (x, z plane across y=0)
  // Wait, loop is in XY plane (if torus is default)? 
  // Let's explicitly put the loop in the XZ plane (horizontal). 
  // Then vectors point roughly up/down along Y axis.
  const gridPoints = useMemo(() => {
    const pts = [];
    for(let x = -6; x <= 6; x+=3) {
      for(let z = -6; z <= 6; z+=3) {
         // calculate approx Biot-savart field contribution direction for visual arrows
         // field along axis (z=0, x=0, y=y) is strictly Y direction.
         // outside the loop, field curves back down.
         const d = Math.sqrt(x*x + z*z);
         let size = 1 / (1 + (d - R)*(d - R) * 0.2); // generic falloff model localized around loop rim
         let dirY = d < R ? 1 : -0.5; // Up inside, Down outside
         let cx = x * 0.2; // slight curve out
         let cz = z * 0.2;

         if (x===0 && z===0) {
           size = 2.0; 
           dirY = 1.0;
           cx = 0; cz = 0;
         }

         const dir = new THREE.Vector3(cx, dirY, cz).normalize();
         
         pts.push({ x, y: 0, z, dir, size, isCenter: (x===0 && z===0) });
      }
    }
    return pts;
  }, []);

  const electronsRef = useRef([]);

  useFrame((state, delta) => {
    if (isPlaying && config.iActive) {
      const eGroup = electronsRef.current;
      eGroup.forEach((eGrp) => {
        if(eGrp) {
           // Rotate around Y axis
           eGrp.rotation.y -= delta * 2;
        }
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1} color="#ffffff" />

      {/* The Central Primary Loop */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[R, 0.08, 16, 64]} />
         <meshStandardMaterial color="#b87333" metalness={0.8} />
      </mesh>

      {/* Additional loops for Step 4 Preview */}
      <animated.group opacity={loopsScale} transparent>
         {[0.5, 1.0, -0.5, -1.0].map((yOffset, idx) => (
            <mesh key={`lp-${idx}`} position={[0, yOffset, 0]} rotation={[Math.PI/2, 0, 0]}>
               <torusGeometry args={[R, 0.08, 16, 64]} />
               <animated.meshStandardMaterial color="#b87333" metalness={0.8} transparent opacity={loopsScale} />
            </mesh>
         ))}
      </animated.group>

      {/* Electrons */}
      <group ref={el => electronsRef.current[0] = el}>
         {[...Array(10)].map((_, i) => (
           <mesh key={`el-${i}`} position={[Math.cos((i/10)*Math.PI*2)*R, 0, Math.sin((i/10)*Math.PI*2)*R]}>
             <sphereGeometry args={[0.15, 8, 8]} />
             <animated.meshBasicMaterial color="#ffff00" transparent opacity={iFlow} />
           </mesh>
         ))}
      </group>

      {/* Magnetic Field Vector Grid */}
      <group position={[0, 1, 0]}>
        {gridPoints.map((pt, i) => {
           // To orient arrows correctly
           const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), pt.dir);
           const euler = new THREE.Euler().setFromQuaternion(quaternion);

           return (
             <animated.group 
               key={`arr-${i}`} 
               position={[pt.x, pt.y, pt.z]} 
               rotation={euler}
               scale={fieldBlend.to(f => 
                  pt.isCenter ? 
                    f * pt.size * (1 + centerBlend.get()*0.5) // center gets bigger
                    : 
                    f * pt.size * (1 - centerBlend.get()*0.8) // others vanish or shrink
               )}
             >
                {/* Arrow Shaft line */}
                <Cylinder args={[0.04, 0.04, 1.0]} position={[0, 0.5, 0]}>
                   <animated.meshBasicMaterial 
                      color={pt.isCenter ? centerBlend.to(c => c > 0.5 ? '#ffff00' : '#00e5ff') : '#00e5ff'} 
                      transparent opacity={0.6} 
                   />
                </Cylinder>
                <Cone args={[0.15, 0.4]} position={[0, 1.0, 0]}>
                   <animated.meshBasicMaterial 
                      color={pt.isCenter ? centerBlend.to(c => c > 0.5 ? '#ffff00' : '#00e5ff') : '#00e5ff'} 
                      transparent opacity={0.8} 
                   />
                </Cone>
                
                {pt.isCenter && config.highlightCenter === 1 && (
                  <Html position={[0, 1.5, 0]} center>
                    <div style={{ color: '#ffff00', fontSize: '14px', background: '#000', padding: '2px 4px', borderRadius: '4px' }}>B_max</div>
                  </Html>
                )}
             </animated.group>
           )
        })}
      </group>

      {/* Equation Overlay */}
      {config.showField === 1 && (
        <Html position={[5, 4, 0]} center>
          <div style={{
            background: 'rgba(6,8,15,0.9)', border: '1px solid #ff4d6d', borderRadius: '8px',
            padding: '12px', color: '#ff4d6d', fontFamily: 'Space Mono, monospace', fontSize: '14px'
          }}>
            <div style={{ color: '#fff' }}>Biot-Savart Law</div>
            <div>dB = (μ₀ I dl × r) / (4π r³)</div>
            <hr style={{ borderColor: '#ff4d6d', margin: '4px 0' }} />
            <div style={{ fontSize: '12px', color: '#00e5ff' }}>Center of Loop:</div>
            <div style={{ fontSize: '12px', color: '#00e5ff' }}>B = (μ₀ I) / (2 R)</div>
          </div>
        </Html>
      )}

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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2, 0]} />
    </group>
  );
}
