import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';

const VseprTheory = ({ currentStep = 0 }) => {
  const molecules = [
    {
      id: "H2O", name: "Water (H₂O)", shape: "Bent", angle: "104.5°", lps: 2, centerColor: "#ff4d6d", sideColor: "#ffffff",
      atoms: [
        { r: 2, theta: Math.PI/2 + 0.91, phi: 0 },
        { r: 2, theta: Math.PI/2 - 0.91, phi: 0 }
      ],
      lonePairs: [
        { r: 1.5, theta: Math.PI, phi: Math.PI/2 },
        { r: 1.5, theta: Math.PI, phi: -Math.PI/2 }
      ],
      desc: "2 bond pairs + 2 lone pairs force a Bent angular geometry."
    },
    {
      id: "NH3", name: "Ammonia (NH₃)", shape: "Trigonal Pyramidal", angle: "107°", lps: 1, centerColor: "#0055ff", sideColor: "#ffffff",
      atoms: [
        { r: 2, theta: 2.0, phi: 0 },
        { r: 2, theta: 2.0, phi: (2*Math.PI)/3 },
        { r: 2, theta: 2.0, phi: (4*Math.PI)/3 }
      ],
      lonePairs: [
        { r: 1.5, theta: 0, phi: 0 }
      ],
      desc: "3 bond pairs + 1 lone pair acting compressively on the top."
    },
    {
      id: "CH4", name: "Methane (CH₄)", shape: "Tetrahedral", angle: "109.5°", lps: 0, centerColor: "#475569", sideColor: "#ffffff",
      atoms: [
        { r: 2, theta: 0, phi: 0 },
        { r: 2, theta: 1.91, phi: 0 },
        { r: 2, theta: 1.91, phi: (2*Math.PI)/3 },
        { r: 2, theta: 1.91, phi: (4*Math.PI)/3 }
      ],
      lonePairs: [],
      desc: "4 equivalent bond pairs spaced evenly in 3D geometry."
    },
    {
      id: "CO2", name: "Carbon Dioxide (CO₂)", shape: "Linear", angle: "180°", lps: 0, centerColor: "#475569", sideColor: "#ff4d6d",
      atoms: [
        { r: 2, theta: 0, phi: 0 },
        { r: 2, theta: Math.PI, phi: 0 }
      ],
      lonePairs: [],
      desc: "2 regions of electron density (double bonds) oppose each other."
    },
    {
      id: "BF3", name: "Boron Trifluoride (BF₃)", shape: "Trigonal Planar", angle: "120°", lps: 0, centerColor: "#facc15", sideColor: "#22c55e",
      atoms: [
        { r: 2, theta: Math.PI/2, phi: 0 },
        { r: 2, theta: Math.PI/2, phi: (2*Math.PI)/3 },
        { r: 2, theta: Math.PI/2, phi: (4*Math.PI)/3 }
      ],
      lonePairs: [],
      desc: "3 bond pairs arranged flat in a plane to maximize distance."
    },
    {
      id: "PCl5", name: "Phosphorus Pentachloride (PCl₅)", shape: "Trigonal Bipyramidal", angle: "90° & 120°", lps: 0, centerColor: "#fb923c", sideColor: "#22c55e",
      atoms: [
        { r: 2, theta: 0, phi: 0 },          // Axial up
        { r: 2, theta: Math.PI, phi: 0 },     // Axial down
        { r: 2, theta: Math.PI/2, phi: 0 },   // Equatorial 1
        { r: 2, theta: Math.PI/2, phi: (2*Math.PI)/3 }, // Eq 2
        { r: 2, theta: Math.PI/2, phi: (4*Math.PI)/3 }  // Eq 3
      ],
      lonePairs: [],
      desc: "5 bond pairs. Axial positions at 90°, Equatorial at 120°."
    },
    {
      id: "SF6", name: "Sulfur Hexafluoride (SF₆)", shape: "Octahedral", angle: "90°", lps: 0, centerColor: "#facc15", sideColor: "#22c55e",
      atoms: [
        { r: 2, theta: 0, phi: 0 },          // Up
        { r: 2, theta: Math.PI, phi: 0 },     // Down
        { r: 2, theta: Math.PI/2, phi: 0 },   // Right
        { r: 2, theta: Math.PI/2, phi: Math.PI },   // Left
        { r: 2, theta: Math.PI/2, phi: Math.PI/2 }, // Front
        { r: 2, theta: Math.PI/2, phi: -Math.PI/2 } // Back
      ],
      lonePairs: [],
      desc: "6 equivalent bond pairs surrounding the central atom."
    }
  ];

  const molecule = molecules[Math.min(currentStep, molecules.length - 1)];

  const molRef = useRef();
  
  useFrame((state, delta) => {
     if(molRef.current) {
        molRef.current.rotation.y += delta * 0.2;
        molRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      
      <group position={[0, 0, 0]} ref={molRef}>
        
        {/* Central Atom */}
        <Sphere args={[0.8, 32, 32]}>
           <meshStandardMaterial color={molecule.centerColor} metalness={0.2} roughness={0.3} />
        </Sphere>

        {/* Bonded Atoms & Sticks */}
        {molecule.atoms.map((pos, i) => {
            const x = pos.r * Math.sin(pos.theta) * Math.cos(pos.phi);
            const z = pos.r * Math.sin(pos.theta) * Math.sin(pos.phi);
            const y = pos.r * Math.cos(pos.theta);
            
            const atomVec = new THREE.Vector3(x, y, z);
            const up = new THREE.Vector3(0, 1, 0);
            
            // Quaternion to rotate cylinder (stick) to point from center to atomVec
            const quaternion = new THREE.Quaternion().setFromUnitVectors(up, atomVec.clone().normalize());
            
            return (
              <group key={`atom-${i}`}>
                 {/* Stick */}
                 <mesh position={[x/2, y/2, z/2]} quaternion={quaternion}>
                    <cylinderGeometry args={[0.1, 0.1, pos.r]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
                 </mesh>
                 {/* Atom */}
                 <Sphere args={[0.5, 32, 32]} position={[x, y, z]}>
                    <meshStandardMaterial color={molecule.sideColor} metalness={0.1} roughness={0.4} />
                 </Sphere>
              </group>
            )
        })}

        {/* Lone Pairs */}
        {molecule.lonePairs.map((pos, i) => {
            const x = pos.r * Math.sin(pos.theta) * Math.cos(pos.phi);
            const z = pos.r * Math.sin(pos.theta) * Math.sin(pos.phi);
            const y = pos.r * Math.cos(pos.theta);
            
            const lpVec = new THREE.Vector3(x, y, z);
            const up = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(up, lpVec.clone().normalize());

            return (
              <group key={`lp-${i}`}>
                 <mesh position={[x/1.5, y/1.5, z/1.5]} quaternion={quaternion}>
                    <capsuleGeometry args={[0.4, 0.8, 16, 16]} />
                    <meshPhysicalMaterial 
                       color="#c084fc" 
                       transmission={0.8} 
                       transparent opacity={0.6}
                       roughness={0} 
                    />
                 </mesh>
                 <Html position={[x*1.2, y*1.2, z*1.2]} center>
                    <div style={{ color: '#c084fc', fontSize: '10px', background: '#000', padding: '2px 4px', borderRadius: '4px' }}>Lone Pair</div>
                 </Html>
              </group>
            )
        })}
      </group>

      {/* Target UI Overlay */}
      <Html position={[0, -4, 0]} center>
         <div style={{
           background: 'rgba(6,8,15,0.9)', border: '1px solid #1e2a3a', borderRadius: '8px',
           padding: '16px 24px', color: '#e0eaff', fontFamily: 'Space Mono, monospace',
           textAlign: 'center', width: '300px'
         }}>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
               {molecule.name}
            </div>
            <div style={{ color: '#00e5ff', fontSize: '14px', marginBottom: '4px' }}>
               Shape: {molecule.shape}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px' }}>
               <div style={{ color: '#ff4d6d' }}>Angle: {molecule.angle}</div>
               <div style={{ color: '#c084fc' }}>LPs: {molecule.lps}</div>
            </div>
            <div style={{ color: '#4a5a7a', fontSize: '12px', lineHeight: 1.5 }}>
               {molecule.desc}
            </div>
         </div>
      </Html>
    </group>
  );
}

export default VseprTheory;
