'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Button, Dots, Footer, Screen, Tap, Title } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

const { citrus: Y, cobalt: B, hibiscus: P } = colors

// Each suggestion arranges the two halves differently (you = citrus/cobalt, them = hibiscus)
const SETS = [
  [
    { name: 'alternate', frames: [Y, B, P], why: 'Takes turns — you, them, you. Reads like a conversation.' },
    { name: 'duo grid',  frames: [P, Y, B], why: 'Your faces land side by side, like you were in the same booth.' },
    { name: 'grouped',   frames: [B, B, P], why: 'Your half up top, theirs below — a clean before/after.' },
  ],
  [
    { name: 'bookends',  frames: [P, Y, P], why: 'They open and close the strip; you’re the middle of the story.' },
    { name: 'mirror',    frames: [Y, P, Y], why: 'Matching shots echo across the strip, like a reflection.' },
    { name: 'timeline',  frames: [B, Y, P], why: 'Ordered by when each photo was taken, across both time zones.' },
  ],
]

export default function LayoutPick({ go, toast }: ScreenProps) {
  const [set, setSet] = useState(0)
  const [pick, setPick] = useState(1)
  const [why, setWhy] = useState(false)
  const options = SETS[set]

  const reroll = () => {
    setSet((s) => (s + 1) % SETS.length)
    setPick(1)
    setWhy(false)
  }

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <Tap aria-label="Back" onClick={() => go('waiting', -1)} style={{ width: 34, height: 34, borderRadius: 999, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" size={14} strokeWidth={2} color={colors.ink} />
        </Tap>
        <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, color: colors.inkMid }}>3 of 5</span>
        <Tap onClick={reroll} style={{ fontFamily: fonts.display, fontSize: 13, fontWeight: 700, color: colors.cobalt }}>Reroll</Tap>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: colors.hibiscus, marginBottom: 8 }}>✦ LAYOUT SUGGESTIONS</div>
        <Title>Three ways it could read</Title>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 22, minHeight: 54 }}>
        <Tap
          onClick={() => setWhy((w) => !w)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 99, border: `1.5px dashed ${colors.line}`, height: 32 }}
        >
          <span style={{ width: 15, height: 15, borderRadius: 999, border: `1.5px solid ${colors.inkMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.body, fontSize: 9, fontWeight: 700, color: colors.inkMid }}>?</span>
          <span style={{ fontFamily: fonts.body, fontSize: 10.5, fontWeight: 700, color: colors.inkMid }}>why this one</span>
        </Tap>
      </div>
      <AnimatePresence>
        {why && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ margin: '0 40px', textAlign: 'center', fontFamily: fonts.body, fontSize: 11.5, lineHeight: '150%', color: colors.inkSoft, overflow: 'hidden' }}
          >
            {options[pick].why}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={set}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 18, padding: '30px 12px 0' }}
        >
          {options.map((o, i) => {
            const on = i === pick
            return (
              <Tap key={o.name} onClick={() => setPick(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <motion.div
                  animate={{ y: on ? -10 : 0, rotate: on ? 0 : i === 0 ? -3 : 3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  style={{
                    position: 'relative', padding: 7, borderRadius: 9, background: colors.cream,
                    border: on ? `3px solid ${colors.hibiscus}` : `2px solid ${colors.ink}`, boxShadow: on ? `4px 4px 0 ${colors.ink}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 56 }}>
                    {o.frames.map((c, k) => <div key={k} style={{ height: 32, borderRadius: 3, background: c }} />)}
                  </div>
                  {on && (
                    <motion.div
                      layoutId="ai-pick"
                      style={{ position: 'absolute', top: -11, left: '50%', x: '-50%', background: colors.ink, color: colors.citrus, borderRadius: 99, padding: '2px 8px', fontFamily: fonts.body, fontSize: 8, fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                      ✦ AI PICK
                    </motion.div>
                  )}
                </motion.div>
                <span style={{ fontFamily: fonts.body, fontSize: 9, fontWeight: on ? 700 : 400, color: on ? colors.ink : colors.inkMute }}>{o.name}</span>
              </Tap>
            )
          })}
        </motion.div>
      </AnimatePresence>

      <div style={{ paddingTop: 20 }}><Dots count={5} active={2} /></div>

      <Footer>
        <Button variant="outline" height={52} onClick={() => { toast('Customize opens in Decorate'); go('decorate') }}>Customize</Button>
        <Button variant="hibiscus" height={52} grow={1.4} onClick={() => go('decorate')} style={{ fontSize: 15 }}>Use this layout</Button>
      </Footer>
    </Screen>
  )
}
