'use client'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Keepsake } from '@/lib/types'
import { Button, Footer, RoundButton, Screen, Tap, Title } from '../ui/kit'
import type { ScreenProps } from '../AppShell'

const { citrus: Y, cobalt: B, hibiscus: P, ink } = colors

const OPTIONS: { id: Keepsake; title: string; body: (friend: string) => string; preview: React.ReactNode }[] = [
  {
    id: 'strip', title: 'Classic Strip',
    body: () => 'the original. four frames stacked, made for the fridge door and the phone case.',
    preview: <>{[Y, B, P].map((c, i) => <div key={i} style={{ flex: 1, borderRadius: 3, background: c }} />)}</>,
  },
  {
    id: 'passport', title: 'Passport Booth',
    body: (f) => `tracks the distance between you two — nyc ↔ seoul, 13hr apart, stamped with the date you and ${f.toLowerCase()} each shot your side.`,
    preview: <>
      <div style={{ height: 14, borderRadius: 2, background: ink, opacity: 0.85 }} />
      <div style={{ flex: 1, borderRadius: 3, background: B }} />
      <div style={{ height: 10, borderRadius: 2, background: ink, opacity: 0.4 }} />
    </>,
  },
  {
    id: 'contact', title: 'Contact Sheet',
    body: () => 'every shot from both phones on one sheet, outtakes included. the blurry ones are the best ones.',
    preview: <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, flex: 1 }}>{[Y, B, P, Y].map((c, i) => <div key={i} style={{ borderRadius: 3, background: c }} />)}</div>,
  },
]

export default function KeepsakePick({ booth, update, go }: ScreenProps) {
  const current = OPTIONS.find((o) => o.id === booth.keepsake)!
  return (
    <Screen>
      <div style={{ padding: '4px 20px 0' }}><RoundButton icon="back" label="Back" onClick={() => go('decorate', -1)} /></div>
      <div style={{ padding: '16px 24px 0' }}>
        <Title size={26} style={{ lineHeight: '110%' }}>Pick a keepsake</Title>
        <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.inkMid, marginTop: 6 }}>how should this strip get remembered?</div>
      </div>

      <div style={{ display: 'flex', gap: 12, padding: '24px 20px 0' }}>
        {OPTIONS.map((o) => {
          const on = o.id === booth.keepsake
          return (
            <Tap key={o.id} onClick={() => update({ keepsake: o.id })} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <motion.div
                animate={{ y: on ? -4 : 0 }}
                style={{
                  position: 'relative', width: '100%', height: 150, padding: 8, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: on ? 4 : 3,
                  background: on ? colors.hibiscusTint : colors.cream, border: on ? `3px solid ${P}` : `2px solid ${colors.line}`, boxShadow: on ? `3px 3px 0 ${ink}` : 'none',
                }}
              >
                {o.preview}
                {on && (
                  <motion.div
                    layoutId="keepsake-check"
                    style={{ position: 'absolute', right: 8, top: -11, width: 20, height: 20, borderRadius: 999, background: P, border: `2px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.cream, fontSize: 11 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
              <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: on ? 700 : 400, color: on ? ink : colors.inkMid }}>{o.id}</span>
            </Tap>
          )
        })}
      </div>

      <div style={{ margin: '22px 20px 0', padding: '14px 16px', borderRadius: 14, border: `2px dashed ${colors.line}`, background: colors.cream, minHeight: 92 }}>
        <AnimatePresence mode="wait">
          <motion.div key={current.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
            <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 600, color: ink }}>{current.title}</div>
            <div style={{ fontFamily: fonts.body, fontSize: 11.5, lineHeight: '150%', color: colors.inkMid, marginTop: 4 }}>{current.body(booth.friend)}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer>
        <Button variant="hibiscus" onClick={() => go('share')}>Continue</Button>
      </Footer>
    </Screen>
  )
}
