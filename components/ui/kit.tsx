'use client'
import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import Icon, { IconName } from './Icon'
import { Filter } from '@/lib/types'
import { FILTER_CSS } from './Strip'

// ─── Tap: unstyled pressable with a squish ─────────────────────────────
export function Tap({ style, children, ...rest }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      style={{
        background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer',
        font: 'inherit', color: 'inherit', textAlign: 'inherit', WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

// ─── Status bar ────────────────────────────────────────────────────────
export function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? '#FFFFFF' : colors.ink
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '21px 30px 19px 36px', flexShrink: 0 }}>
      <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 17, fontWeight: 600, lineHeight: '22px', color: c }}>9:41</span>
      <svg width="78" height="13" viewBox="0 0 78 13" aria-hidden>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5.2} y={9 - i * 2.5} width="3.4" height={3.5 + i * 2.5} rx="1" fill={c} />)}
        <path d="M33.5 3.2a9.4 9.4 0 0 1 12.6 0l-1.3 1.3a7.6 7.6 0 0 0-10 0zM36 5.9a5.6 5.6 0 0 1 7.6 0l-1.3 1.3a3.8 3.8 0 0 0-5 0zM38.4 8.5a2 2 0 0 1 2.8 0l-1.4 1.6z" fill={c} />
        <rect x="52.5" y="1" width="22" height="11" rx="3.2" fill="none" stroke={c} strokeOpacity=".35" />
        <rect x="54.5" y="3" width="18" height="7" rx="1.8" fill={c} />
        <path d="M76 4.6v3.8a2 2 0 0 0 0-3.8z" fill={c} fillOpacity=".4" />
      </svg>
    </div>
  )
}

// ─── Text helpers ──────────────────────────────────────────────────────
export function Eyebrow({ children, color = colors.inkMute, size = 10, style }: { children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: fonts.body, fontSize: size, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.25, textTransform: 'uppercase', color, ...style }}>
      {children}
    </div>
  )
}

export function Title({ children, size = 24, style }: { children: React.ReactNode; size?: number; style?: React.CSSProperties }) {
  return (
    <h1 style={{ margin: 0, fontFamily: fonts.display, fontSize: size, fontWeight: 700, lineHeight: '115%', color: colors.ink, ...style }}>
      {children}
    </h1>
  )
}

// ─── Buttons ───────────────────────────────────────────────────────────
type Variant = 'ink' | 'hibiscus' | 'outline' | 'disabled'

export function Button({
  children, variant = 'ink', shadow = true, height = 54, grow = 1, onClick, style,
}: {
  children: React.ReactNode; variant?: Variant; shadow?: boolean; height?: number; grow?: number
  onClick?: () => void; style?: React.CSSProperties
}) {
  const v = {
    ink:      { bg: colors.ink,      fg: colors.cream, border: colors.ink },
    hibiscus: { bg: colors.hibiscus, fg: colors.cream, border: colors.ink },
    outline:  { bg: 'transparent',   fg: colors.ink,   border: colors.ink },
    disabled: { bg: '#EFEFEF',       fg: '#B0B0B0',    border: '#D0D0D0' },
  }[variant]
  const hasShadow = shadow && variant !== 'outline' && variant !== 'disabled'
  return (
    <Tap
      onClick={variant === 'disabled' ? undefined : onClick}
      style={{
        flexGrow: grow, flexBasis: 0, height, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: v.bg, color: v.fg, border: `2.5px solid ${v.border}`,
        boxShadow: hasShadow ? `4px 4px 0 ${colors.ink}` : 'none',
        fontFamily: fonts.display, fontSize: variant === 'outline' ? 14 : 16,
        fontWeight: variant === 'outline' ? 600 : 700, textAlign: 'center',
        ...style,
      }}
    >
      {children}
    </Tap>
  )
}

export function Footer({ children, gap = 10 }: { children: React.ReactNode; gap?: number }) {
  return (
    <div style={{ position: 'absolute', left: 22, right: 22, bottom: 32, display: 'flex', gap, zIndex: 5 }}>
      {children}
    </div>
  )
}

export function RoundButton({ icon, onClick, size = 34, label }: { icon: IconName; onClick?: () => void; size?: number; label: string }) {
  return (
    <Tap
      aria-label={label}
      onClick={onClick}
      style={{ width: size, height: size, borderRadius: 999, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
    >
      <Icon name={icon} size={14} strokeWidth={2} color={colors.ink} />
    </Tap>
  )
}

// ─── Chips & badges ────────────────────────────────────────────────────
export function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <Tap
      onClick={onClick}
      style={{
        padding: active ? '9px 16px' : '7px 14px', borderRadius: 99,
        border: active ? 'none' : `2px solid ${colors.ink}`,
        background: active ? colors.ink : 'transparent',
        color: active ? colors.cream : colors.ink,
        fontFamily: fonts.body, fontSize: 11, fontWeight: 700, lineHeight: '14px',
      }}
    >
      {children}
    </Tap>
  )
}

export function LiveBadge({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, border: `2px solid ${colors.ink}`, background: colors.cream }}>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: 999, background: colors.hibiscus }}
      />
      <span style={{ fontFamily: fonts.body, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em', color: colors.ink }}>
        {name.toUpperCase()} · LIVE
      </span>
    </div>
  )
}

export function Avatar({ letter, color, size = 38, textColor }: { letter: string; color: string; size?: number; textColor?: string }) {
  const fg = textColor ?? (color === colors.citrus ? colors.ink : colors.cream)
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: color, border: `2px solid ${colors.ink}`, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: fonts.display, fontSize: size * 0.4, fontWeight: 700, color: fg,
    }}>
      {letter}
    </div>
  )
}

// ─── Pager dots ────────────────────────────────────────────────────────
export function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          animate={{ width: i === active ? 22 : 6, background: i === active ? colors.ink : colors.dot }}
          style={{ height: 6, borderRadius: 999, display: 'inline-block' }}
        />
      ))}
    </div>
  )
}

// ─── Strips ────────────────────────────────────────────────────────────
export function MiniStrip({
  frames, photos = [], filter = 'none', width = 64, frameHeight = 38, rotate = 0, caption, shadow = 4, style,
}: {
  frames: string[]; photos?: string[]; filter?: Filter; width?: number | string; frameHeight?: number; rotate?: number; caption?: string; shadow?: number; style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: colors.card, border: `2.5px solid ${colors.ink}`, borderRadius: 10,
      boxShadow: `${shadow}px ${shadow}px 0 ${colors.ink}`, padding: caption ? 8 : '8px 8px 12px',
      transform: `rotate(${rotate}deg)`, ...style,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width }}>
        {frames.map((c, i) => (
          <div key={i} style={{ background: c, borderRadius: 4, height: frameHeight, overflow: 'hidden' }}>
            {photos[i] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: FILTER_CSS[filter] }} />
            )}
          </div>
        ))}
      </div>
      {caption && (
        <div style={{ marginTop: 6, fontFamily: fonts.body, fontSize: 9, fontWeight: 700, lineHeight: '12px', color: colors.ink }}>
          {caption}
        </div>
      )}
    </div>
  )
}

// ─── Screen frame ──────────────────────────────────────────────────────
export function Screen({ children, bg = colors.paper, dark = false, statusBar = true }: { children: React.ReactNode; bg?: string; dark?: boolean; statusBar?: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {statusBar && <StatusBar dark={dark} />}
      {children}
    </div>
  )
}

export function Header({ left, center, right }: { left?: React.ReactNode; center?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '4px 20px 0', minHeight: 34 }}>
      <div style={{ justifySelf: 'start' }}>{left}</div>
      <div>{center}</div>
      <div style={{ justifySelf: 'end' }}>{right}</div>
    </div>
  )
}
