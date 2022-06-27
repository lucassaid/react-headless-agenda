import { createContext } from 'react'
import { AgendaEvent } from './types'

export interface AgendaContextType<TEvent> {
  startDate: Date
  onStartDateChange: (newDate: Date) => void
  events: TEvent[]
  days: number
}

export default createContext<AgendaContextType<AgendaEvent>>({
  startDate: new Date(),
  onStartDateChange: () => [],
  events: [],
  days: 7,
})
