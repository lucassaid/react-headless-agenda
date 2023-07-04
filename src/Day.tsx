import {
  addMinutes,
  differenceInMinutes,
  isSameDay,
  isWithinInterval,
  roundToNearestMinutes,
  startOfDay,
} from 'date-fns'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import agendaContext, { BaseAgendaEvent } from './context'
import { dateToPixels, pixelsToDate } from './utils'

interface DayContext {
  columnHeight: number
  date: Date
  topRef: React.MutableRefObject<number>
  columnContainerRef: React.MutableRefObject<HTMLDivElement | null>
}

export const dayContext = createContext<DayContext>({
  columnHeight: 0,
  date: new Date(),
  topRef: { current: 0 },
  columnContainerRef: { current: null },
})

export interface EventBlock<EventType extends BaseAgendaEvent = BaseAgendaEvent> {
  event: EventType
  top: number
  bottom: number
  startsBeforeToday: boolean
  endsAfterToday: boolean
  isDragging: boolean
}

export interface DayChildrenProps {
  containerRef: (node: HTMLDivElement) => void
  events: EventBlock[]
}

interface DayProps {
  date: Date,
  children: (props: DayChildrenProps) => ReactNode
}

export default function Day({ date, children }: DayProps) {

  const { events: allEvents, onEventChange, onDrop, draggingId, setDraggingId } = useContext(agendaContext)
  const columnContainerRef = useRef<HTMLDivElement | null>(null)
  const [columnHeight, setColumnHeight] = useState(0)
  const topRef = useRef(0)

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()

    const dragData = e.dataTransfer?.types[0]
    if (!dragData) return
    const [draggingId, offsetMinutes, roundMinutes] = dragData.split(';')

    const event = allEvents.find(e => e.id === draggingId)
    if (!event) return

    const newTop = (e.clientY - topRef.current)
    const newStart = roundToNearestMinutes(addMinutes(pixelsToDate(newTop, columnHeight, date), - Number(offsetMinutes)), { nearestTo: Number(roundMinutes) })

    const currentDiff = differenceInMinutes(event.end, event.start)
    const newEnd = addMinutes(newStart, currentDiff)

    onEventChange({
      ...event,
      start: newStart,
      end: newEnd,
    })
  }, [columnHeight, allEvents, date, onEventChange])

  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      setColumnHeight(node.scrollHeight)
      topRef.current = node.getBoundingClientRect().top
      columnContainerRef.current = node
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    onDrop()
    setDraggingId('')
  }, [onDrop, setDraggingId])

  useEffect(() => {
    const node = columnContainerRef.current
    node?.addEventListener('dragover', handleDragOver)
    node?.addEventListener('drop', handleDrop)

    return () => {
      node?.removeEventListener('dragover', handleDragOver)
      node?.removeEventListener('drop', handleDrop)
    }
  }, [handleDragOver, handleDrop])

  const events = useMemo(() => {

    const columnEvents = allEvents.filter(({ start, end }) => {
      if (differenceInMinutes(end, startOfDay(date)) === 0) return false
      if (isSameDay(start, date) || isSameDay(end, date)) return true
      return isWithinInterval(date, { start, end })
    })

    return columnEvents.map(event => {

      const top = isSameDay(event.start, date)
        ? dateToPixels(event.start, columnHeight)
        : 0

      const bottom = isSameDay(event.end, date)
        ? columnHeight - dateToPixels(event.end, columnHeight)
        : 0

      return {
        event,
        top,
        bottom,
        startsBeforeToday: !isSameDay(event.start, date),
        endsAfterToday: !isSameDay(event.end, date),
        isDragging: event.id === draggingId,
      }
    })
  }, [allEvents, date, columnHeight, draggingId])

  return (
    <dayContext.Provider value={{ columnHeight, date, topRef, columnContainerRef }}>
      {children({ containerRef, events })}
    </dayContext.Provider>
  )
}