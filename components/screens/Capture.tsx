'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Button, StatusBar, Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

type Phase = 'idle' | 'counting' | 'snap' | 'done'
// ask: our pre-permission card · starting: waiting on the browser prompt · live: streaming
// denied: user or browser blocked it · unavailable: no camera / insecure context · skipped: placeholders
type Cam = 'checking' | 'ask' | 'starting' | 'live' | 'denied' | 'unavailable' | 'skipped'

// Placeholder viewfinder when there's no camera: dims as each shot lands
const VIEWFINDER = ['#7A766E', '#5E5A54', '#3F3C39', '#14171A']

export default function Capture({ booth, update, go, toast }: ScreenProps) {
  const total = booth.shots
  const [shot, setShot] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(3)
  const [timer, setTimer] = useState(true)
  const [flash, setFlash] = useState(true)
  const [facing, setFacing] = useState<'user' | 'environment'>('user')
  const [cam, setCam] = useState<Cam>('checking')
  const [lastPhoto, setLastPhoto] = useState<string | null>(null)

  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const photos = useRef<string[]>([])
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const later = (fn: () => void, ms: number) => timeouts.current.push(setTimeout(fn, ms))

  const stopStream = () => {
    stream.current?.getTracks().forEach((t) => t.stop())
    stream.current = null
  }

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCam('unavailable')
      return
    }
    setCam('starting')
    try {
      stopStream()
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      stream.current = s
      if (video.current) {
        video.current.srcObject = s
        await video.current.play().catch(() => {})
      }
      setCam('live')
    } catch (err) {
      const name = (err as DOMException)?.name
      setCam(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'unavailable')
    }
  }, [])

  // Fresh roll each time; skip our ask card if the browser already granted access
  useEffect(() => {
    update({ photos: [], friendDone: false })
    let cancelled = false
    const check = async () => {
      try {
        const status = await navigator.permissions?.query({ name: 'camera' as PermissionName })
        if (cancelled) return
        if (status?.state === 'granted') return startCamera('user')
        if (status?.state === 'denied') return setCam('denied')
      } catch { /* Permissions API can't query camera in this browser — fall through to asking */ }
      if (!cancelled) setCam('ask')
    }
    check()
    return () => {
      cancelled = true
      timeouts.current.forEach(clearTimeout)
      stopStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flip = () => {
    const next = facing === 'user' ? 'environment' : 'user'
    setFacing(next)
    if (cam === 'live') startCamera(next)
  }

  // Grab the current video frame (mirrored for the selfie camera, like the preview)
  const grabFrame = (): string | null => {
    const v = video.current
    if (cam !== 'live' || !v || !v.videoWidth) return null
    const w = Math.min(v.videoWidth, 960)
    const h = Math.round((w / v.videoWidth) * v.videoHeight)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    if (facing === 'user') {
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(v, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', 0.85)
  }

  const snap = () => {
    const photo = grabFrame()
    if (photo) {
      photos.current = [...photos.current, photo]
      setLastPhoto(photo)
    }
    setPhase('snap')
    later(() => {
      const next = shot + 1
      setShot(next)
      if (next >= total) {
        setPhase('done')
        update({ photos: photos.current })
        later(() => {
          stopStream()
          go(booth.solo ? 'decorate' : 'waiting')
        }, 1100)
      } else {
        setPhase('idle')
      }
    }, 650)
  }

  const shoot = () => {
    if (phase !== 'idle') return
    if (cam === 'ask' || cam === 'checking') return startCamera(facing)
    if (!timer) return snap()
    setPhase('counting')
    setCount(3)
    later(() => setCount(2), 800)
    later(() => setCount(1), 1600)
    later(snap, 2400)
  }

  const live = cam === 'live'
  const bg = live ? '#000' : VIEWFINDER[Math.min(shot, VIEWFINDER.length - 1)]
  const blocking = cam === 'ask' || cam === 'denied' || cam === 'unavailable' || cam === 'starting'

  return (
    <motion.div animate={{ backgroundColor: bg }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Live camera feed */}
      <video
        ref={video}
        playsInline
        muted
        autoPlay
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: facing === 'user' ? 'scaleX(-1)' : 'none',
          opacity: live ? 1 : 0, transition: 'opacity .4s ease',
        }}
      />
      {/* Readability scrim for the chrome on top of the feed */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.45) 0%, transparent 22%, transparent 62%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative' }}><StatusBar dark /></div>

      {/* Top chrome */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 18px 0' }}>
        <Tap aria-label="Close" onClick={() => { stopStream(); go('home', -1) }} style={{ width: 38, height: 38, borderRadius: 999, background: '#FFFFFF2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={16} color="#fff" strokeWidth={2.2} />
        </Tap>
        {!booth.solo && (
          <div style={{ background: colors.citrus, border: `2px solid ${colors.ink}`, borderRadius: 99, padding: '6px 14px', rotate: '-3deg', fontFamily: fonts.display, fontSize: 11, fontWeight: 600, color: colors.ink }}>
            with {booth.friend.toLowerCase()} ✦
          </div>
        )}
        <div style={{ width: 38, height: 38, borderRadius: 999, background: '#FFFFFF2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.body, fontSize: 11, fontWeight: 700, color: '#fff' }}>
          {Math.min(shot + 1, total)}/{total}
        </div>
      </div>

      {/* Countdown / check */}
      {!blocking && (
        <div style={{ position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
          <AnimatePresence mode="popLayout">
            {phase === 'counting' && (
              <motion.div
                key={count}
                initial={{ scale: 1.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                style={{ fontFamily: fonts.display, fontSize: 140, fontWeight: 700, lineHeight: '168px', color: colors.citrus, textShadow: `5px 5px 0 ${colors.ink}` }}
              >
                {count}
              </motion.div>
            )}
            {(phase === 'snap' || phase === 'done') && (
              <motion.div
                key={`check-${shot}`}
                initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                style={{ fontFamily: fonts.display, fontSize: 120, fontWeight: 700, lineHeight: '168px', color: colors.citrus, textShadow: `5px 5px 0 ${colors.ink}` }}
              >
                ✓
              </motion.div>
            )}
            {phase === 'idle' && <motion.div key="idle" style={{ height: 168 }} />}
          </AnimatePresence>
          <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.5)' }}>
            {phase === 'done' ? 'ALL DONE — NICE!' : phase === 'idle' ? (shot === 0 ? 'TAP TO START' : 'READY FOR THE NEXT ONE') : 'SAY CHEESE!'}
          </div>
        </div>
      )}

      {/* Confetti dots (placeholder mode only — they'd sit on your face otherwise) */}
      {!live && [
        { c: colors.citrus, s: 12, l: 34, t: 120 }, { c: colors.hibiscus, s: 8, r: 44, t: 200 },
        { c: colors.hibiscus, s: 10, l: 46, b: 260 }, { c: colors.citrus, s: 14, r: 38, b: 210 },
      ].map((d, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
          style={{ position: 'absolute', width: d.s, height: d.s, borderRadius: 999, background: d.c, left: d.l, right: d.r, top: d.t, bottom: d.b }}
        />
      ))}

      {/* Tool rail */}
      <div style={{ position: 'absolute', bottom: 179, left: 0, right: 0, display: 'flex', gap: 8, justifyContent: 'center' }}>
        {[
          { label: '3s', on: timer, set: () => setTimer((v) => !v) },
          { label: 'flash', on: flash, set: () => setFlash((v) => !v) },
          { label: 'flip', on: facing === 'environment', set: flip },
        ].map((t) => (
          <Tap
            key={t.label}
            onClick={t.set}
            style={{
              height: 34, padding: '0 14px', borderRadius: 99, border: `2.5px solid ${colors.ink}`,
              background: t.on ? colors.citrus : '#FFFFFF33', color: t.on ? colors.ink : '#fff',
              fontFamily: fonts.display, fontSize: 11, fontWeight: 600,
            }}
          >
            {t.label}
          </Tap>
        ))}
      </div>

      {/* Shutter + last shot + progress */}
      <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Tap
          aria-label="Take photo"
          onClick={shoot}
          whileTap={{ scale: 0.88 }}
          style={{ width: 84, height: 84, borderRadius: 999, background: colors.hibiscus, border: `3.5px solid ${colors.ink}`, boxShadow: `5px 5px 0 ${colors.ink}`, opacity: phase === 'idle' ? 1 : 0.85 }}
        />
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: total }).map((_, i) => (
            <motion.div key={i} animate={{ backgroundColor: i < shot ? colors.citrus : '#FFFFFF4D' }} style={{ width: 20, height: 5, borderRadius: 99 }} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lastPhoto && (
          <motion.div
            key={photos.current.length}
            initial={{ scale: 1.8, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ position: 'absolute', left: 40, bottom: 78, width: 48, height: 48, borderRadius: 8, overflow: 'hidden', border: `2.5px solid ${colors.ink}`, boxShadow: `3px 3px 0 ${colors.ink}`, background: '#fff' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lastPhoto} alt="Last shot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash */}
      <AnimatePresence>
        {phase === 'snap' && flash && (
          <motion.div initial={{ opacity: 0.95 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0, background: '#fff', pointerEvents: 'none' }} />
        )}
      </AnimatePresence>

      {/* Permission card */}
      <AnimatePresence>
        {blocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(20,23,26,.55)', display: 'flex', alignItems: 'flex-end', zIndex: 10 }}
          >
            <motion.div
              initial={{ y: 60, rotate: 0 }}
              animate={{ y: 0, rotate: -1 }}
              exit={{ y: 60 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              style={{ margin: '0 18px 36px', width: '100%', padding: '22px 20px 20px', background: colors.cream, border: `3px solid ${colors.ink}`, borderRadius: 22, boxShadow: `6px 6px 0 ${colors.ink}` }}
            >
              <PermissionCopy cam={cam} />
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <Button
                  variant="outline"
                  height={50}
                  onClick={() => { setCam('skipped'); toast('Using placeholder shots ✦') }}
                  style={{ fontSize: 13 }}
                >
                  {cam === 'ask' || cam === 'starting' ? 'Not now' : 'Use placeholders'}
                </Button>
                <Button
                  variant={cam === 'starting' ? 'disabled' : 'hibiscus'}
                  height={50}
                  grow={1.4}
                  onClick={() => startCamera(facing)}
                  style={{ fontSize: 15 }}
                >
                  {cam === 'starting' ? 'Waiting…' : cam === 'ask' ? 'Allow camera' : 'Try again'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PermissionCopy({ cam }: { cam: Cam }) {
  const copy = {
    ask:         { title: 'Can Confetti use your camera?', body: 'It’s only on while you’re in the booth. Your shots stay on this phone until you share the strip.' },
    starting:    { title: 'Check the pop-up ↑',            body: 'Your browser is asking for camera access. Tap Allow to start shooting.' },
    denied:      { title: 'Camera’s blocked',               body: 'Turn camera access back on for this site in your browser settings, then tap Try again.' },
    unavailable: { title: 'No camera found',                body: 'We couldn’t reach a camera on this device. You can still play through with placeholder shots.' },
  }[cam as 'ask' | 'starting' | 'denied' | 'unavailable']
  if (!copy) return null
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: cam === 'ask' || cam === 'starting' ? colors.hibiscus : colors.citrus, border: `2.5px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', rotate: '-6deg' }}>
        <Icon name="camera" size={22} color={cam === 'ask' || cam === 'starting' ? '#fff' : colors.ink} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 700, lineHeight: '120%', color: colors.ink }}>{copy.title}</div>
        <div style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: '150%', color: colors.inkMid, marginTop: 6 }}>{copy.body}</div>
      </div>
    </div>
  )
}
