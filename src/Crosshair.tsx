import { roundToNearestMinutes } from 'date-fns'
import { dateToPixels, pixelsToDate } from './utils'
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { dayContext } from './Day'

interface CrosshairChildrenProps {
  top: number
  date: Date
}
interface CrosshairProps {
  children: (props: CrosshairChildrenProps) => ReactNode
  roundMinutes?: number
}

export default function Crosshair({ children, roundMinutes = 1 }: CrosshairProps) {

  const { date: dayDate, columnContainerRef } = useContext(dayContext)
  const [childrenProps, setChildrenProps] = useState<CrosshairChildrenProps | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!columnContainerRef.current) return
    const { top, height } = columnContainerRef.current.getBoundingClientRect()
    const dateFromEvent = pixelsToDate(e.clientY - top, height, dayDate)
    const crossHairDate = roundToNearestMinutes(dateFromEvent, { nearestTo: roundMinutes })
    const crossHairTop = dateToPixels(crossHairDate, height)
    setChildrenProps({
      top: crossHairTop,
      date: crossHairDate,
    })
  }, [dayDate, columnContainerRef, roundMinutes])

  const handleMouseLeave = useCallback(() => {
    setChildrenProps(null)
  }, [])

  useEffect(() => {
    const node = columnContainerRef.current
    node?.addEventListener('mousemove', handleMouseMove)
    node?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node?.removeEventListener('mousemove', handleMouseMove)
      node?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave, columnContainerRef])

  if (!childrenProps) return null

  return (
    <>
      {children(childrenProps)}
    </>
  )
}
