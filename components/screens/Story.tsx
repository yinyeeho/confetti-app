'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { colors, fonts } from '@/lib/tokens'
import { Avatar, Tap } from '../ui/kit'
import Icon from '../ui/Icon'
import Strip from '../ui/Strip'
import type { ScreenProps } from '../AppShell'

// Preview of the strip as an Instagram-style story
export default function Story({ booth, go, toast }: ScreenProps) {
  const [liked, setLiked] = useState(false)
  const [msg, setMsg] = useState('')
  const cream = colors.cream

  return (
    <div style={{ position: 'absolute', inset: 0, background: colors.cobaltDeep, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 14px 0' }}>
        <div style={{ height: 3, borderRadius: 99, background: '#FFF8EC40', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} style={{ height: '100%', background: cream }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 0' }}>
        <Avatar letter="J" color={colors.citrus} size={32} />
        <span style={{ fontFamily: fonts.body, fontSize: 13.5, fontWeight: 700, color: cream }}>june</span>
        <span style={{ fontFamily: fonts.body, fontSize: 12, color: '#FFF8ECA6' }}>now</span>
        <div style={{ flex: 1 }} />
        <Icon name="more" size={18} color={cream} />
        <Tap aria-label="Close story" onClick={() => go('share', -1)}><Icon name="close" size={16} color={cream} strokeWidth={2.2} /></Tap>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.8, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: 3, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} style={{ position: 'relative' }}>
          <Strip shots={booth.shots} width={150} frameHeight={72} shadow={0} radius={6} filter={booth.filter} border={booth.border} />
          {/* washi tape */}
          <div style={{ position: 'absolute', left: 43, top: -14, width: 64, height: 22, background: '#FFC93CD9', border: '1.5px solid #19191980' }} />
          <div style={{ position: 'absolute', left: 6, bottom: -40, rotate: '-3deg', fontFamily: fonts.script, fontSize: 26, color: cream, whiteSpace: 'nowrap' }}>
            {booth.caption?.trim() || 'booth week 🎉'}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 26px' }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Send message"
          style={{ flex: 1, height: 44, borderRadius: 999, border: '1.5px solid #FFF8EC8C', background: 'transparent', padding: '0 16px', outline: 'none', fontFamily: fonts.body, fontSize: 13.5, color: cream }}
        />
        <Tap
          aria-label="Like"
          onClick={() => setLiked((l) => !l)}
          whileTap={{ scale: 1.3 }}
          style={{ width: 44, height: 44, borderRadius: 999, border: '1.5px solid #FFF8EC8C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name={liked ? 'heartFill' : 'heart'} size={19} color={liked ? colors.hibiscus : cream} strokeWidth={2} />
        </Tap>
        <Tap
          aria-label="Send"
          onClick={() => { toast(msg ? 'Message sent ✦' : 'Posted to your story ✦'); setMsg('') }}
          style={{ width: 44, height: 44, borderRadius: 999, background: cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="send" size={19} color={colors.cobaltDeep} strokeWidth={2} />
        </Tap>
      </div>
    </div>
  )
}
