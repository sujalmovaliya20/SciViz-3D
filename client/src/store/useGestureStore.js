import { create } from 'zustand'

const useGestureStore = create((set, get) => ({
  // RIGHT HAND — navigation cursor
  rightGesture: 'none',
  rightX: 0.5, rightY: 0.5,
  rightWorldX: 0, rightWorldY: 0,

  // LEFT HAND — action hand
  leftGesture: 'none',
  leftX: 0.5, leftY: 0.5,
  leftWorldX: 0, leftWorldY: 0,

  // Combined
  bothHandsActive: false,
  handDistance: 0,         // distance between hands (0-1)
  prevHandDistance: 0,     // for pinch zoom

  // Object state
  grabbedObjectId: null,
  isGrabbing: false,
  inspectMode: false,      // 360 inspect mode
  inspectObjectId: null,
  inspectRotX: 0,
  inspectRotY: 0,
  inspectZoom: 3,

  // Legacy (for cursor)
  worldX: 0, worldY: 0, worldZ: -2,
  gesture: 'none',
  isRotating: false,
  rotateX: 0, rotateY: 0,

  setRightHand: (data) => {
    const tip = data.indexTip
    if (!tip) return

    const worldX = (tip.x - 0.5) * 16
    const worldY = -(tip.y - 0.5) * 10

    set(state => ({
      rightGesture: data.gesture,
      rightX: tip.x, rightY: tip.y,
      rightWorldX: worldX, rightWorldY: worldY,
      // Cursor always follows right hand
      worldX, worldY, worldZ: -2,
      gesture: data.gesture,
      // Right hand grab/pinch = grab object
      isGrabbing: data.gesture === 'pinch' || 
                  data.gesture === 'grab'
    }))

    // Check inspect mode exit
    if (data.gesture === 'open' && get().inspectMode) {
      set({ 
        inspectMode: false, 
        inspectObjectId: null,
        grabbedObjectId: null 
      })
    }
  },

  setLeftHand: (data) => {
    const tip = data.indexTip
    if (!tip) return

    const worldX = (tip.x - 0.5) * 16
    const worldY = -(tip.y - 0.5) * 10

    set(state => {
      const newState = {
        leftGesture: data.gesture,
        leftX: tip.x, leftY: tip.y,
        leftWorldX: worldX, leftWorldY: worldY,
      }

      // LEFT HAND ACTIONS on grabbed object:
      if (state.grabbedObjectId) {
        if (data.gesture === 'grab') {
          // Left grab = rotate grabbed object
          newState.isRotating = true
          newState.rotateX = worldX
          newState.rotateY = worldY
        } else if (data.gesture === 'pinch') {
          // Left pinch = enter inspect mode
          newState.inspectMode = true
          newState.inspectObjectId = state.grabbedObjectId
          newState.inspectZoom = 3
        } else if (data.gesture === 'open') {
          newState.isRotating = false
          newState.inspectMode = false
        }
      }
      return newState
    })
  },

  // Update both hands (zoom gesture)
  setBothHands: (data) => {
    const prev = get().handDistance
    const curr = data.handDistance

    set({
      bothHandsActive: true,
      handDistance: curr,
      prevHandDistance: prev
    })

    // Calculate zoom delta
    if (prev > 0) {
      const zoomDelta = (curr - prev) * 15
      const { inspectMode, inspectZoom } = get()

      if (inspectMode) {
        // Zoom inspect object
        const newZoom = Math.max(1, 
          Math.min(8, inspectZoom + zoomDelta))
        set({ inspectZoom: newZoom })
      }
    }
  },

  // Inspect rotation from left hand movement
  updateInspectRotation: (dx, dy) => {
    const { inspectRotX, inspectRotY } = get()
    set({
      inspectRotX: inspectRotX + dy * 180,
      inspectRotY: inspectRotY + dx * 180
    })
  },

  setGrabbedObject: (id) => set({ 
    grabbedObjectId: id,
    isGrabbing: true 
  }),
  
  releaseObject: () => set({ 
    grabbedObjectId: null, 
    isGrabbing: false,
    inspectMode: false,
    inspectObjectId: null
  }),

  // Legacy
  setGesture: (gesture, data) => {
    if (data?.hand === 'left') {
      get().setLeftHand({ ...data, gesture })
    } else {
      get().setRightHand({ ...data, gesture })
    }
  }
}))

export default useGestureStore
