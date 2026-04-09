import { 
  useState, 
  useRef, 
  useEffect,
  useCallback,
  Suspense,
  lazy
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, Environment, Sky, Grid,
  Text, Html, RoundedBox, Sphere, Cylinder,
  Float, MeshDistortMaterial, Sparkles,
  ContactShadows, PerspectiveCamera
} from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { useNavigate, useLocation } from 'react-router-dom'
import * as THREE from 'three'
import useGestureDetection from '../hooks/useGestureDetection'
import useAppStore from '../store/useAppStore'
import useGestureStore from '../store/useGestureStore'
import GrabbableObject from '../simulation/GrabbableObject'
import GestureCursor3D from '../simulation/GestureCursor3D'
import InspectObject from '../simulation/InspectObject'
import ErrorBoundary from '../components/ErrorBoundary'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

const PhysicsLabInterior = lazy(() => import('../simulation/PhysicsLabInterior'))
import ChemistryLab from '../simulation/labs/ChemistryLab'
const BiologyLabInterior = lazy(() => import('../simulation/BiologyLabInterior'))

const getInterior = (id) => {
  switch(id) {
    case 'chemistry': return ChemistryLab
    case 'physics': return PhysicsLabInterior
    case 'biology': return BiologyLabInterior
    default: return null
  }
}

// ── ZONE DEFINITIONS ──
const ZONES = [
  {
    id: 'physics',
    name: 'Physics Lab',
    color: '#00e5ff',
    position: [-20, 0, 0],
    icon: '⚡',
    description: 'Explore electromagnetic fields, optics, and circuits',
    experiments: ['Magnetic Field', 'Electric Circuit', 'Prism Light']
  },
  {
    id: 'chemistry',
    name: 'Chemistry Lab',
    color: '#a855f7',
    position: [0, 0, 0],
    icon: '⚗️',
    description: 'Work with molecules, crystals, and electrochemical cells',
    experiments: ['NaCl Crystal', 'Daniel Cell', 'Benzene Ring']
  },
  {
    id: 'biology',
    name: 'Biology Lab',
    color: '#22c55e',
    position: [20, 0, 0],
    icon: '🌿',
    description: 'Study DNA, cell division, and neural signals',
    experiments: ['DNA Helix', 'Mitosis', 'Neuron Impulse']
  }
]

// ── CAMERA RIG ──
function CameraRig({ activeInterior }) {
  const { camera } = useThree()
  const vec = new THREE.Vector3()

  useFrame(() => {
    if (activeInterior) {
      // Zoom into lab interior
      if (activeInterior === 'chemistry') {
        vec.set(0, 1.7, 5) // Inside lab position
      } else if (activeInterior === 'physics') {
        vec.set(0, 1.7, 12) // Physics lab is larger, entrance at front
      } else {
        vec.set(0, 2, 8) // Standard zoom
      }
      camera.position.lerp(vec, 0.05)
      if (camera.fov > 60) camera.fov -= 0.5
    } else {
      // Return to world view
      camera.position.lerp(vec.set(0, 2, 15), 0.05)
      if (camera.fov < 75) camera.fov += 0.5
    }
    camera.updateProjectionMatrix()
  })
  return null
}

function GestureHUD({ status, videoRef, canvasRef }) {
  const rightGesture = useGestureStore(s => s.rightGesture||'none')
  const leftGesture = useGestureStore(s => s.leftGesture||'none')
  const isGrabbing = useGestureStore(s => s.isGrabbing)
  const grabbedObjectId = useGestureStore(s => s.grabbedObjectId)
  const handDistance = useGestureStore(s => s.handDistance)

  const getColor = (g) => {
    switch(g) {
      case 'pinch':  return '#ffcc44'
      case 'grab':   return '#ff4d6d'
      case 'point':  return '#00e5ff'
      case 'peace':  return '#22c55e'
      case 'open':   return '#a855f7'
      default:       return '#4a5a7a'
    }
  }

  return (
    <div style={{
      position:'fixed', bottom:'68px', right:'16px',
      zIndex:150, display:'flex',
      flexDirection:'column', gap:'8px',
      alignItems:'flex-end', pointerEvents:'none'
    }}>
      {/* Combined gesture status */}
      <div style={{
        background:'rgba(6,8,15,0.95)',
        border:'1px solid #1e2a3a',
        borderRadius:'10px',
        padding:'10px 14px',
        width:'220px',
        boxSizing:'border-box',
        pointerEvents:'auto'
      }}>
        <div style={{
          display:'flex', gap:'0',
          marginBottom:'8px'
        }}>
          {/* Right */}
          <div style={{
            flex:1, textAlign:'center',
            borderRight:'1px solid #1e2a3a',
            paddingRight:'8px'
          }}>
            <div style={{
              fontSize:'9px', color:'#00e5ff',
              fontFamily:'Space Mono,monospace',
              marginBottom:'3px', fontWeight:700
            }}>RIGHT → MOVE</div>
            <div style={{fontSize:'22px'}}>
              {rightGesture==='pinch'?'👌':
               rightGesture==='grab'?'✊':
               rightGesture==='point'?'👆':
               rightGesture==='open'?'🤚':
               rightGesture==='peace'?'✌️':'🤲'}
            </div>
            <div style={{
              fontSize:'9px',
              color: rightGesture==='none' ? '#334455' : '#00e5ff',
              fontFamily:'Space Mono,monospace',
              marginTop:'2px', fontWeight:700
            }}>
              {rightGesture === 'none' ? '–' :
               rightGesture.toUpperCase()}
            </div>
          </div>

          {/* Left */}
          <div style={{
            flex:1, textAlign:'center',
            paddingLeft:'8px'
          }}>
            <div style={{
              fontSize:'9px', color:'#a855f7',
              fontFamily:'Space Mono,monospace',
              marginBottom:'3px', fontWeight:700
            }}>LEFT → ACTION</div>
            <div style={{fontSize:'22px'}}>
              {leftGesture==='pinch'?'👌':
               leftGesture==='grab'?'✊':
               leftGesture==='point'?'👆':
               leftGesture==='open'?'🤚':
               leftGesture==='peace'?'✌️':'🤲'}
            </div>
            <div style={{
              fontSize:'9px',
              color: leftGesture==='none' ? '#334455' : '#a855f7',
              fontFamily:'Space Mono,monospace',
              marginTop:'2px', fontWeight:700
            }}>
              {leftGesture === 'none' ? '–' :
               leftGesture.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Current action status */}
        <div style={{
          padding:'5px 8px',
          background:'rgba(0,0,0,0.4)',
          borderRadius:'6px',
          fontFamily:'Space Mono,monospace',
          fontSize:'10px',
          textAlign:'center',
          color: isGrabbing ? '#ffcc44' :
                 leftGesture==='grab' ? '#ff4d6d' :
                 leftGesture==='pinch' ? '#a855f7' : '#334455'
        }}>
          {isGrabbing && grabbedObjectId 
            ? `✊ Holding: ${grabbedObjectId}` :
           isGrabbing 
            ? '👌 Grabbing...' :
           leftGesture === 'grab' 
            ? '🔄 Rotating' :
           leftGesture === 'pinch' 
            ? '🔍 Inspecting' :
            '● Ready'}
        </div>
      </div>

      {/* Camera feed */}
      <div style={{
        position:'relative', width:'220px', height:'165px',
        borderRadius:'12px', overflow:'hidden',
        border:`2px solid ${getColor(rightGesture)}`,
        background:'#06080f',
        transition:'border-color 0.2s',
        pointerEvents:'auto'
      }}>
        <video ref={videoRef} autoPlay playsInline muted
          style={{
            position:'absolute', inset:0,
            width:'100%', height:'100%',
            objectFit:'cover',
            transform:'scaleX(-1)',
            opacity:0.01
          }}
        />
        <canvas ref={canvasRef} width={220} height={165}
          style={{
            position:'absolute', inset:0,
            width:'100%', height:'100%'
          }}
        />
        <div style={{
          position:'absolute', top:'6px', left:'6px',
          padding:'2px 7px',
          background: status==='active'
            ? 'rgba(34,197,94,0.9)'
            : 'rgba(255,204,68,0.9)',
          borderRadius:'4px', fontSize:'9px',
          fontFamily:'Space Mono,monospace',
          color:'#000', fontWeight:700
        }}>
          {status==='active' ? '● LIVE' : '⏳ LOADING'}
        </div>
      </div>

    </div>
  )
}


// ── ZONE PORTAL ──
function ZonePortal({ zone, onEnter, isHidden }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime + zone.position[0]) * 0.2
    }
  })

  if (isHidden) return null

  return (
    <group position={zone.position}>
      {/* Portal ring */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onEnter(zone)}
      >
        <torusGeometry args={[3, 0.15, 16, 64]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.color}
          emissiveIntensity={hovered ? 1 : 0.4}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Portal fill */}
      <mesh onClick={() => onEnter(zone)}>
        <circleGeometry args={[2.8, 64]} />
        <meshStandardMaterial
          color={zone.color}
          transparent
          opacity={hovered ? 0.25 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Zone name */}
      <Html position={[0, 4.5, 0]} center>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '28px', marginBottom: '4px'
          }}>{zone.icon}</div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800, fontSize: '18px',
            color: zone.color,
            textShadow: `0 0 20px ${zone.color}`,
            marginBottom: '4px'
          }}>{zone.name}</div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px', color: '#8899bb',
            maxWidth: '200px', lineHeight: 1.5
          }}>{zone.description}</div>
        </div>
      </Html>

      {/* Floating experiment labels */}
      {zone.experiments.map((exp, i) => (
        <Html
          key={exp}
          position={[
            Math.cos(i * 2.1) * 4,
            Math.sin(i * 2.1) * 1.5,
            Math.sin(i * 2.1) * 2
          ]}
          center
        >
          <div style={{
            background: 'rgba(13,17,23,0.85)',
            border: `1px solid ${zone.color}44`,
            borderRadius: '6px',
            padding: '4px 10px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: zone.color,
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            {exp}
          </div>
        </Html>
      ))}

      {/* Ground glow */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -2.5, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial
          color={zone.color}
          transparent
          opacity={0.08}
        />
      </mesh>

      <pointLight
        position={[0, 0, 2]}
        color={zone.color}
        intensity={hovered ? 3 : 1.5}
        distance={8}
      />
    </group>
  )
}


function CameraController({ activeZone, controlsRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 15))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))
  const isTransitioning = useRef(false)

  useEffect(() => {
    if (activeZone) {
      // Move camera toward the selected zone
      const zoneX = activeZone.position[0]
      targetPos.current.set(zoneX, 3, 8)
      targetLook.current.set(zoneX, 0, 0)
    } else {
      // Return to overview position
      targetPos.current.set(0, 2, 15)
      targetLook.current.set(0, 0, 0)
    }
    isTransitioning.current = true
  }, [activeZone])

  useFrame(() => {
    if (!isTransitioning.current) return

    // Smooth lerp camera to target
    camera.position.lerp(targetPos.current, 0.05)

    if (controlsRef?.current) {
      controlsRef.current.target.lerp(
        targetLook.current, 0.05
      )
      controlsRef.current.update()
    }

    // Stop transition when close enough
    const distPos = camera.position.distanceTo(
      targetPos.current
    )
    if (distPos < 0.05) {
      isTransitioning.current = false
    }
  })

  return null
}


// ── LAB FLOOR ──
function LabFloor({ isInterior }) {
  return (
    <>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={isInterior ? [40, 40] : [120, 60]} />
        <meshStandardMaterial
          color={isInterior ? "#0d1117" : "#0a0f18"}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      <gridHelper
        args={isInterior ? [40, 20, '#2d3748', '#1a202c'] : [120, 60, '#1e2a3a', '#111820']}
        position={[0, -2.99, 0]}
      />
    </>
  )
}

// ── MAIN COMPONENT ──
export default function SimulationWorld() {
  const navigate = useNavigate()
  const [interactionMode, setInteractionMode] = useState('mouse')
  const [currentGesture, setCurrentGesture] = useState('none')
  const [leftCurrentGesture, setLeftCurrentGesture] = useState('none')
  const [activeZone, setActiveZone] = useState(null)
  const [activeInterior, setActiveInterior] = useState(null)
  const [inspecting, setInspecting] = useState(null)
  const [gestureEnabled, setGestureEnabled] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const {
    worldX, worldY, worldZ,
    isGrabbing, grabbedObjectId,
    inspectMode, inspectObjectId,
    setRightHand, setLeftHand, setBothHands,
    releaseObject, setInspectObjectId
  } = useGestureStore()

  const cursorPosRef = useRef({ x: 0, y: 0 })
  const controlsRef = useRef()
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0))

  const handleCanvasClick = () => {
    // Don't request pointer lock - use mouse events instead
    // Pointer lock causes WrongDocumentError in iframes
    setInteractionMode('mouse')
  }

  // Remove ALL calls to requestPointerLock()
  // Replace walking with mouse delta tracking instead:

  const handleMouseMove = (e) => {
    if (interactionMode !== 'mouse') return
    // Use e.movementX/Y for camera control
    // without needing pointer lock
  }

  useEffect(() => {
    // Remove pointerLock listeners entirely
  }, [])


  const handleGesture = useCallback((data) => {
    console.log('GESTURE RECEIVED:', data.hand, data.gesture)

    // Update store based on which hand
    if (data.hand === 'right') {
      useGestureStore.getState().setRightHand(data)
      setCurrentGesture(data.gesture)
    } else if (data.hand === 'left') {
      useGestureStore.getState().setLeftHand(data)
      setLeftCurrentGesture(data.gesture)
    }
  }, [])

  const handleBothHands = useCallback((data) => {
    useGestureStore.getState().setBothHands(data)
  }, [])

  const enableGestures = async () => {
    try {
      // Check permission first
      const permission = await navigator.permissions.query(
        { name: 'camera' }
      )

      if (permission.state === 'denied') {
        toast.error(
          'Camera permission denied. Please allow camera access.',
          { duration: 4000 }
        )
        return
      }

      setGestureEnabled(true)
      setInteractionMode('gesture')
      toast.success(
        '🤚 Gesture control enabled! Show your hand to the camera',
        { duration: 3000 }
      )
    } catch (err) {
      // Permission API not supported, try anyway
      setGestureEnabled(true)
      setInteractionMode('gesture')
    }
  }

  const {
    videoRef, canvasRef,
    status, gesture, leftGesture
  } = useGestureDetection({
    onGesture: handleGesture,
    onBothHands: handleBothHands,
    enabled: gestureEnabled && interactionMode === 'gesture'
  })

  const handleInspect = useCallback((objectId) => {
    setInspectObjectId(objectId)
  }, [setInspectObjectId])

  // Find inspected object data
  const inspectedObj = useMemo(() => {
    const allObjects = [
      { id:'bar-magnet-lab', color:'#ff4d6d', shape:'box', label:'Dipole Magnet' },
      { id:'solenoid', color:'#ffcc44', shape:'cylinder', label:'Solenoid' },
      { id:'prism-lab', color:'#00e5ff', shape:'cone', label:'Glass Prism' },
      { id:'nacl-crystal', color:'#a855f7', shape:'box', label:'NaCl Lattice' },
      { id:'benzene', color:'#22c55e', shape:'torus', label:'Benzene Ring' },
      { id:'dna-helix', color:'#14C8EC', shape:'cylinder', label:'DNA Double Helix' },
      { id:'cell-nucleus', color:'#E63946', shape:'sphere', label:'Cell Nucleus' },
      { id:'atom-model-lab', color:'#F2CC8F', shape:'sphere', label:'Hydrogen Atom' },
      // add all your objects here
    ]
    return allObjects.find(o => o.id === inspectObjectId)
  }, [inspectObjectId])

  return (
  <div style={{
    position: 'fixed', inset: 0,
    background: '#06080f',
    overflow: 'hidden'
  }}>

    {/* ── TOP BAR ── fixed, full width, 56px */}
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '56px',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'rgba(6,8,15,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e2a3a',
      gap: '12px'
    }}>
      {/* Left: back + title */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'transparent',
            border: '1px solid #1e2a3a',
            color: '#8899bb',
            padding: '6px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Syne,sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >← Exit</button>

        <div style={{
          fontFamily: 'Syne,sans-serif',
          fontWeight: 800,
          fontSize: '16px',
          color: '#e0eaff',
          whiteSpace: 'nowrap'
        }}>
          🥽 Simulation World
        </div>

        {activeZone && (
          <div style={{
            padding: '3px 10px',
            borderRadius: '12px',
            background: `${activeZone.color}22`,
            border: `1px solid ${activeZone.color}44`,
            color: activeZone.color,
            fontFamily: 'Space Mono,monospace',
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}>
            {activeZone.icon} {activeZone.name}
          </div>
        )}
      </div>

      {/* Center: hint text */}
      <div style={{
        fontFamily: 'Space Mono,monospace',
        fontSize: '11px',
        color: '#4a5a7a',
        textAlign: 'center',
        flex: 1
      }}>
        {activeZone
          ? `Exploring ${activeZone.name} — click "Open Lab" to start`
          : 'Click a portal to explore · Drag to rotate · Scroll to zoom'
        }
      </div>

      {/* Right: controls */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '8px', flexShrink: 0
      }}>
        <button
          onClick={() => {
            const newMode = interactionMode === 'gesture'
              ? 'mouse' : 'gesture'
            setInteractionMode(newMode)
            setGestureEnabled(newMode === 'gesture')
          }}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: 'none',
            background: interactionMode === 'gesture'
              ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
              : '#1e2a3a',
            color: interactionMode === 'gesture'
              ? '#fff' : '#4a5a7a',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {interactionMode === 'gesture'
            ? '🤚 Gestures ON'
            : '🖱 Mouse Mode'}
        </button>

        {activeZone && (
          <button
            onClick={() => {
              setActiveInterior(activeZone.id)
              setActiveZone(null)
            }}
            style={{
              padding: '6px 16px',
              borderRadius: '8px', border: 'none',
              background: activeZone.color,
              color: '#000',
              fontFamily: 'Syne,sans-serif',
              fontWeight: 800, fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🥽 Open Lab →
          </button>
        )}
      </div>
    </div>

    {/* ── 3D CONTENT ── */}
    {inspectMode && inspectedObj ? (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(6,8,15,0.92)',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Inspect Canvas */}
        <Canvas
          key="inspect-canvas"
          camera={{ position:[0,0,0], fov:60 }}
          style={{ width:'100%', height:'100%' }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              console.warn('WebGL context lost (Inspect) - pausing gestures')
            })
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored (Inspect)')
            })
          }}
        >
          <color attach="background" args={['#06080f']}/>
          <ambientLight intensity={0.5}/>

          <InspectObject
            objectId={inspectedObj.id}
            color={inspectedObj.color}
            shape={inspectedObj.shape}
            label={inspectedObj.label}
            onClose={() => releaseObject()}
          />
        </Canvas>

        {/* Top bar */}
        <div style={{
          position: 'absolute',
          top: '56px', left: 0, right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(6,8,15,0.8)',
          borderBottom: '1px solid #1e2a3a',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: inspectedObj.color,
              boxShadow: `0 0 8px ${inspectedObj.color}`
            }}/>
            <span style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '16px',
              color: inspectedObj.color
            }}>
              {inspectedObj.label}
            </span>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              color: '#4a5a7a'
            }}>
              360° Inspection Mode
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                const sceneMap = {
                  'bar-magnet-lab': 'magnetic-field-bar',
                  'prism-lab': 'prism-dispersion',
                  'convex-lens-lab': 'convex-lens',
                  'nacl-crystal': 'nacl-crystal',
                  'dna-helix': 'dna-helix',
                  'benzene': 'benzene-resonance',
                }
                const key = sceneMap[inspectedObj.id]
                if(key) navigate(`/experiment/${key}`)
              }}
              style={{
                padding: '8px 18px',
                background: inspectedObj.color,
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Open Full Experiment →
            </button>
            <button
              onClick={() => releaseObject()}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                color: '#4a5a7a',
                border: '1px solid #1e2a3a',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              ✕ Exit
            </button>
          </div>
        </div>
      </div>
    ) : (
      <>
        {/* Main Simulation Canvas */}
        <Canvas
          key={activeInterior ? 'interior-canvas' : 'world-canvas'}
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            right: 0,
            bottom: '56px',
            width: '100%',
            height: 'calc(100vh - 112px)'
          }}
          camera={{
            position: activeInterior === 'physics' ? [0, 8, 18] : [0, 2, 15],
            fov: activeInterior === 'physics' ? 65 : 75,
            near: 0.1,
            far: 200
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              console.warn('WebGL context lost - pausing gestures')
            })
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored')
            })
          }}
          onPointerMove={handleMouseMove}
          onClick={handleCanvasClick}
          dpr={[1, 2]}
          shadows
        >
          <CameraController
            activeZone={activeZone}
            controlsRef={controlsRef}
          />

          <GestureCursor3D enabled={gestureEnabled} />
          <CameraRig activeInterior={activeInterior} />
          <color attach="background" args={['#06080f']} />
          <fog attach="fog" args={['#06080f', 30, 80]} />

          <ambientLight intensity={0.5} color="#1a2a4a" />
          <Environment preset="night" />

          <Suspense fallback={
            <Html center>
              <div style={{ color: '#00e5ff', fontFamily: 'Space Mono, monospace' }}>
                LOADING...
              </div>
            </Html>
          }>
            <Physics gravity={[0, -9.81, 0]}>
              {activeInterior ? (
                (() => {
                  const Interior = getInterior(activeInterior)
                  return Interior ? (
                    <Interior
                      gestureEnabled={gestureEnabled}
                      onExitLab={() => setActiveInterior(null)}
                    />
                  ) : null
                })()
              ) : (
                <>
                  {ZONES.map(zone => (
                    <ZonePortal
                      key={zone.id}
                      zone={zone}
                      onEnter={setActiveZone}
                    />
                  ))}

                  {/* Objects */}
                  <GrabbableObject
                    id="bar-magnet-lab"
                    initialPosition={[-6, 1.5, -2]}
                    color="#ff4d6d"
                    shape="box"
                    label="Dipole Magnet"
                    scale={1}
                    onInspect={handleInspect}
                  />
                  <GrabbableObject
                    id="solenoid"
                    initialPosition={[-3, 1.5, -2]}
                    color="#ffcc44"
                    shape="cylinder"
                    label="Solenoid"
                    scale={1}
                    onInspect={handleInspect}
                  />
                  <GrabbableObject
                    id="prism-lab"
                    initialPosition={[0, 1.5, -2]}
                    color="#00e5ff"
                    shape="cone"
                    label="Glass Prism"
                    scale={1}
                    onInspect={handleInspect}
                  />
                  <GrabbableObject
                    id="nacl-crystal"
                    initialPosition={[3, 1.5, -2]}
                    color="#a855f7"
                    shape="box"
                    label="NaCl Lattice"
                    scale={1}
                    onInspect={handleInspect}
                  />
                  <GrabbableObject
                    id="benzene"
                    initialPosition={[6, 1.5, -2]}
                    color="#22c55e"
                    shape="torus"
                    label="Benzene Ring"
                    scale={1}
                    onInspect={handleInspect}
                  />

                  <GrabbableObject
                    id="dna-helix"
                    initialPosition={[-5, 2, -2]}
                    color="#14C8EC"
                    shape="cylinder"
                    label="DNA Double Helix"
                    scale={0.8}
                    onInspect={handleInspect}
                  />
                  <GrabbableObject
                    id="cell-nucleus"
                    initialPosition={[0, 2, -2]}
                    color="#E63946"
                    shape="sphere"
                    label="Cell Nucleus"
                    scale={1.2}
                    onInspect={handleInspect}
                  />
                  <GrabbableObject
                    id="atom-model-lab"
                    initialPosition={[5, 2, -2]}
                    color="#F2CC8F"
                    shape="sphere"
                    label="Hydrogen Atom"
                    scale={0.9}
                    onInspect={handleInspect}
                  />
                </>
              )}
              <LabFloor isInterior={!!activeInterior} />
            </Physics>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableDamping={true}
            maxPolarAngle={Math.PI / 2 + 0.2}
          />
        </Canvas>

        {/* HUD & Overlays */}
        {activeInterior && (
          <div style={{ position: 'fixed', top: '64px', left: '16px', zIndex: 300 }}>
            <button
              onClick={() => setActiveInterior(null)}
              style={{
                padding: '8px 16px',
                background: 'rgba(13,17,23,0.95)',
                border: '1px solid #1e2a3a',
                color: '#8899bb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← Back to World
            </button>
          </div>
        )}

        {activeZone && (
          <div style={{
            position: 'fixed', top: '56px', left: 0, width: '260px', zIndex: 150,
            background: 'rgba(13,17,23,0.95)', borderRight: `1px solid ${activeZone.color}33`,
            padding: '16px'
          }}>
            <h3 style={{ color: activeZone.color }}>{activeZone.name}</h3>
            <p style={{ fontSize: '11px', color: '#4a5a7a' }}>{activeZone.description}</p>
            <button
              onClick={() => { setActiveInterior(activeZone.id); setActiveZone(null); }}
              style={{ width: '100%', padding: '9px', background: activeZone.color, borderRadius: '8px' }}
            >
              Enter Lab
            </button>
          </div>
        )}

        {gestureEnabled && (
          <GestureHUD
            gesture={gesture}
            leftGesture={leftGesture}
            status={status}
            videoRef={videoRef}
            canvasRef={canvasRef}
          />
        )}

        {/* Navigator */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '56px', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: 'rgba(6,8,15,0.95)', borderTop: '1px solid #1e2a3a'
        }}>
          {ZONES.map(zone => (
            <button
              key={zone.id}
              onClick={() => setActiveZone(activeZone?.id === zone.id ? null : zone)}
              style={{
                padding: '6px 14px', borderRadius: '20px',
                border: activeZone?.id === zone.id ? `1px solid ${zone.color}` : '1px solid #1e2a3a',
                color: activeZone?.id === zone.id ? zone.color : '#4a5a7a',
                background: activeZone?.id === zone.id ? `${zone.color}22` : 'transparent'
              }}
            >
              {zone.icon} {zone.name}
            </button>
          ))}
        </div>

        {/* Debug Toggle & Panel */}
        {showDebug && process.env.NODE_ENV === 'development' && (
          <div style={{
            position:'fixed', top:'100px', left:'16px', zIndex:999,
            background:'rgba(6,8,15,0.85)', border:'1px solid #00e5ff44', padding:'8px 12px',
            color:'#00e5ff', fontSize:'10px', fontFamily:'Space Mono,monospace',
            pointerEvents: 'none', backdropFilter: 'blur(8px)'
          }}>
            <div style={{ color:'#ffcc44', fontWeight:700 }}>🔧 GESTURE DEBUG</div>
            <div>Gesture: {gesture}</div>
            <div>Left: {leftGesture}</div>
            <div>Mode: {interactionMode}</div>
          </div>
        )}
        
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => setShowDebug(d => !d)}
            style={{
              position:'fixed', bottom:'68px', left:'16px', zIndex:200,
              padding:'4px 10px', background:'rgba(6,8,15,0.8)', color: showDebug ? '#00e5ff' : '#334455', borderRadius:'6px'
            }}
          >
            🔧
          </button>
        )}
      </>
    )}
  </div>
);
}
