/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks } from '../../src'
import { addDays, format, startOfWeek } from 'date-fns'
import { useCallback, useState } from 'react'
import { Needle } from '../../src'
import { BaseAgendaEvent } from '../../src/context'
import { useDragEvent } from '../../src/utils'

const meta: Meta<typeof Agenda> = {
  title: 'Interaction/drag-and-resize/DragOnly',
  component: Agenda,
}

export default meta
type Story = StoryObj<typeof Agenda>

interface MyEventProps extends BaseAgendaEvent {
  id: string
  title: string
  start: Date
  end: Date
  className?: string
}

const Event = (
  { id, title, top, bottom, className, start, end }: MyEventProps & { top: number, bottom: number }
) => {

  const { handleDragStart } = useDragEvent(id)

  return (
    <div
      id={id}
      key={id}
      tabIndex={-1}
      className={`
        absolute w-full p-4 rounded-lg cursor-move select-none ${className}
      `}
      style={{ top, bottom }}
      draggable
      onDragStart={handleDragStart}
    >
      {title}
      <br />
      <small>
        {format(start, 'EEEEEE HH:mm')}<br />
        ↓<br />
        {format(end, 'EEEEEE HH:mm')}
      </small>
    </div>
  )
}

const events: MyEventProps[] = [
  {
    id: '0',
    title: 'Event 1',
    start: addDays(new Date(new Date().setHours(5, 0, 0, 0)), -1),
    end: addDays(new Date(new Date().setHours(12, 0, 0, 0)), -1),
    className: 'bg-lime-500 text-white',
  },
  {
    id: '1',
    title: 'Event 2',
    start: addDays(new Date(new Date().setHours(3, 0, 0, 0)), 1),
    end: addDays(new Date(new Date().setHours(14, 0, 0, 0)), 1),
    className: 'bg-sky-500 text-white',
  }
]

export const DragOnly: Story = {
  render: () => {

    const [startDate, setStartDate] = useState(startOfWeek(new Date()))

    const [events2, setEvents] = useState(events)

    const handleEventChange = useCallback((event: MyEventProps) => {
      setEvents(curr => curr.map(e => e.id === event.id ? event : e))
    }, [])

    return (
      <Agenda
        startDate={startDate}
        onStartDateChange={setStartDate}
        events={events2}
        onEventChange={handleEventChange}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-[600px] select-none"
              style={{
                gridTemplateColumns: '60px repeat(7, 1fr)',
                gridTemplateRows: 'min-content 1fr'
              }}
            >
              <div />
              <Days>
                {({ date }) => (
                  <div key={date.toString()} className="text-center">
                    {format(date, 'ccc d')}
                  </div>
                )}
              </Days>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-1 row-start-2 relative"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => (
                      <div
                        key={hour}
                        className="text-slate-300 absolute right-2 text-sm"
                        style={{ top: top - 12 }}
                      >
                        {hour} hs
                      </div>
                    ))}
                  </div>
                )}
              </Ticks>
              <Days>
                {({ date, containerRef, events, index }) => (
                  <div
                    key={date.toString()}
                    ref={containerRef}
                    className="relative h-full row-start-2"
                    style={{ gridColumnStart: index + 2 }}
                  >
                    {events.map(({ event, top, bottom }) => {
                      const myEvent = event as MyEventProps
                      return (
                        <Event
                          key={myEvent.id}
                          {...myEvent}
                          top={top}
                          bottom={bottom}
                          onChange={handleEventChange}
                        />
                      )
                    })}
                    <Needle>
                      {({ top }) => (
                        <div
                          className="needle"
                          style={{ top }}
                        />
                      )}
                    </Needle>
                  </div>
                )}
              </Days>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-2 col-span-7 row-start-2 row-end-2 -z-10 relative"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => (
                      <div
                        key={hour}
                        className="opacity-30 h-0.5 bg-slate-300 absolute right-0 -left-4"
                        style={{ top }}
                      />
                    ))}
                  </div>
                )}
              </Ticks>
            </div>
          </>
        )}
      </Agenda>
    )
  },
}
