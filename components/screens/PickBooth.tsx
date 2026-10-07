'use client'
import React from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Button, Footer, Screen, Tap, Title } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

const BOOTHS = [
  { id: 'confetti', kicker: 'BALANCED · BOLD', name: 'Confetti Booth', desc: 'Sticker-shop trio. Loud, tilted, fun.',
    swatch: [colors.hibiscus, colors.cobalt, colors.citrus], bg: colors.hibiscusTint, fg: colors.ink, sub: colors.inkMid, accent: colors.hibiscus, locked: false },
  { id: 'analog', kicker: 'MOODY · MINIMAL', name: 'Analog Signal', desc: 'Graphite, two signal colors only.',
    swatch: ['#E8A23A', '#57B96B', '#24282B'], bg: colors.night, fg: '#fff', sub: '#FFFFFF8C', accent: '#E8A23A', locked: true },
  { id: 'marquee', kicker: 'RETRO · ARCADE', name: 'Marquee Booth', desc: 'Oxblood curtain, amber bulb glow.',
    swatch: ['#F2B33D', '#7A2E20', '#F5E6C8'], bg: '#3B1712', fg: '#F5E6C8', sub: '#F5E6C899', accent: '#F2B33D', locked: true },
]

function BoothCard({ b, onLocked }: { b: typeof BOOTHS[number]; onLocked: () => void }) {
  const controls = useAnimationControls()
  const tap = () => {
    if (!b.locked) return
    controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.35 } })
    onLocked()
  }
  return (
    <motion.div animate={controls}>
      <Tap
        onClick={tap}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: 14, width: '100%', position: 'relative', borderRadius: 16, background: b.bg, textAlign: 'left',
          border: b.locked ? `2px solid ${colors.ink}` : `3px solid ${colors.hibiscus}`, boxShadow: b.locked ? 'none' : `4px 4px 0 ${colors.ink}`,
        }}
      >
        <div style={{ display: 'flex', gap: 3 }}>
          {b.swatch.map((c) => <div key={c} style={{ width: 16, height: 44, borderRadius: 3, background: c }} />)}
        </div>
        <div>
          <div style={{ fontFamily: fonts.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', color: b.accent }}>{b.kicker}</div>
          <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 700, lineHeight: '22px', color: b.fg }}>{b.name}</div>
          <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: b.sub }}>{b.desc}</div>
        </div>
        {b.locked ? (
          <span style={{ position: 'absolute', right: 10, top: 10, background: '#000000B0', color: '#F2B33D', borderRadius: 99, padding: '3px 8px', fontFamily: fonts.body, fontSize: 8, fontWeight: 700 }}>
            🔒 SOON
          </span>
        ) : (
          <span style={{ position: 'absolute', right: 12, top: 12, width: 22, height: 22, borderRadius: 999, background: colors.hibiscus, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={12} color="#fff" strokeWidth={2.4} />
          </span>
        )}
      </Tap>
    </motion.div>
  )
}

export default function PickBooth({ booth, go, toast }: ScreenProps) {
  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 20px 0' }}>
        <Tap aria-label="Back" onClick={() => go(booth.solo ? 'newBooth' : 'invite', -1)}><Icon name="back" size={16} color={colors.ink} /></Tap>
        <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: colors.inkMute }}>CONFETTI</span>
      </div>
      <div style={{ padding: '16px 24px 0' }}>
        <Title size={28} style={{ lineHeight: '110%' }}>Pick your booth.</Title>
        <div style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: '150%', color: colors.inkMid, marginTop: 8 }}>
          The booth you choose sets the whole look — colors, stickers, the works.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '22px 22px 0' }}>
        {BOOTHS.map((b) => <BoothCard key={b.id} b={b} onLocked={() => toast(`${b.name} is coming soon ✦`)} />)}
      </div>
      <Footer>
        <Button variant="hibiscus" onClick={() => go('capture')}>Use Confetti Booth</Button>
      </Footer>
    </Screen>
  )
}
