'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Button, MiniStrip, Screen, Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

const { citrus: Y, cobalt: B, hibiscus: P } = colors

const pop = (delay: number, rotate: number) => ({
  initial: { y: 60, opacity: 0, rotate: 0 },
  animate: { y: 0, opacity: 1, rotate },
  transition: { type: 'spring' as const, stiffness: 260, damping: 18, delay },
})

export default function Splash({ go }: ScreenProps) {
  return (
    <Screen>
      {/* Hero collage — three tilted strips + heart badge */}
      <div style={{ position: 'relative', height: 340, marginTop: 20 }}>
        <motion.div {...pop(0.05, -8)} style={{ position: 'absolute', left: 40, top: 59 }}>
          <MiniStrip frames={[Y, B, P]} width={64} />
        </motion.div>
        <motion.div {...pop(0.15, 12.5)} style={{ position: 'absolute', right: 48, top: 50 }}>
          <MiniStrip frames={[P, Y, B]} width={60} frameHeight={36} />
        </motion.div>
        <motion.div {...pop(0.25, 0)} style={{ position: 'absolute', left: 'calc(50% - 54px)', top: 27 }}>
          <MiniStrip frames={[B, P, Y, B]} width={72} frameHeight={42} />
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.55 }}
          style={{
            position: 'absolute', left: 'calc(50% + 12px)', top: 155, width: 36, height: 36, borderRadius: 999,
            background: P, border: `2.5px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="heart" size={16} color="#fff" strokeWidth={2} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ padding: '0 28px', textAlign: 'center' }}
      >
        <div style={{ fontFamily: fonts.display, fontSize: 34, fontWeight: 700, lineHeight: '105%', color: colors.ink }}>Confetti</div>
        <div style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: '150%', color: colors.inkSoft, marginTop: 10 }}>
          A photo booth for your loved ones far apart
        </div>
      </motion.div>

      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Button style={{ width: '100%', flexBasis: 'auto' }} onClick={() => go('howItWorks')}>Get Started</Button>
        <Tap
          onClick={() => go('notification')}
          style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 700, color: colors.inkSoft, textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          I have an invite link
        </Tap>
      </div>
    </Screen>
  )
}
