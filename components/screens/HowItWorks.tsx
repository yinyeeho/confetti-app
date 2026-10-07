'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Button, Dots, Eyebrow, Footer, Screen, Tap, Title } from '../ui/kit'
import type { ScreenProps } from '../AppShell'

const STEPS = [
  { n: 1, bg: colors.citrus,   fg: colors.ink,  title: 'Start a booth',      body: 'Pick a layout. 4-up, diptych, polaroid — your call.' },
  { n: 2, bg: colors.hibiscus, fg: '#fff',      title: 'Invite a friend',    body: 'Send a link. They tap, the booth opens on their phone.' },
  { n: 3, bg: colors.cobalt,   fg: '#fff',      title: 'Take · wait · share', body: 'Async by design. Decorate together when both sides are in.' },
]

export default function HowItWorks({ go }: ScreenProps) {
  return (
    <Screen>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 20px 0' }}>
        <Tap onClick={() => go('home')} style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 700, color: colors.inkMid }}>Skip</Tap>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <Eyebrow color={colors.hibiscus} size={11} style={{ marginBottom: 10 }}>How it works</Eyebrow>
        <Title size={28}>One strip, two phones, any time zone.</Title>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: '30px 24px 0' }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 300, damping: 26 }}
            style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 999, background: s.bg, border: `2.5px solid ${colors.ink}`, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 15, fontWeight: 700, color: s.fg,
            }}>
              {s.n}
            </div>
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, lineHeight: '20px', color: colors.ink }}>{s.title}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: '145%', color: colors.inkMid, marginTop: 3 }}>{s.body}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0 }}>
        <Dots count={3} active={1} />
      </div>
      <Footer>
        <Button onClick={() => go('home')}>Continue</Button>
      </Footer>
    </Screen>
  )
}
