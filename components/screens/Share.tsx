'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Screen, Tap } from '../ui/kit'
import Icon, { IconName } from '../ui/Icon'
import Strip from '../ui/Strip'
import type { ScreenProps } from '../AppShell'

export default function Share({ booth, go, toast, save }: ScreenProps) {
  const rows: { icon: IconName; bg: string; fg: string; title: string; sub?: string; arrow?: boolean; onClick: () => void }[] = [
    {
      icon: 'share', bg: colors.hibiscus, fg: colors.cream, title: `Send to ${booth.friend}`, sub: 'pops up on her lock screen',
      onClick: () => toast(`Sent to ${booth.friend} 💌`),
    },
    { icon: 'story', bg: colors.cobaltDeep, fg: colors.cream, title: 'Post to story', sub: '9:16 · full strip, no crop', arrow: true, onClick: () => go('story') },
    { icon: 'download', bg: colors.citrus, fg: colors.ink, title: 'Save to strips', onClick: () => { save(); toast('Saved to your strips ★'); go('home', -1) } },
    { icon: 'print', bg: colors.cream, fg: colors.ink, title: 'Print · 4×6in', sub: '$2.40 · ready in 1h', arrow: true, onClick: () => go('print') },
  ]

  return (
    <Screen>
      {/* Strip behind the sheet */}
      <div style={{ padding: '0 24px', opacity: 0.35 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 700, color: colors.ink }}>Strip #0064</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Strip shots={booth.shots} photos={booth.photos} width={130} frameHeight={58} gap={5} pad={8} shadow={0} radius={6} filter={booth.filter} border={booth.border} />
        </div>
      </div>
      <Tap aria-label="Back to keepsake" onClick={() => go('keepsake', -1)} style={{ position: 'absolute', inset: 0, background: '#19191973', cursor: 'default' }} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, delay: 0.15 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 100) go('keepsake', -1) }}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px 32px', zIndex: 3,
          background: colors.cream, borderTop: `3px solid ${colors.ink}`, borderRadius: '24px 24px 0 0',
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 99, background: '#E8E4DC', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 700, color: colors.ink }}>Share it!</span>
          <span style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 700, color: colors.inkMid }}>{booth.shots} SHOTS</span>
        </div>
        {rows.map((r) => (
          <Tap
            key={r.title}
            onClick={r.onClick}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', width: '100%', borderTop: `2px solid ${colors.tint}`, textAlign: 'left' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, border: `2px solid ${colors.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={r.icon} size={16} color={r.fg} strokeWidth={1.6} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 600, color: colors.ink }}>{r.title}</div>
              {r.sub && <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: colors.inkMid, marginTop: 1 }}>{r.sub}</div>}
            </div>
            {r.arrow && <Icon name="arrow" size={15} color={colors.ink} />}
          </Tap>
        ))}
      </motion.div>
    </Screen>
  )
}
