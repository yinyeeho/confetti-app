'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Avatar, Eyebrow, Footer, Header, RoundButton, Screen, Tap, Title } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

function Progress({ name, letter, color, done, total, sub }: { name: string; letter: string; color: string; done: number; total: number; sub?: string }) {
  const complete = done >= total
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `2px solid ${colors.ink}`, borderRadius: 14 }}>
      <Avatar letter={letter} color={color} size={34} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 13.5, fontWeight: 600, color: colors.ink }}>{name}{sub && ` · ${sub}`}</div>
        <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
          {Array.from({ length: total }).map((_, i) => (
            <motion.div key={i} animate={{ backgroundColor: i < done ? colors.done : colors.tint }} transition={{ delay: i * 0.08 }} style={{ flex: 1, height: 4, borderRadius: 99 }} />
          ))}
        </div>
      </div>
      <span style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 700, color: complete ? colors.done : colors.inkMute }}>
        {done}/{total}{complete && ' · DONE'}
      </span>
    </div>
  )
}

export default function Waiting({ booth, update, go, toast }: ScreenProps) {
  const friend = booth.friend
  const [theirShots, setTheirShots] = useState(0)
  const [nudged, setNudged] = useState(false)
  const [editing, setEditing] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const theyreDone = theirShots >= booth.shots

  const nudge = () => {
    if (nudged) return
    setNudged(true)
    toast(`Nudged ${friend} 👋`)
    // Simulate the friend picking up their phone and shooting their half
    for (let i = 1; i <= booth.shots; i++) timers.current.push(setTimeout(() => setTheirShots(i), 1400 + i * 700))
  }

  const next = () => {
    if (theyreDone) return go('layoutPick')
    nudge()
  }

  return (
    <Screen>
      <Header
        left={<Tap aria-label="Back" onClick={() => go('home', -1)}><Icon name="back" size={16} color={colors.ink} /></Tap>}
        right={<RoundButton icon="more" label="More" onClick={() => toast('Strip settings coming soon')} />}
      />
      <div style={{ padding: '16px 24px 0' }}>
        <Eyebrow color={colors.hibiscus} size={11}>
          {theyreDone ? `· ${friend} is in ·` : `· waiting on ${friend} ·`}
        </Eyebrow>
        <AnimatePresence mode="wait">
          <motion.div key={String(theyreDone)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Title style={{ lineHeight: '120%', marginTop: 8 }}>
              {theyreDone ? 'Both halves are in. Time to decorate!' : `Your half's in. She's still in class.`}
            </Title>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 24px 0' }}>
        <Progress name="You" letter="J" color={colors.citrus} done={booth.shots} total={booth.shots} />
        <Progress name={friend} letter={friend[0]} color={colors.hibiscus} sub="NYC · +5h ahead" done={theirShots} total={booth.shots} />
      </div>

      {/* Developing strip */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 24px 0' }}>
        <div style={{ width: 130, padding: '12px 12px 14px', background: colors.night, borderRadius: 14 }}>
          <motion.div
            animate={theyreDone ? { background: `linear-gradient(180deg, ${colors.citrus} 0 24%, ${colors.cobaltDeep} 25% 49%, ${colors.hibiscus} 50% 74%, ${colors.citrus} 75%)` } : { opacity: [0.75, 1, 0.75] }}
            transition={theyreDone ? { duration: 0.6 } : { duration: 2, repeat: Infinity }}
            style={{ height: 180, borderRadius: 8, background: 'linear-gradient(180deg, #2F3134, #1E2023)' }}
          />
          <div style={{ marginTop: 12, textAlign: 'center', fontFamily: fonts.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: theyreDone ? colors.citrus : colors.amber }}>
            {theyreDone ? '···· READY ····' : '···· DEVELOPING ····'}
          </div>
        </div>
      </div>

      {/* Caption */}
      <AnimatePresence>
        {(editing || booth.caption) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '14px 24px 0', textAlign: 'center' }}>
            <input
              autoFocus={editing}
              value={booth.caption ?? ''}
              placeholder="booth week 🎉"
              onChange={(e) => update({ caption: e.target.value })}
              onBlur={() => setEditing(false)}
              style={{ width: '100%', textAlign: 'center', border: 'none', borderBottom: `2px dashed ${colors.line}`, background: 'transparent', outline: 'none', fontFamily: fonts.script, fontSize: 24, color: colors.hibiscus, padding: '4px 0' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer gap={8}>
        <ActionButton onClick={nudge}>{nudged ? (theyreDone ? `${friend} is in ✓` : 'Nudged ✓') : `Nudge ${friend}`}</ActionButton>
        <ActionButton onClick={() => setEditing(true)}>{booth.caption ? 'Edit caption' : 'Add caption'}</ActionButton>
        <Tap
          aria-label="Continue"
          onClick={next}
          animate={theyreDone ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: theyreDone ? Infinity : 0, duration: 1.2 }}
          style={{ width: 50, height: 50, borderRadius: 14, background: theyreDone ? colors.hibiscus : colors.ink, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <Icon name="arrow" size={18} color={colors.cream} strokeWidth={2} />
        </Tap>
      </Footer>
    </Screen>
  )
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Tap
      onClick={onClick}
      style={{ flex: 1, height: 50, borderRadius: 14, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 12.5, fontWeight: 600, color: colors.ink, textAlign: 'center' }}
    >
      {children}
    </Tap>
  )
}
