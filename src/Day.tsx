import { differenceInMinutes, isSameDay, isWithinInterval, startOfDay } from 'date-fns'
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import AgendaContext from './context'
import { AgendaEvent } from './types'
import { dateToPixels } from './utils'

export const DayContext = createContext({
  columnHeight: 0,
  date: new Date(),
})

interface ChildrenProps {
  containerRef: (node: HTMLDivElement) => void
  events: {
    event: AgendaEvent
    top: number
    bottom: number
  }[]
}

interface DayProps {
  date: Date,
  children: (props: ChildrenProps) => ReactNode
}

export default function Day({ date, children }: DayProps) {

  const { events: allEvents } = useContext(AgendaContext)
  const [columnHeight, setColumnHeight] = useState(0)

  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      const height = node.scrollHeight
      setColumnHeight(height)
    }
  }, [])

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
      }
    })
  }, [allEvents, columnHeight, date])

  return (
    <DayContext.Provider value={{ columnHeight, date }}>
      {children({ containerRef, events })}
    </DayContext.Provider>
  )
}