'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Button, RoundButton, Screen, Tap } from '../ui/kit'
import { Frame } from '../ui/Strip'
import type { ScreenProps } from '../AppShell'

type Stage = 'review' | 'printing' | 'ready'

export default function Print({ booth, go, toast }: ScreenProps) {
  const [delivery, setDelivery] = useState<'pickup' | 'mail'>('pickup')
  const [stage, setStage] = useState<Stage>('review')
  const [progress, setProgress] = useState(0.42)
  const timer = useRef<ReturnType<typeof setInterval>>()
  useEffect(() => () => clearInterval(timer.current), [])

  const confirm = () => {
    if (stage === 'ready') return go('home', -1)
    if (stage === 'printing') return
    setStage('printing')
    setProgress(0)
    timer.current = setInterval(() => setProgress((p) => Math.min(p + 0.04, 1)), 80)
  }

  useEffect(() => {
    if (stage !== 'printing' || progress < 1) return
    clearInterval(timer.current)
    setStage('ready')
    toast(delivery === 'pickup' ? 'Ready for pickup ✦' : 'On its way ✦')
  }, [stage, progress, delivery, toast])

  const ready = delivery === 'pickup' ? 'ready for pickup around 10:40am' : 'arrives in 3–5 days'
  const paper = Math.min(progress, 1)

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 22px 0' }}>
        <RoundButton icon="back" label="Back" onClick={() => go('share', -1)} />
        <span style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: 700, color: colors.ink }}>Print</span>
        <span style={{ width: 34 }} />
      </div>

      {/* Order card */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ display: 'flex', gap: 14, padding: 16, background: '#fff', border: `2.5px solid ${colors.ink}`, borderRadius: 16, boxShadow: `4px 4px 0 ${colors.ink}` }}>
          <div style={{ width: 56, height: 74, padding: 4, borderRadius: 8, background: colors.cream, border: `2px solid ${colors.ink}`, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {Array.from({ length: booth.shots }).map((_, i) => <Frame key={i} index={i} photo={booth.photos[i]} filter={booth.filter} style={{ flex: 1, borderRadius: 2 }} />)}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 600, color: colors.ink }}>Strip #0064</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.inkMid }}>4×6in · glossy</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.inkMid }}>{delivery === 'pickup' ? 'Analog Lab · 5th & Pine' : 'Mailed to your address'}</span>
          </div>
          <span style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: 700, color: colors.ink }}>{delivery === 'pickup' ? '$2.40' : '$3.90'}</span>
        </div>
      </div>

      <div style={{ padding: '20px 22px 8px', fontFamily: fonts.body, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', color: colors.inkMid }}>DELIVERY</div>
      <div style={{ display: 'flex', gap: 8, padding: '0 22px' }}>
        {([['pickup', 'Pickup', 'ready in 1h'], ['mail', 'Mail', '3–5 days']] as const).map(([id, t, s]) => {
          const on = delivery === id
          return (
            <Tap
              key={id}
              onClick={() => stage === 'review' && setDelivery(id)}
              style={{ flex: 1, padding: '12px 10px', borderRadius: 12, border: `2px solid ${colors.ink}`, background: on ? colors.ink : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'background .2s' }}
            >
              <span style={{ fontFamily: fonts.display, fontSize: 13, fontWeight: 600, color: on ? colors.cream : colors.ink }}>{t}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 10.5, color: on ? '#FFF8ECBF' : colors.inkMid }}>{s}</span>
            </Tap>
          )
        })}
      </div>

      {/* Printer */}
      <div style={{ padding: '26px 22px 0' }}>
        <div style={{ position: 'relative', height: 110 }}>
          <div style={{ position: 'relative', zIndex: 2, height: 64, borderRadius: 14, background: colors.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ width: '70%', height: 6, borderRadius: 3, background: '#0A0A0A' }} />
            <span style={{ fontFamily: fonts.body, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: '#FFF8EC8C' }}>ANALOG LAB PRINTER</span>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 46, height: 64 + 40, overflow: 'hidden', zIndex: 1 }}>
            <motion.div
              animate={{ y: -40 + paper * 40 }}
              style={{
                width: 88, margin: '0 auto', padding: 6, display: 'flex', flexDirection: 'column', gap: 4, background: '#fff',
                border: `2.5px solid ${colors.ink}`, borderTop: 'none', borderRadius: '0 0 10px 10px', boxShadow: `3px 3px 0 ${colors.ink}`,
              }}
            >
              {[0, 1].map((i) => <Frame key={i} index={i} photo={booth.photos[i]} filter={booth.filter} style={{ height: 26, borderRadius: 4 }} />)}
            </motion.div>
          </div>
        </div>
      </div>

      <div style={{ padding: '34px 22px 0' }}>
        <div style={{ height: 8, borderRadius: 99, border: `1.5px solid ${colors.ink}`, background: '#ECE5D6', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${paper * 100}%` }} transition={{ ease: 'linear', duration: 0.08 }} style={{ height: '100%', background: colors.hibiscus }} />
        </div>
        <div style={{ paddingTop: 8, fontFamily: fonts.body, fontSize: 12.5, color: colors.inkMid }}>
          {stage === 'ready' ? `Done! ${ready[0].toUpperCase()}${ready.slice(1)}.` : stage === 'printing' ? `Printing… ${ready}` : `Queued · ${ready}`}
        </div>
      </div>

      <div style={{ padding: '34px 22px 0', display: 'flex' }}>
        <Button onClick={confirm} height={52} style={{ fontSize: 15 }}>
          {stage === 'ready' ? 'Back to home' : stage === 'printing' ? 'Printing…' : `Confirm & pay ${delivery === 'pickup' ? '$2.40' : '$3.90'}`}
        </Button>
      </div>
    </Screen>
  )
}
