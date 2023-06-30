import { isSameDay, roundToNearestMinutes } from 'date-fns'
import { dateToPixels, mouseEventToDate, pixelsToDate } from './utils'
import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dayContext } from './Day'

interface NeedleProps {
  children: (props: { top: number, date: Date }) => ReactNode
  roundMinutes?: number
}

export default function Crosshair({ children, roundMinutes = 1 }: NeedleProps) {

  const { columnHeight, date: dayDate, columnContainerRef } = useContext(dayContext)
  const [date, setDate] = useState<Date | null>(null)

  const top = useMemo(() => (
    date && dateToPixels(date, columnHeight)
  ), [columnHeight, date])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!columnContainerRef.current) return
    const { top, height } = columnContainerRef.current.getBoundingClientRect()
    const dateFromEvent = pixelsToDate(e.clientY - top, height, dayDate)
    const finalCrosshairDate = roundToNearestMinutes(dateFromEvent, { nearestTo: roundMinutes })
    setDate(finalCrosshairDate)
  }, [dayDate, columnContainerRef, roundMinutes])

  const handleMouseLeave = useCallback(() => {
    setDate(null)
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

  if (!date || top === null) return null
  if (!isSameDay(dayDate, date)) return null

  return (
    <>
      {children({ top, date })}
    </>
  )
}
