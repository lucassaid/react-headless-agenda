import { ReactNode, useCallback, useState } from 'react'
import { dateToPixels } from './utils'

interface TicksChildrenProps {
  containerRef: (node: HTMLDivElement) => void
  ticks: {
    hour: number
    top: number
  }[]
}

interface TicksProps {
  children: ({ ticks }: TicksChildrenProps) => ReactNode
}

export default function Ticks({
  children
}: TicksProps) {

  const [columnHeight, setColumnHeight] = useState(0)

  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      const height = node.scrollHeight
      setColumnHeight(height)
    }
  }, [])

  const ticks = Array.from(new Array(24), (v, i) => ({
    hour: i,
    top: dateToPixels(new Date(new Date().setHours(i, 0, 0, 0)), columnHeight),
  }))

  return (
    <>
      {children({
        containerRef,
        ticks,
      })}
    </>
  )
}
