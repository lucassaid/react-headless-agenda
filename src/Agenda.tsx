import { addDays, subDays, startOfWeek } from 'date-fns'
import { ReactNode } from 'react'
import AgendaContext, { AgendaContextType } from './context'
import { AgendaEvent } from './types'

interface ChildrenProps {
  next: () => void,
  prev: () => void,
  endDate: Date
}

interface AgendaProps<TEvent> {
  startDate?: Date
  onStartDateChange?: (newDate: Date) => void
  events?: TEvent[]
  days?: number
  children: (props: ChildrenProps) => ReactNode
}

export default function Agenda<TEvent extends AgendaEvent>({
  startDate = startOfWeek(new Date()),
  onStartDateChange = () => { },
  events = [],
  days = 7,
  children,
}: AgendaProps<TEvent>) {

  const context: AgendaContextType<TEvent> = {
    startDate,
    onStartDateChange,
    events,
    days,
  }

  const endDate = addDays(new Date(startDate), days - 1)

  const childrenProps: ChildrenProps = {
    prev: () => onStartDateChange(subDays(new Date(startDate), days)),
    next: () => onStartDateChange(addDays(new Date(startDate), days)),
    endDate,
  }

  return (
    <AgendaContext.Provider value={context}>
      {children(childrenProps)}
    </AgendaContext.Provider>
  )
}