'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { StatusBar, Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

type Phase = 'idle' | 'counting' | 'snap' | 'done'

// Viewfinder stand-in: the frame dims as each shot lands, like the Paper prototype.
const VIEWFINDER = ['#7A766E', '#5E5A54', '#3F3C39', '#14171A']

export default function Capture({ booth, go }: ScreenProps) {
  const total = booth.shots
  const [shot, setShot] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(3)
  const [timer, setTimer] = useState(true)
  const [flash, setFlash] = useState(true)
  const [flipped, setFlipped] = useState(false)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timeouts.current.forEach(clearTimeout), [])
  const later = (fn: () => void, ms: number) => timeouts.current.push(setTimeout(fn, ms))

  const snap = () => {
    setPhase('snap')
    later(() => {
      const next = shot + 1
      setShot(next)
      if (next >= total) {
        setPhase('done')
        later(() => go(booth.solo ? 'layoutPick' : 'waiting'), 1100)
      } else {
        setPhase('idle')
      }
    }, 650)
  }

  const shoot = () => {
    if (phase !== 'idle') return
    if (!timer) return snap()
    setPhase('counting')
    setCount(3)
    later(() => setCount(2), 800)
    later(() => setCount(1), 1600)
    later(snap, 2400)
  }

  const bg = VIEWFINDER[Math.min(shot, VIEWFINDER.length - 1)]

  return (
    <motion.div
      animate={{ backgroundColor: bg }}
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* soft "lens" vignette so it reads as a viewfinder */}
      <motion.div
        animate={{ scaleX: flipped ? -1 : 1 }}
        style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 40%, transparent 40%, rgba(0,0,0,.28) 100%)' }}
      />
      <StatusBar dark />

      {/* Top chrome */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 18px 0' }}>
        <Tap aria-label="Close" onClick={() => go('home', -1)} style={{ width: 38, height: 38, borderRadius: 999, background: '#FFFFFF2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          {phase === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: 168 }} />
          )}
        </AnimatePresence>
        <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#fff' }}>
          {phase === 'done' ? 'ALL DONE — NICE!' : phase === 'idle' ? (shot === 0 ? 'TAP TO START' : 'READY FOR THE NEXT ONE') : 'SAY CHEESE!'}
        </div>
      </div>

      {/* Confetti dots */}
      {[
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
          { label: 'flip', on: flipped, set: () => setFlipped((v) => !v) },
        ].map((t) => (
          <Tap
            key={t.label}
            onClick={t.set}
            style={{
              height: 34, padding: '0 14px', borderRadius: 99, border: `2.5px solid ${colors.ink}`,
              background: t.on ? colors.citrus : '#FFFFFF24', color: t.on ? colors.ink : '#fff',
              fontFamily: fonts.display, fontSize: 11, fontWeight: 600,
            }}
          >
            {t.label}
          </Tap>
        ))}
      </div>

      {/* Shutter + progress */}
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

      {/* Flash */}
      <AnimatePresence>
        {phase === 'snap' && flash && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, background: '#fff', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
