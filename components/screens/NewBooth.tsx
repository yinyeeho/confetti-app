'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Layout } from '@/lib/types'
import { Button, Chip, Eyebrow, Footer, Header, Screen, Tap, Title } from '../ui/kit'
import Icon from '../ui/Icon'
import type { ScreenProps } from '../AppShell'

const LAYOUTS: { id: Layout; shots: number }[] = [
  { id: '4x1', shots: 4 }, { id: '2x1', shots: 2 }, { id: '2x2', shots: 4 }, { id: '3x1', shots: 3 },
]
const TAGS = ['Friends', 'Anniversary', 'Birthday', 'Just because', 'Custom']
const TRIO = [colors.citrus, colors.cobalt, colors.hibiscus, colors.citrus]

function LayoutTile({ id, active }: { id: Layout; active: boolean }) {
  const slot = (i: number): React.CSSProperties => ({ background: active ? TRIO[i] : colors.tint, borderRadius: 2, flexGrow: 1 })
  const n = id === '4x1' ? 4 : id === '3x1' ? 3 : 2
  return (
    <motion.div
      animate={{ borderColor: active ? colors.hibiscus : colors.line, backgroundColor: active ? colors.hibiscusTint : 'rgba(0,0,0,0)' }}
      style={{
        width: 76, height: 96, padding: 6, borderRadius: 10, borderStyle: 'solid', borderWidth: active ? 3 : 2,
        boxShadow: active ? `3px 3px 0 ${colors.ink}` : 'none', display: 'flex', flexDirection: 'column', gap: 3,
      }}
    >
      {id === '2x2'
        ? [0, 1].map((r) => (
            <div key={r} style={{ display: 'flex', gap: 3, flexGrow: 1 }}>
              {[0, 1].map((c) => <div key={c} style={slot(r * 2 + c)} />)}
            </div>
          ))
        : Array.from({ length: n }).map((_, i) => <div key={i} style={slot(i)} />)}
    </motion.div>
  )
}

function WhoCard({ title, sub, active, onClick }: { title: string; sub: string; active: boolean; onClick: () => void }) {
  return (
    <Tap
      onClick={onClick}
      style={{
        flex: 1, padding: 14, borderRadius: 14, textAlign: 'left',
        border: active ? `3px solid ${colors.hibiscus}` : `2px solid ${colors.line}`,
        background: active ? colors.hibiscusTint : 'transparent', boxShadow: active ? `3px 3px 0 ${colors.ink}` : 'none',
      }}
    >
      <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: active ? 700 : 600, color: colors.ink }}>
        {title}{active && ' ✓'}
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: active ? colors.inkMid : colors.inkMute, marginTop: 2 }}>{sub}</div>
    </Tap>
  )
}

export default function NewBooth({ booth, update, go, toast }: ScreenProps) {
  return (
    <Screen>
      <Header
        left={<Tap aria-label="Close" onClick={() => go('home', -1)}><Icon name="close" size={16} color={colors.ink} /></Tap>}
        center={<span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 700, color: colors.ink }}>New booth</span>}
        right={<Tap onClick={() => toast('Draft saved ✦')} style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, color: colors.hibiscus }}>Save draft</Tap>}
      />
      <div style={{ padding: '16px 24px 0' }}><Title>What shape are we making?</Title></div>

      <div style={{ padding: '20px 24px 0' }}><Eyebrow>Layout · swipe to browse</Eyebrow></div>
      <div style={{ display: 'flex', gap: 10, padding: '12px 24px 0', overflowX: 'auto' }} className="no-scrollbar">
        {LAYOUTS.map((l) => {
          const on = booth.layout === l.id
          return (
            <Tap key={l.id} onClick={() => update({ layout: l.id, shots: l.shots })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <LayoutTile id={l.id} active={on} />
              <span style={{ fontFamily: fonts.body, fontSize: 9.5, fontWeight: on ? 700 : 400, color: on ? colors.ink : colors.inkMute }}>{l.id}</span>
            </Tap>
          )
        })}
      </div>

      <div style={{ padding: '24px 24px 0' }}><Eyebrow>Who&apos;s with you?</Eyebrow></div>
      <div style={{ display: 'flex', gap: 10, padding: '12px 24px 0' }}>
        <WhoCard title="Solo strip" sub="just for me" active={booth.solo} onClick={() => update({ solo: true })} />
        <WhoCard title="Invite a friend" sub="share with a friend" active={!booth.solo} onClick={() => update({ solo: false })} />
      </div>

      <div style={{ padding: '24px 24px 0' }}><Eyebrow>Tag this strip (optional)</Eyebrow></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 24px 0' }}>
        {TAGS.map((t) => <Chip key={t} active={booth.tag === t} onClick={() => update({ tag: booth.tag === t ? '' : t })}>{t}</Chip>)}
      </div>

      <Footer>
        <Button onClick={() => go(booth.solo ? 'pickBooth' : 'invite')}>
          {booth.solo ? 'Continue · Solo' : 'Continue · Invite'}
        </Button>
      </Footer>
    </Screen>
  )
}
