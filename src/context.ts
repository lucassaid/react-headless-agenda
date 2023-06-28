import { createContext, useContext, MutableRefObject } from 'react'

export interface BaseAgendaEvent {
  start: Date
  end: Date
  [key: string]: any
}

export interface AgendaContext<EventType extends BaseAgendaEvent> {
  startDate: Date
  onStartDateChange: (newDate: Date) => void
  events: EventType[]
  onEventChange: (newEvent: EventType) => void
  days: number
  onDragStart: (eventId: string) => void
  onDrop: () => void
}

const agendaContext = createContext<AgendaContext<BaseAgendaEvent>>({
  startDate: new Date(),
  onStartDateChange: () => [],
  events: [],
  days: 7,
  onEventChange: () => [],
  onDragStart: () => [],
  onDrop: () => [],
})

export default agendaContext
