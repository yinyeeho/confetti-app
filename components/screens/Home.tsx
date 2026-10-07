'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Eyebrow, MiniStrip, Screen, Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import { shotColor } from '../ui/Strip'
import type { ScreenProps } from '../AppShell'

function useCountdown(start: number) {
  const [left, setLeft] = useState(start)
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : start)), 1000)
    return () => clearInterval(t)
  }, [start])
  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const today = () => new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase().replace(',', '')

export default function Home({ go, saved }: ScreenProps) {
  const time = useCountdown(11 * 3600 + 59 * 60 + 42)

  return (
    <Screen>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }} className="no-scrollbar">
        {/* Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 22px 0' }}>
          <div>
            <Eyebrow color={colors.cobalt} size={11} style={{ letterSpacing: '0.1em' }}>{today()}</Eyebrow>
            <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 700, lineHeight: '30px', color: colors.ink, marginTop: 2 }}>
              morning, june!
            </div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: colors.citrus, border: `2px solid ${colors.ink}` }} />
        </div>

        {/* Status widget — the strip that's still brewing */}
        <div style={{ padding: '20px 24px 0' }}>
          <Tap
            onClick={() => go('waiting')}
            whileTap={{ scale: 0.97, rotate: 0 }}
            style={{
              display: 'block', width: '100%', position: 'relative', background: colors.cobalt, border: `3px solid ${colors.ink}`,
              borderRadius: 18, boxShadow: `6px 6px 0 ${colors.ink}`, padding: '18px 20px', rotate: '-1.5deg', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ width: 10, height: 10, borderRadius: 999, background: colors.citrus, border: `1.5px solid ${colors.ink}` }}
              />
              <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: colors.citrus }}>BREWING · WITH MIA</span>
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 42, fontWeight: 700, lineHeight: '52px', color: '#fff', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
              {time}
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: '#DCE3FF', marginTop: 2 }}>2 of 4 shots · she&apos;s up next!</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
              {[1, 1, 0, 0].map((on, i) => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: on ? colors.citrus : '#FFFFFF40' }} />
              ))}
            </div>
            <div style={{
              position: 'absolute', right: -12, top: -16, width: 38, height: 38, borderRadius: 999, rotate: '10deg',
              background: colors.hibiscus, border: `2.5px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="heart" size={16} color="#fff" strokeWidth={2} />
            </div>
          </Tap>
        </div>

        {/* Ready row */}
        <Tap
          onClick={() => go('keepsake')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, margin: '16px 24px 0', padding: '12px 14px', width: 'calc(100% - 48px)',
            background: colors.card, border: `2.5px solid ${colors.ink}`, borderRadius: 14,
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 999, background: colors.citrus, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="star" size={14} color={colors.ink} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: fonts.body, fontSize: 12.5, fontWeight: 700, color: colors.ink }}>ready · with ana</div>
            <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.inkMid }}>4 of 4 · done brewing 2h ago</div>
          </div>
          <Icon name="arrow" size={16} color={colors.ink} />
        </Tap>

        {/* Archive */}
        <div style={{ padding: '24px 24px 12px' }}>
          <Eyebrow color={colors.inkMid} size={11}>Your strips · {saved.length}</Eyebrow>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 16, padding: '0 24px' }}>
          {saved.map((s, i) => (
            <motion.div key={s.id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <MiniStrip
                frames={[0, 1, 2].map((k) => shotColor(k + (i % 2), s.filter))}
                photos={s.photos}
                filter={s.filter}
                width="100%"
                frameHeight={30}
                shadow={3}
                rotate={i % 2 ? 1.5 : -2}
                caption={s.caption}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <TabBar onCamera={() => go('newBooth')} />
    </Screen>
  )
}

function TabBar({ onCamera }: { onCamera: () => void }) {
  const label = (on: boolean): React.CSSProperties => ({ fontFamily: fonts.body, fontSize: 8.5, fontWeight: 700, color: on ? colors.ink : colors.inkMid })
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 40px 26px', zIndex: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: `linear-gradient(180deg, ${colors.paper}00 0%, ${colors.paper} 40%)`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 44 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/home.svg" alt="" width={24} height={21} />
        <span style={label(true)}>HOME</span>
      </div>
      <Tap
        aria-label="Start a new booth"
        onClick={onCamera}
        whileTap={{ scale: 0.9, rotate: -6 }}
        style={{
          width: 58, height: 58, borderRadius: 999, background: colors.hibiscus, border: `3px solid ${colors.ink}`,
          boxShadow: `3px 3px 0 ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="camera" size={22} color="#fff" strokeWidth={2} />
      </Tap>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 44 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/profile.svg" alt="" width={22} height={23} style={{ opacity: 0.75 }} />
        <span style={label(false)}>ME</span>
      </div>
    </div>
  )
}
