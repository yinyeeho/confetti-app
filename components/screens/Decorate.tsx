'use client'
import React, { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Border, DecorateTab, StickerKind } from '@/lib/types'
import { Button, Footer, LiveBadge, Screen, Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import Strip, { FILTER_LIST, Sticker, STICKER_STYLE, filterSwatch } from '../ui/Strip'
import type { ScreenProps } from '../AppShell'

const TABS: DecorateTab[] = ['sticker', 'text', 'filter', 'border']
const STICKERS: StickerKind[] = ['heart', 'star', 'sparkle', 'bolt']
const BORDERS: { id: Border; label: string }[] = [
  { id: 'classic', label: 'CLASSIC' }, { id: 'polaroid', label: 'POLAROID' }, { id: 'dashed', label: 'DASHED' }, { id: 'checker', label: 'CHECKER' },
]

type TextStyle = 'tag' | 'caps' | 'script' | 'outline'
const TEXT_STYLES: { id: TextStyle; render: (t: string) => React.ReactNode }[] = [
  { id: 'tag',     render: (t) => <span style={{ background: colors.hibiscus, border: `2px solid ${colors.ink}`, borderRadius: 5, padding: '2px 7px', fontFamily: fonts.display, fontSize: 12, fontWeight: 600, color: colors.ink }}>{t}</span> },
  { id: 'caps',    render: (t) => <span style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 800, letterSpacing: '0.03em', color: colors.ink }}>{t.toUpperCase()}</span> },
  { id: 'script',  render: (t) => <span style={{ fontFamily: fonts.script, fontSize: 22, color: colors.hibiscus, lineHeight: 1 }}>{t}</span> },
  { id: 'outline', render: (t) => <span style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 700, color: colors.cream, WebkitTextStroke: `1px ${colors.ink}`, textShadow: `1px 1px 0 ${colors.ink}` }}>{t}</span> },
]

interface Placed { id: number; kind: 'sticker' | 'text'; sticker?: StickerKind; text?: TextStyle; x: number; y: number; rotate: number }

// Starting decorations, as in the Paper frame: heart top-left, star top-right, "yesss!" label bottom-left
const INITIAL: Placed[] = [
  { id: 1, kind: 'sticker', sticker: 'heart', x: -18, y: -14, rotate: -10 },
  { id: 2, kind: 'sticker', sticker: 'star', x: 162, y: 20, rotate: 12 },
  { id: 3, kind: 'text', text: 'tag', x: -24, y: 330, rotate: -8 },
]

export default function Decorate({ booth, update, go }: ScreenProps) {
  const [tab, setTab] = useState<DecorateTab>('sticker')
  const [placed, setPlaced] = useState<Placed[]>(INITIAL)
  const canvas = useRef<HTMLDivElement>(null)
  const nextId = useRef(10)

  const add = (p: Omit<Placed, 'id' | 'x' | 'y' | 'rotate'>) => {
    setPlaced((list) => [...list, {
      ...p, id: nextId.current++,
      x: 20 + Math.random() * 120, y: 40 + Math.random() * 260, rotate: Math.round(Math.random() * 30 - 15),
    }])
    if (p.sticker) update({ stickers: [...booth.stickers, p.sticker] })
  }

  const frameH = booth.shots === 2 ? 150 : booth.shots === 3 ? 112 : 82

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <Tap aria-label="Back" onClick={() => go('layoutPick', -1)} style={{ width: 34, height: 34, borderRadius: 999, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" size={14} strokeWidth={2} color={colors.ink} />
        </Tap>
        <span style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: 700, color: colors.ink }}>Decorate</span>
        {booth.solo ? <span style={{ width: 34 }} /> : <LiveBadge name={booth.friend} />}
      </div>

      {/* Canvas */}
      <div ref={canvas} style={{ display: 'flex', justifyContent: 'center', padding: '20px 24px 0', position: 'relative' }}>
        <div style={{ position: 'relative', rotate: '-2deg' }}>
          <Strip shots={booth.shots} photos={booth.photos} frameHeight={frameH} filter={booth.filter} border={booth.border} />
          <AnimatePresence>
            {placed.map((p) => (
              <motion.div
                key={p.id}
                drag
                dragConstraints={canvas}
                dragMomentum={false}
                whileDrag={{ scale: 1.15, zIndex: 20 }}
                initial={{ scale: 0, rotate: p.rotate - 30 }}
                animate={{ scale: 1, rotate: p.rotate }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                onDoubleClick={() => setPlaced((l) => l.filter((x) => x.id !== p.id))}
                style={{ position: 'absolute', left: p.x, top: p.y, cursor: 'grab', touchAction: 'none', zIndex: 10 }}
              >
                {p.kind === 'sticker' ? (
                  <Sticker kind={p.sticker!} size={p.sticker === 'heart' ? 40 : 36} />
                ) : p.text === 'tag' && p.id === 3 ? (
                  <span style={{ display: 'inline-block', background: colors.cobaltDeep, border: `2px solid ${colors.ink}`, borderRadius: 8, padding: '4px 10px', fontFamily: fonts.display, fontSize: 11, color: colors.cream }}>yesss!</span>
                ) : (
                  TEXT_STYLES.find((t) => t.id === p.text)!.render(booth.caption?.trim() || 'hi!')
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Tool panel */}
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 100, background: colors.cream, border: `2.5px solid ${colors.ink}`, borderRadius: 16, boxShadow: `4px 4px 0 ${colors.ink}`, overflow: 'hidden', zIndex: 6 }}>
        <div style={{ display: 'flex', borderBottom: `2px solid ${colors.ink}` }}>
          {TABS.map((t) => (
            <Tap key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px 0', position: 'relative', textAlign: 'center' }}>
              {tab === t && <motion.div layoutId="deco-tab" style={{ position: 'absolute', inset: 0, background: colors.hibiscus }} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
              <span style={{ position: 'relative', fontFamily: fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.03em', color: tab === t ? colors.cream : colors.inkMid }}>
                {t.toUpperCase()}
              </span>
            </Tap>
          ))}
        </div>
        <div style={{ padding: 12, minHeight: 64, display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              {tab === 'sticker' && (
                <>
                  {STICKERS.map((k) => (
                    <Tap key={k} aria-label={`Add ${k} sticker`} onClick={() => add({ kind: 'sticker', sticker: k })} whileTap={{ scale: 0.85, rotate: -10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: STICKER_STYLE[k].bg, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={STICKER_STYLE[k].icon} size={20} color={STICKER_STYLE[k].fg} />
                      </div>
                    </Tap>
                  ))}
                  <div style={{ flex: 1 }} />
                  <Tap
                    aria-label="Clear decorations"
                    onClick={() => setPlaced([])}
                    style={{ width: 40, height: 40, borderRadius: 10, border: `2px dashed ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 11, color: colors.ink }}
                  >
                    clear
                  </Tap>
                </>
              )}
              {tab === 'text' && TEXT_STYLES.map((t) => (
                <Tap
                  key={t.id}
                  onClick={() => add({ kind: 'text', text: t.id })}
                  style={{ flex: 1, height: 44, borderRadius: 10, background: '#fff', border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {t.render('hi!')}
                </Tap>
              ))}
              {tab === 'filter' && FILTER_LIST.map((f) => {
                const on = booth.filter === f.id
                return (
                  <Tap key={f.id} onClick={() => update({ filter: f.id })} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: '100%', padding: 4, borderRadius: 8, background: '#fff', border: `${on ? 3 : 2}px solid ${colors.ink}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {filterSwatch(f.id).map((c, i) => <div key={i} style={{ height: 8, borderRadius: 2, background: c }} />)}
                    </div>
                    <span style={{ fontFamily: fonts.body, fontSize: 8, fontWeight: 700, color: on ? colors.ink : colors.inkMid }}>{f.label}</span>
                  </Tap>
                )
              })}
              {tab === 'border' && BORDERS.map((b) => {
                const on = booth.border === b.id
                return (
                  <Tap key={b.id} onClick={() => update({ border: b.id })} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{
                      width: 36, height: 44, background: '#fff',
                      border: `${on ? 3 : 2.5}px ${b.id === 'dashed' ? 'dashed' : 'solid'} ${colors.ink}`,
                      borderRadius: b.id === 'polaroid' ? 3 : b.id === 'dashed' ? 8 : 6,
                      backgroundImage: b.id === 'checker' ? `repeating-conic-gradient(${colors.ink} 0 25%, #fff 0 50%)` : undefined,
                      backgroundSize: '10px 10px', boxShadow: on ? `2px 2px 0 ${colors.hibiscus}` : 'none',
                    }} />
                    <span style={{ fontFamily: fonts.body, fontSize: 8, fontWeight: 700, color: on ? colors.ink : colors.inkMid }}>{b.label}</span>
                  </Tap>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Footer>
        <Button variant="outline" height={52} onClick={() => go('layoutPick', -1)}>Cancel</Button>
        <Button height={52} grow={1.4} onClick={() => go('keepsake')} style={{ fontSize: 15 }}>Approve it!</Button>
      </Footer>
    </Screen>
  )
}
