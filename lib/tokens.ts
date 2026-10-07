// Confetti Booth design tokens — mirrors the "Confetti Booth — Design System" board in Paper.

export const colors = {
  // Neutrals
  ink:       '#191919', // text, borders, shadows
  inkSoft:   '#5B5B60', // secondary text
  inkMid:    '#6B6B70', // meta text
  inkMute:   '#9C9C9C', // labels, timestamps
  paper:     '#FFF7EC', // app background
  cream:     '#FFF8EC', // sheets, light text on color
  card:      '#FFFFFF',
  line:      '#D8D5CC', // inactive borders
  tint:      '#F1EEE6', // empty slots, dividers
  dot:       '#E4E1D8', // pager dots
  night:     '#15171A', // lock screen, developing card

  // Accent trio — one leads per moment
  hibiscus:  '#FF4F81', // primary CTAs, live states, hearts
  hibiscusTint: '#FFF0F4',
  cobalt:    '#2F5DFF', // capture context, links
  cobaltDeep:'#274CDB', // cobalt inside photo strips
  citrus:    '#FFC93C', // highlights, ready/star states, stickers

  // Status
  done:      '#57B96B',
  amber:     '#E8A23A',
} as const

export type ColorKey = keyof typeof colors

export const fonts = {
  display: 'var(--font-fredoka), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  script:  'var(--font-caveat), cursive',
} as const

// The signature "sticker" treatment: thick ink border + hard offset shadow
export const sticker = (offset = 4) => ({
  border: `2.5px solid ${colors.ink}`,
  boxShadow: `${offset}px ${offset}px 0 ${colors.ink}`,
})

export const shotColors = [colors.citrus, colors.cobaltDeep, colors.hibiscus, colors.citrus] as const
