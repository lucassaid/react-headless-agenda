import { addDays, subDays, startOfWeek } from 'date-fns'
import { ReactNode, useState } from 'react'
import agendaContext, { AgendaContext, BaseAgendaEvent } from './context'

export interface AgendaChildrenProps {
  next: () => void,
  prev: () => void,
  endDate: Date
}

export interface AgendaProps<TEvent> {
  startDate?: Date
  onStartDateChange?: (newDate: Date) => void
  events: TEvent[]
  days?: number
  children: (props: AgendaChildrenProps) => ReactNode
  onEventChange?: (event: TEvent) => void
  onDragStart?: (eventId: string) => void
  onDrop?: () => void
}

export default function Agenda<TEvent extends BaseAgendaEvent>({
  startDate = startOfWeek(new Date()),
  onStartDateChange = () => { },
  events = [],
  onEventChange = () => { },
  days = 7,
  children,
  onDragStart = () => { },
  onDrop = () => { },
}: AgendaProps<TEvent>) {

  const endDate = addDays(new Date(startDate), days - 1)
  const [draggingId, setDraggingId] = useState<string>('')

  const contextValue: AgendaContext<TEvent> = {
    startDate,
    endDate,
    onStartDateChange,
    events,
    onEventChange,
    days,
    onDragStart,
    onDrop,
    draggingId,
    setDraggingId,
  }

  const childrenProps: AgendaChildrenProps = {
    prev: () => onStartDateChange(subDays(new Date(startDate), days)),
    next: () => onStartDateChange(addDays(new Date(startDate), days)),
    endDate,
  }

  return (
    // @ts-ignore
    <agendaContext.Provider value={contextValue}>
      {children(childrenProps)}
    </agendaContext.Provider>
  )
}