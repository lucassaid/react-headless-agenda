import {
  differenceInSeconds,
  endOfDay,
  startOfDay,
  addMinutes,
  differenceInMinutes,
} from './date-utils'
import { useCallback, useContext } from 'react'
import agendaContext from './context'
import { dayContext } from './Day'

export const dateToPixels = (date: Date, columnHeight: number) => {
  const differenceWithEnd = differenceInSeconds(endOfDay(date), date)
  const minutesLeft = 86400 - differenceWithEnd
  const percentage = (minutesLeft / 86400) * 100
  return (percentage * columnHeight) / 100
}

export const pixelsToDate = (pixels: number, columnHeight: number, pivot = new Date()): Date => {
  const percentage = (pixels / columnHeight) * 100
  const minutesPassed = (percentage / 100) * 1440
  const dateStart = startOfDay(pivot)
  const date = addMinutes(dateStart, minutesPassed)
  return date
}

/**
 *
 * @param e A synthetic event
 * @param pivotDate Reference date
 * @returns a date
 */
export const mouseEventToDate = (e: React.MouseEvent<HTMLElement>, pivotDate = new Date()) => {
  const { top, height } = e.currentTarget.getBoundingClientRect()
  return pixelsToDate(e.clientY - top, height, pivotDate)
}

const blankCanvas = document.createElement('canvas')
blankCanvas.style.position = 'fixed'
document.body.appendChild(blankCanvas)

export const hideDragGhost = (e: React.DragEvent<HTMLElement>) => {
  e.dataTransfer.setDragImage(blankCanvas, 0, 0)
}

export const useDragEvent = (eventId: string, roundMinutes = 15) => {
  const { events, onDragStart, setDraggingId } = useContext(agendaContext)
  const { columnHeight, date, topRef } = useContext(dayContext)

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      hideDragGhost(e)
      setDraggingId(eventId)

      e.dataTransfer.effectAllowed = 'move'

      const event = events.find((event) => event.id === eventId)
      if (!event) return

      onDragStart(eventId)

      // difference in minutes between the start of the event and the cursor position
      const mouseDate = pixelsToDate(e.clientY - topRef.current, columnHeight, date)
      const offsetMinutes = differenceInMinutes(mouseDate, event.start)

      e.dataTransfer.setData(`${eventId};${offsetMinutes};${roundMinutes}`, '')
    },
    [columnHeight, date, events, eventId, roundMinutes, topRef, onDragStart, setDraggingId]
  )

  return {
    handleDragStart,
  }
}
