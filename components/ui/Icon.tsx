import React from 'react'

// Icons traced from the Paper file: 1.6–2px stroke, rounded caps, no fill except stickers.
export type IconName =
  | 'close' | 'back' | 'camera' | 'bolt' | 'share' | 'story' | 'download'
  | 'print' | 'more' | 'heart' | 'heartFill' | 'star' | 'sparkle' | 'send'
  | 'qr' | 'message' | 'mail' | 'arrow' | 'copy' | 'check'

interface IconProps { name: IconName; size?: number; color?: string; strokeWidth?: number }

export default function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }: IconProps) {
  const s = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<IconName, React.ReactNode> = {
    close:    <path d="M5 5l12 12M17 5L5 17" {...s} />,
    back:     <polyline points="13,5 6,11 13,17" {...s} />,
    camera:   <><rect x="3" y="6" width="16" height="12" rx="2.5" {...s} /><circle cx="11" cy="12" r="3.5" {...s} /></>,
    bolt:     <path d="M12 3l-6 9h5l-1 7 6-9h-5l1-7z" {...s} />,
    share:    <><circle cx="6" cy="11" r="2.4" {...s} /><circle cx="16" cy="6" r="2.4" {...s} /><circle cx="16" cy="16" r="2.4" {...s} /><path d="M8 10l6-3M8 12l6 3" {...s} /></>,
    story:    <><rect x="3" y="3" width="16" height="16" rx="3" {...s} /><circle cx="11" cy="11" r="3" {...s} /></>,
    download: <path d="M11 4v10M6 11l5 5 5-5M5 18h12" {...s} />,
    print:    <><rect x="5" y="9" width="12" height="7" rx="1" {...s} /><polyline points="7,9 7,4 15,4 15,9" {...s} /></>,
    more:     <><circle cx="4.5" cy="11" r="1.5" fill={color} /><circle cx="11" cy="11" r="1.5" fill={color} /><circle cx="17.5" cy="11" r="1.5" fill={color} /></>,
    heart:    <path d="M11 18.3s-6.4-4.1-8.7-8.2C.7 6.7 2.3 3.7 5.5 3.7c1.8 0 3 1 3.7 2C9.8 4.7 11 3.7 12.8 3.7c3.2 0 4.8 3 3.2 6.4-2.3 4.1-5 8.2-5 8.2z" {...s} />,
    heartFill:<path d="M11 18.3s-6.4-4.1-8.7-8.2C.7 6.7 2.3 3.7 5.5 3.7c1.8 0 3 1 3.7 2C9.8 4.7 11 3.7 12.8 3.7c3.2 0 4.8 3 3.2 6.4-2.3 4.1-5 8.2-5 8.2z" fill={color} />,
    star:     <path d="M11 1.8l2.4 6.3 6.8.6-5.1 4.4 1.5 7-5.6-3.7-5.5 3.7 1.5-7-5.2-4.4 6.8-.6z" fill={color} />,
    sparkle:  <path d="M11 1.8c0 4.6 2.8 7.3 7.3 7.3-4.5 0-7.3 2.8-7.3 7.4 0-4.6-2.8-7.4-7.3-7.4 4.5 0 7.3-2.7 7.3-7.3z" fill={color} />,
    send:     <path d="M2.8 10l16.5-7.3-7.3 16.5-2.3-6.9z" {...s} />,
    qr:       <><rect x="3.5" y="3.5" width="5.5" height="5.5" rx="1" {...s} /><rect x="13" y="3.5" width="5.5" height="5.5" rx="1" {...s} /><rect x="3.5" y="13" width="5.5" height="5.5" rx="1" {...s} /><path d="M13 13h2.5v2.5M18.5 13v5.5H13" {...s} /></>,
    message:  <path d="M4 5h14a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" {...s} />,
    mail:     <><rect x="3" y="5" width="16" height="12" rx="2" {...s} /><path d="M3.5 6l7.5 6 7.5-6" {...s} /></>,
    arrow:    <path d="M4 11h14M12 5l6 6-6 6" {...s} />,
    copy:     <><rect x="7" y="7" width="11" height="11" rx="2" {...s} /><path d="M4 14V5a1 1 0 0 1 1-1h9" {...s} /></>,
    check:    <path d="M4.5 11.5l4 4 9-9" {...s} />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden style={{ flexShrink: 0, display: 'block' }}>
      {paths[name]}
    </svg>
  )
}
