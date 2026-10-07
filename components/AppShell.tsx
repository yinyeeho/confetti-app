'use client'
import React, { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Booth, Screen } from '@/lib/types'
import { colors, fonts } from '@/lib/tokens'

import Splash from './screens/Splash'
import HowItWorks from './screens/HowItWorks'
import Home from './screens/Home'
import NewBooth from './screens/NewBooth'
import Invite from './screens/Invite'
import Notification from './screens/Notification'
import PickBooth from './screens/PickBooth'
import Capture from './screens/Capture'
import Waiting from './screens/Waiting'
import LayoutPick from './screens/LayoutPick'
import Decorate from './screens/Decorate'
import KeepsakePick from './screens/Keepsake'
import Share from './screens/Share'
import Story from './screens/Story'
import Print from './screens/Print'

export interface ScreenProps {
  booth: Booth
  update: (patch: Partial<Booth>) => void
  go: (next: Screen, dir?: 1 | -1) => void
  toast: (msg: string) => void
  saved: SavedStrip[]
  save: () => void
}

export interface SavedStrip { id: number; caption: string; filter: Booth['filter'] }

const freshBooth = (): Booth => ({
  layout: '4x1', solo: false, tag: 'Friends', friend: 'Mia', shots: 4,
  filter: 'none', border: 'classic', stickers: ['heart', 'star'], keepsake: 'passport',
})

const variants = {
  enter:  (dir: number) => ({ x: dir > 0 ? '100%' : '-30%', opacity: dir > 0 ? 1 : 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? '-30%' : '100%', opacity: dir > 0 ? 0 : 1 }),
}

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [dir, setDir] = useState<1 | -1>(1)
  const [booth, setBooth] = useState<Booth>(freshBooth)
  const [saved, setSaved] = useState<SavedStrip[]>([
    { id: 1, caption: 'mia · tue', filter: 'none' },
    { id: 2, caption: 'jun · last wk', filter: 'none' },
  ])
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const go = useCallback((next: Screen, d: 1 | -1 = 1) => {
    setDir(d)
    setScreen(next)
  }, [])

  const update = useCallback((patch: Partial<Booth>) => setBooth((b) => ({ ...b, ...patch })), [])

  const toast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current)
    setToastMsg(msg)
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const save = useCallback(() => {
    setSaved((s) => [{ id: Date.now(), caption: `${booth.friend.toLowerCase()} · today`, filter: booth.filter }, ...s])
    setBooth(freshBooth())
  }, [booth.friend, booth.filter])

  const props: ScreenProps = { booth, update, go, toast, saved, save }

  const screens: Record<Screen, React.ReactNode> = {
    splash:       <Splash {...props} />,
    howItWorks:   <HowItWorks {...props} />,
    home:         <Home {...props} />,
    newBooth:     <NewBooth {...props} />,
    invite:       <Invite {...props} />,
    notification: <Notification {...props} />,
    pickBooth:    <PickBooth {...props} />,
    capture:      <Capture {...props} />,
    waiting:      <Waiting {...props} />,
    layoutPick:   <LayoutPick {...props} />,
    decorate:     <Decorate {...props} />,
    keepsake:     <KeepsakePick {...props} />,
    share:        <Share {...props} />,
    story:        <Story {...props} />,
    print:        <Print {...props} />,
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: colors.paper }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={screen}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', ease: [0.32, 0, 0.18, 1], duration: 0.38 }}
          style={{ position: 'absolute', inset: 0, zIndex: dir > 0 ? 2 : 1 }}
        >
          {screens[screen]}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key={toastMsg}
            initial={{ y: -40, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: -1.5 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'absolute', top: 58, left: 0, right: 0, margin: '0 auto', width: 'max-content', maxWidth: '85%', zIndex: 50,
              background: colors.citrus, color: colors.ink, border: `2.5px solid ${colors.ink}`, boxShadow: `3px 3px 0 ${colors.ink}`,
              borderRadius: 99, padding: '8px 16px', fontFamily: fonts.display, fontSize: 13, fontWeight: 600,
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
