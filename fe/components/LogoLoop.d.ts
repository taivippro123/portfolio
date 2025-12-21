import type { CSSProperties, ReactNode } from "react"

type LogoNodeItem = {
  node: ReactNode
  title?: string
  href?: string
  ariaLabel?: string
}

type LogoImageItem = {
  src: string
  alt?: string
  title?: string
  href?: string
  ariaLabel?: string
  srcSet?: string
  sizes?: string
  width?: number
  height?: number
}

type LogoItem = LogoNodeItem | LogoImageItem

type Direction = "left" | "right" | "up" | "down"

export type LogoLoopProps = {
  logos: LogoItem[]
  speed?: number
  direction?: Direction
  width?: number | string
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  renderItem?: (item: LogoItem, index: number) => ReactNode
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

export default function LogoLoop(props: LogoLoopProps): JSX.Element

