'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Avatar, Button, Eyebrow, Footer, Header, Screen, Tap, Title } from '../ui/kit'
import Icon, { IconName } from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

const CHANNELS: { label: string; color: string; icon: IconName; fg: string }[] = [
  { label: 'QR code', color: colors.citrus,   icon: 'qr',      fg: colors.ink },
  { label: 'Message', color: colors.cobalt,   icon: 'message', fg: '#fff' },
  { label: 'Email',   color: colors.hibiscus, icon: 'mail',    fg: '#fff' },
  { label: 'More',    color: colors.tint,     icon: 'more',    fg: colors.ink },
]

const MATES = [
  { name: 'Mia',     sub: 'last booth · 2d', color: colors.hibiscus },
  { name: 'Jun',     sub: 'seoul · +9hr',    color: colors.cobalt },
  { name: 'Christy', sub: 'Perth · -5hr',    color: colors.citrus },
]

export default function Invite({ booth, update, go, toast }: ScreenProps) {
  const [copied, setCopied] = useState(false)
  const link = `confetti.join/${booth.friend.toLowerCase().slice(0, 3)}-jun`

  const copy = async () => {
    try { await navigator.clipboard.writeText(`https://${link}`) } catch { /* clipboard unavailable — still show feedback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Screen>
      <Header
        left={<Tap aria-label="Back" onClick={() => go('newBooth', -1)}><Icon name="back" size={16} color={colors.ink} /></Tap>}
        center={<span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 700, color: colors.ink }}>Invite</span>}
        right={<span style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 700, color: colors.inkMute }}>STEP 2/3</span>}
      />
      <div style={{ padding: '18px 24px 0' }}><Title size={23} style={{ lineHeight: '120%' }}>Who&apos;s getting this strip-shaped love note?</Title></div>

      {/* One-time link */}
      <div style={{ margin: '20px 24px 0', padding: '14px 16px', border: `2px solid ${colors.ink}`, borderRadius: 14 }}>
        <Eyebrow color={colors.hibiscus} size={9} style={{ letterSpacing: '0.06em' }}>One-time link · expires in 24h</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.ink }}>{link}</span>
          <Tap onClick={copy} style={{ background: copied ? colors.done : colors.ink, color: colors.cream, borderRadius: 99, padding: '6px 12px', fontFamily: fonts.body, fontSize: 10, fontWeight: 700, transition: 'background .2s' }}>
            {copied ? 'Copied!' : 'Copy'}
          </Tap>
        </div>
      </div>

      {/* Share channels */}
      <div style={{ display: 'flex', gap: 10, padding: '18px 24px 0' }}>
        {CHANNELS.map((c) => (
          <Tap
            key={c.label}
            onClick={() => toast(`${c.label} ready to send ✦`)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 0', border: `2px solid ${colors.ink}`, borderRadius: 14 }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 999, background: c.color, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={c.icon} size={15} color={c.fg} />
            </div>
            <span style={{ fontFamily: fonts.body, fontSize: 9.5, color: colors.ink }}>{c.label}</span>
          </Tap>
        ))}
      </div>

      <div style={{ padding: '22px 24px 8px' }}><Eyebrow>Frequent boothmates</Eyebrow></div>
      <div style={{ borderBottom: `1.5px solid ${colors.tint}` }}>
        {MATES.map((m) => {
          const on = booth.friend === m.name
          return (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderTop: `1.5px solid ${colors.tint}` }}>
              <Avatar letter={m.name[0]} color={m.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.display, fontSize: 13.5, fontWeight: 600, color: colors.ink }}>{m.name}</div>
                <div style={{ fontFamily: fonts.body, fontSize: 10, color: colors.inkMute }}>{m.sub}</div>
              </div>
              <Tap
                onClick={() => update({ friend: m.name })}
                style={{
                  borderRadius: 99, padding: '6px 14px', border: `2px solid ${colors.ink}`,
                  background: on ? colors.hibiscus : 'transparent', color: on ? colors.cream : colors.ink,
                  fontFamily: fonts.body, fontSize: 10.5, fontWeight: 700, minWidth: 70,
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(on)} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} style={{ display: 'inline-block' }}>
                    {on ? 'Invited ✓' : 'Invite'}
                  </motion.span>
                </AnimatePresence>
              </Tap>
            </div>
          )
        })}
      </div>

      <Footer>
        <Button variant="outline" height={52} onClick={() => { update({ solo: true }); go('pickBooth') }} style={{ fontSize: 13 }}>Skip · Solo</Button>
        <Button height={52} grow={1.3} shadow={false} onClick={() => go('notification')} style={{ fontSize: 14 }}>Start booth</Button>
      </Footer>
    </Screen>
  )
}
