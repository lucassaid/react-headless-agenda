import { addDays } from 'date-fns'
import { createContext } from 'react'

export interface BaseAgendaEvent {
  start: Date
  end: Date
  [key: string]: any
}

export interface AgendaContext<EventType extends BaseAgendaEvent> {
  startDate: Date
  endDate: Date
  onStartDateChange: (newDate: Date) => void
  events: EventType[]
  onEventChange: (newEvent: EventType) => void
  days: number
  onDragStart: (eventId: string) => void
  onDrop: () => void
  draggingId: string
  setDraggingId: (id: string) => void
}

const agendaContext = createContext<AgendaContext<BaseAgendaEvent>>({
  startDate: new Date(),
  endDate: addDays(new Date(), 6),
  onStartDateChange: () => [],
  events: [],
  days: 7,
  onEventChange: () => [],
  onDragStart: () => [],
  onDrop: () => [],
  draggingId: '',
  setDraggingId: () => [],
})

export default agendaContext
