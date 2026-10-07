'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

// The friend's lock screen: the invite lands as a push notification.
export default function Notification({ booth, go }: ScreenProps) {
  const now = new Date()
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase().replace(',', ' ·')
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ position: 'absolute', inset: 0, background: colors.night, overflow: 'hidden' }}>
      <div style={{ paddingTop: 70, textAlign: 'center' }}>
        <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#FFFFFF99' }}>{date}</div>
        <div style={{ fontFamily: fonts.display, fontSize: 66, fontWeight: 700, lineHeight: '80px', color: '#fff', marginTop: 6 }}>{time}</div>
      </div>

      <motion.div
        initial={{ y: -30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 380, damping: 26 }}
      >
        <Tap
          onClick={() => go('pickBooth')}
          style={{ display: 'flex', gap: 12, margin: '60px 24px 0', width: 'calc(100% - 48px)', padding: '14px 16px', borderRadius: 20, background: '#232323', textAlign: 'left' }}
        >
          <AppIcon />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: fonts.body, fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Confetti</span>
              <span style={{ fontFamily: fonts.body, fontSize: 9.5, color: '#FFFFFF66' }}>now</span>
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 600, lineHeight: '130%', color: '#fff', marginTop: 4 }}>
              June started a strip with you.
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 11.5, color: '#FFFFFF8C', marginTop: 3 }}>
              &ldquo;miss u — {booth.shots} quick photos?&rdquo;
            </div>
          </div>
        </Tap>
      </motion.div>

      <motion.div
        animate={{ opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 1.2 }}
        style={{ textAlign: 'center', marginTop: 18, fontFamily: fonts.body, fontSize: 11, color: '#FFFFFF', letterSpacing: '0.02em' }}
      >
        you&apos;re on {booth.friend.toLowerCase()}&apos;s phone now · tap to open
      </motion.div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
        {(['bolt', 'camera'] as const).map((n) => (
          <div key={n} style={{ width: 44, height: 44, borderRadius: 999, background: '#FFFFFF24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={n} size={18} color="#fff" strokeWidth={1.6} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Mini app icon (from the App Icon board): two tilted strip cards on cobalt + heart badge
export function AppIcon({ size = 38 }: { size?: number }) {
  const k = size / 220
  return (
    <div style={{ width: size, height: size, borderRadius: 50 * k, background: colors.cobalt, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: 34 * k, top: 38 * k, width: 96 * k, height: 124 * k, background: colors.citrus, border: `${4 * k}px solid ${colors.ink}`, borderRadius: 16 * k, rotate: '-10deg', transformOrigin: '0 0' }} />
      <div style={{ position: 'absolute', left: 88 * k, top: 56 * k, width: 96 * k, height: 124 * k, background: colors.hibiscus, border: `${4 * k}px solid ${colors.ink}`, borderRadius: 16 * k, boxShadow: `${5 * k}px ${5 * k}px 0 ${colors.ink}`, rotate: '7deg', transformOrigin: '0 0' }} />
      <div style={{ position: 'absolute', left: 96 * k, top: 100 * k, width: 40 * k, height: 40 * k, background: '#fff', border: `${3.5 * k}px solid ${colors.ink}`, borderRadius: 999, rotate: '-6deg', transformOrigin: '0 0' }} />
    </div>
  )
}
