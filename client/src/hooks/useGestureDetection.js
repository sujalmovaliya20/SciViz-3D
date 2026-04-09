import { useEffect, useRef, useState, useCallback } from 'react'

export default function useGestureDetection({ 
  onGesture,
  onBothHands,
  enabled = false 
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const handsRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const activeRef = useRef(false)
  const sendingRef = useRef(false)
  const onGestureRef = useRef(onGesture)
  const onBothHandsRef = useRef(onBothHands)
  const [status, setStatus] = useState('idle')
  const [gesture, setGesture] = useState('none')
  const [leftGesture, setLeftGesture] = useState('none')
  const frameCountRef = useRef(0)
  const prevRightRef = useRef('none')
  const prevLeftRef = useRef('none')
  const holdRef = useRef({ g:'none', n:0 })
  const leftHoldRef = useRef({ g:'none', n:0 })

  // Keep callbacks fresh
  useEffect(() => { onGestureRef.current = onGesture }, 
    [onGesture])
  useEffect(() => { onBothHandsRef.current = onBothHands }, 
    [onBothHands])

  const classify = useCallback((lm) => {
    if (!lm || lm.length < 21) return ['none', 0]
    const d = (a,b) => Math.hypot(a.x-b.x, a.y-b.y)
    const up = (ti,bi) => lm[ti].y < lm[bi].y - 0.03
    const iUp=up(8,5), mUp=up(12,9)
    const rUp=up(16,13), pUp=up(20,17)
    const pd = d(lm[4], lm[8])
    if (pd < 0.06)              return ['pinch',  0.95]
    if (!iUp&&!mUp&&!rUp&&!pUp) return ['grab',   0.90]
    if (iUp&&mUp&&rUp&&pUp)     return ['open',   0.92]
    if (iUp&&!mUp&&!rUp&&!pUp)  return ['point',  0.93]
    if (iUp&&mUp&&!rUp&&!pUp)   return ['peace',  0.91]
    return ['none', 0.3]
  }, [])

  const drawHand = useCallback((ctx, lm, W, H, color, tag) => {
    const CONN = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17]
    ]
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    CONN.forEach(([a,b]) => {
      if (!lm[a]||!lm[b]) return
      ctx.beginPath()
      ctx.moveTo(lm[a].x*W, lm[a].y*H)
      ctx.lineTo(lm[b].x*W, lm[b].y*H)
      ctx.stroke()
    })
    lm.forEach((p,i) => {
      if (!p) return
      const tip = [4,8,12,16,20].includes(i)
      ctx.beginPath()
      ctx.arc(p.x*W, p.y*H, tip?7:3, 0, Math.PI*2)
      ctx.fillStyle = tip ? color : '#ffffff88'
      ctx.fill()
    })
    // Tag label
    ctx.fillStyle = color
    ctx.font = 'bold 12px monospace'
    const wx = lm[0].x*W, wy = lm[0].y*H
    ctx.fillText(tag, wx-6, wy+18)
  }, [])

  const processHand = useCallback((lm, side) => {
    const color = side === 'right' ? '#00e5ff' : '#a855f7'
    const tag = side === 'right' ? 'R' : 'L'

    const c = canvasRef.current
    if (c && c.width > 0) {
      const ctx = c.getContext('2d')
      drawHand(ctx, lm, c.width, c.height, color, tag)
    }

    const holdR = side === 'right' ? holdRef : leftHoldRef
    const prevR = side === 'right' ? prevRightRef : prevLeftRef
    const [g, conf] = classify(lm)

    if (g === holdR.current.g) holdR.current.n++
    else { holdR.current.g = g; holdR.current.n = 1 }
    const stable = holdR.current.n >= 2 
      ? g : prevR.current

    if (side === 'right') setGesture(stable)
    else setLeftGesture(stable)

    if (stable !== prevR.current) {
      prevR.current = stable
      onGestureRef.current?.({
        hand: side,
        gesture: stable,
        confidence: conf,
        landmarks: lm,
        indexTip: lm[8],
        thumbTip: lm[4],
        wrist: lm[0],
        pinchDist: Math.hypot(
          lm[4].x-lm[8].x, 
          lm[4].y-lm[8].y
        )
      })
    }
  }, [classify, drawHand])

  useEffect(() => {
    if (!enabled) {
      activeRef.current = false
      clearTimeout(timerRef.current)
      setStatus('idle')
      setGesture('none')
      setLeftGesture('none')
      return
    }
    activeRef.current = true

    const run = async () => {
      try {
        setStatus('loading')

        // Load MediaPipe
        if (!window.Hands) {
          await new Promise((res, rej) => {
            const s = document.createElement('script')
            s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js'
            s.crossOrigin = 'anonymous'
            s.onload = () => setTimeout(res, 1500)
            s.onerror = rej
            document.head.appendChild(s)
          })
        }
        if (!activeRef.current) return

        // Get webcam
        const stream = await navigator.mediaDevices
          .getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
          })
        if (!activeRef.current) {
          stream.getTracks().forEach(t=>t.stop())
          return
        }
        streamRef.current = stream

        const video = videoRef.current
        if (!video) return

        video.srcObject = null
        await new Promise(r => setTimeout(r, 100))
        video.srcObject = stream
        video.muted = true
        video.playsInline = true

        // Wait for video with timeout
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 8000)
          video.onloadeddata = async () => {
            clearTimeout(timeout)
            try { await video.play() } catch(e) {}
            await new Promise(r => setTimeout(r, 800))
            resolve()
          }
        })
        if (!activeRef.current) return

        // Canvas setup
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = 220
        canvas.height = 165

        // Init MediaPipe
        const hands = new window.Hands({
          locateFile: f =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${f}`
        })

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5
        })

        hands.onResults((results) => {
          sendingRef.current = false
          if (!activeRef.current) return

          const c = canvasRef.current
          if (!c || c.width === 0) return

          const ctx = c.getContext('2d')
          const W = c.width, H = c.height

          // Draw video
          ctx.clearRect(0,0,W,H)
          ctx.save()
          ctx.scale(-1,1)
          ctx.translate(-W,0)
          try {
            if (results.image) {
              ctx.drawImage(results.image,0,0,W,H)
            }
          } catch(e) {}
          ctx.restore()

          const detected = results.multiHandLandmarks?.length||0

          if (detected === 0) return

          // KEY FIX: Use POSITION to determine 
          // left vs right instead of unreliable labels
          const hands_data = results.multiHandLandmarks
            .map((raw, i) => {
              const lm = raw.map(p => ({
                x: 1-p.x, y: p.y, z: p.z||0
              }))
              // Get label safely
              const labelObj = results.multiHandedness?.[i]
                ?.classification?.[0]
              const label = labelObj?.label || ''
              
              return { lm, label, wristX: lm[0].x }
            })

          if (hands_data.length === 1) {
            const hand = hands_data[0]
            // Single hand: use label if available
            // "Left" from MediaPipe after mirror = Right hand
            // "Right" from MediaPipe after mirror = Left hand
            // If label undefined, use wrist position:
            // wristX > 0.5 = right side of screen = right hand
            let side
            if (hand.label === 'Left') {
              side = 'right'
            } else if (hand.label === 'Right') {
              side = 'left'
            } else {
              // Fallback: position-based
              side = hand.wristX > 0.5 ? 'right' : 'left'
            }
            processHand(hand.lm, side)

          } else if (hands_data.length >= 2) {
            // Two hands: sort by X position
            // Larger X (right side of screen) = user's right hand
            hands_data.sort((a,b) => b.wristX - a.wristX)
            
            // hands_data[0] = rightmost = user's RIGHT
            // hands_data[1] = leftmost = user's LEFT
            processHand(hands_data[0].lm, 'right')
            processHand(hands_data[1].lm, 'left')

            // Both hands callback
            const dist = Math.hypot(
              hands_data[0].wristX - hands_data[1].wristX,
              hands_data[0].lm[0].y - hands_data[1].lm[0].y
            )
            onBothHandsRef.current?.({
              rightHand: hands_data[0].lm,
              leftHand: hands_data[1].lm,
              handDistance: dist,
              rightGesture: prevRightRef.current,
              leftGesture: prevLeftRef.current
            })
          }
        })

        handsRef.current = hands

        // Detection loop
        const detect = async () => {
          if (!activeRef.current) return
          if (sendingRef.current) {
            timerRef.current = setTimeout(detect, 100)
            return
          }

          const v = videoRef.current
          const ready = v &&
            !v.paused && !v.ended &&
            v.readyState >= 2 &&
            v.videoWidth > 0 &&
            v.videoHeight > 0

          if (ready && handsRef.current) {
            sendingRef.current = true
            try {
              await handsRef.current.send({ image: v })
            } catch(e) {
              sendingRef.current = false
            }
          }

          timerRef.current = setTimeout(detect, 80)
        }

        // Extra startup delay
        await new Promise(r => setTimeout(r, 1500))
        if (!activeRef.current) return

        setStatus('active')
        detect()

      } catch(err) {
        console.error('Gesture init:', err.message)
        setStatus('error')
      }
    }

    run()

    return () => {
      activeRef.current = false
      sendingRef.current = false
      clearTimeout(timerRef.current)
      handsRef.current?.close?.()
      handsRef.current = null
      streamRef.current?.getTracks().forEach(t=>t.stop())
      streamRef.current = null
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }
    }
  }, [enabled, processHand])

  return { videoRef, canvasRef, status, gesture, leftGesture }
}
