export type Screen =
  | 'splash'
  | 'howItWorks'
  | 'home'
  | 'newBooth'
  | 'invite'
  | 'notification'
  | 'pickBooth'
  | 'capture'
  | 'waiting'
  | 'decorate'
  | 'keepsake'
  | 'share'
  | 'story'
  | 'print'

export type Layout = '4x1' | '2x1' | '2x2' | '3x1'
export type Keepsake = 'strip' | 'passport' | 'contact'
export type DecorateTab = 'sticker' | 'text' | 'filter' | 'border'
export type Filter = 'none' | 'bw' | 'warm' | 'faded' | 'bold'
export type Border = 'classic' | 'polaroid' | 'dashed' | 'checker'
export type StickerKind = 'heart' | 'star' | 'sparkle' | 'bolt'

export interface Booth {
  layout: Layout
  solo: boolean
  tag: string
  friend: string
  shots: number
  filter: Filter
  border: Border
  stickers: StickerKind[]
  caption?: string
  keepsake: Keepsake
  photos: string[]   // data URLs captured from the camera, in shot order
  friendDone?: boolean // the friend has shot their half
}
