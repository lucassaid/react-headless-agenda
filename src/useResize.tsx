import { DragEvent, useCallback, useContext, useMemo, useRef } from 'react'
import agendaContext from './context'
import { dayContext } from './Day'
import { emptyCanvas, pixelsToDate } from './utils'
import { addMinutes, differenceInMinutes, isSameDay, roundToNearestMinutes } from './date-utils'

export function useResize(eventId: string, roundMinutes = 15) {
  const { events, onEventChange } = useContext(agendaContext)
  const { columnHeight, date, topRef } = useContext(dayContext)
  const offsetFromEnd = useRef(0)

  const event = useMemo(() => events.find((e) => e.id === eventId), [events, eventId])

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLElement>) => {
      if (!event) return
      e.stopPropagation()
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setDragImage(emptyCanvas, 0, 0)

      // difference in minutes between the end of the event and the cursor position
      const mouseDate = pixelsToDate(e.clientY - topRef.current, columnHeight, date)
      offsetFromEnd.current = differenceInMinutes(event.end, mouseDate)
    },
    [event, columnHeight, date, topRef]
  )

  const handleDrag = useCallback(
    (e: DragEvent<HTMLElement>) => {
      if (!event) return
      e.stopPropagation()

      const mouseDate = pixelsToDate(e.clientY - topRef.current, columnHeight, date)
      const finalNewEndDate = roundToNearestMinutes(addMinutes(mouseDate, offsetFromEnd.current), {
        nearestTo: roundMinutes,
      })

      if (!isSameDay(event.end, finalNewEndDate)) return
      if (differenceInMinutes(finalNewEndDate, event.start) < 60) return

      onEventChange({
        ...event,
        end: roundToNearestMinutes(addMinutes(mouseDate, offsetFromEnd.current), {
          nearestTo: roundMinutes,
        }),
      })
    },
    [event, columnHeight, date, topRef, onEventChange, roundMinutes]
  )

  return {
    handleDragStart,
    handleDrag,
  }
}
