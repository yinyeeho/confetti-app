'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Border, Filter, StickerKind } from '@/lib/types'
import Icon from './Icon'

// Each shot is one of the accent trio; filters remap the trio (values from the Decorate › Filter panel).
const FILTERS: Record<Filter, [string, string, string]> = {
  none:  [colors.citrus, colors.cobaltDeep, colors.hibiscus],
  bw:    ['#B8B8B8', '#6E6E6E', '#9C9C9C'],
  warm:  ['#E8A23C', '#5A5FC7', '#E8617F'],
  faded: ['#F0D48A', '#A8AEE0', '#F0A8BC'],
  bold:  ['#FFB300', '#1830C4', '#FF1F5C'],
}
export const FILTER_LIST: { id: Filter; label: string }[] = [
  { id: 'none', label: 'NONE' }, { id: 'bw', label: 'B&W' }, { id: 'warm', label: 'WARM' },
  { id: 'faded', label: 'FADED' }, { id: 'bold', label: 'BOLD' },
]

// Shot order on the default strip: citrus, cobalt, hibiscus, citrus
const PATTERN = [0, 1, 2, 0, 1, 2]
export const shotColor = (i: number, filter: Filter = 'none') => FILTERS[filter][PATTERN[i % PATTERN.length]]
export const filterSwatch = (f: Filter) => FILTERS[f]

// The same filters as CSS, for real photos
export const FILTER_CSS: Record<Filter, string> = {
  none:  'none',
  bw:    'grayscale(1) contrast(1.1)',
  warm:  'sepia(0.35) saturate(1.35) hue-rotate(-8deg)',
  faded: 'contrast(0.8) brightness(1.12) saturate(0.6)',
  bold:  'saturate(1.8) contrast(1.15)',
}

// One frame of a strip: the photo if there is one, otherwise its accent color
export function Frame({ index, photo, filter = 'none', filled = true, style }: {
  index: number; photo?: string; filter?: Filter; filled?: boolean; style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: filled ? shotColor(index, filter) : colors.tint }}
      transition={{ duration: 0.35 }}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {photo && filled && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={`Shot ${index + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: FILTER_CSS[filter], transition: 'filter .3s ease' }} />
      )}
    </motion.div>
  )
}

export function borderStyle(border: Border): React.CSSProperties {
  switch (border) {
    case 'polaroid': return { borderRadius: 4, border: `3px solid ${colors.ink}`, paddingBottom: 34 }
    case 'dashed':   return { borderRadius: 14, border: `3px dashed ${colors.ink}` }
    case 'checker':  return {
      borderRadius: 14, border: `3px solid ${colors.ink}`,
      backgroundImage: `repeating-conic-gradient(${colors.ink} 0 25%, ${colors.cream} 0 50%)`, backgroundSize: '14px 14px',
    }
    default:         return { borderRadius: 14, border: `3px solid ${colors.ink}` }
  }
}

export const STICKER_STYLE: Record<StickerKind, { bg: string; fg: string; icon: 'heartFill' | 'star' | 'sparkle' | 'bolt'; round?: boolean }> = {
  heart:   { bg: colors.hibiscus,   fg: colors.cream,  icon: 'heartFill', round: true },
  star:    { bg: colors.citrus,     fg: colors.ink,    icon: 'star' },
  sparkle: { bg: colors.cobaltDeep, fg: colors.cream,  icon: 'sparkle' },
  bolt:    { bg: colors.ink,        fg: colors.citrus, icon: 'bolt' },
}

export function Sticker({ kind, size = 40 }: { kind: StickerKind; size?: number }) {
  const s = STICKER_STYLE[kind]
  return (
    <div style={{
      width: size, height: size, borderRadius: s.round ? 999 : 10, background: s.bg, border: `2.5px solid ${colors.ink}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={s.icon} size={size * 0.5} color={s.fg} />
    </div>
  )
}

interface StripProps {
  shots?: number
  photos?: string[]
  filled?: number          // how many shots are developed; the rest show as empty slots
  width?: number
  frameHeight?: number
  filter?: Filter
  border?: Border
  shadow?: number
  rotate?: number
  gap?: number
  pad?: number
  radius?: number
  children?: React.ReactNode // overlays (stickers, captions)
}

export default function Strip({
  shots = 4, photos = [], filled = shots, width = 180, frameHeight = 88, filter = 'none', border = 'classic',
  shadow = 6, rotate = 0, gap = 6, pad = 10, radius = 8, children,
}: StripProps) {
  return (
    <div style={{ position: 'relative', transform: `rotate(${rotate}deg)` }}>
      <div style={{
        background: colors.cream, boxShadow: shadow ? `${shadow}px ${shadow}px 0 ${colors.ink}` : 'none',
        display: 'flex', flexDirection: 'column', gap, padding: `${pad}px ${pad}px ${pad + 4}px`, width,
        transition: 'all .25s ease',
        ...borderStyle(border),
      }}>
        {Array.from({ length: shots }).map((_, i) => (
          <Frame key={i} index={i} photo={photos[i]} filter={filter} filled={i < filled} style={{ height: frameHeight, borderRadius: radius }} />
        ))}
        {border === 'polaroid' && (
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.script, fontSize: 18, color: colors.ink }}>
            us, apart
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
