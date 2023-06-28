/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Columns, Day, Ticks, useResize } from '../src'
import { format, startOfWeek, subDays } from 'date-fns'
import { useCallback, useState } from 'react'
import { BaseAgendaEvent } from '../src/context'
import { ExtendedEventProps } from '../src/types'

const meta: Meta<typeof Agenda> = {
  title: 'Drag And  Resize/ResizeInvisibleHandle',
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
  { id, title, top, bottom, className, start, end }: MyEventProps & ExtendedEventProps
) => {

  const { handleDragStart, handleDrag } = useResize(id)

  return (
    <div
      id={id}
      key={id}
      tabIndex={-1}
      className={`
        absolute w-full p-4 rounded-lg select-none ${className}
      `}
      style={{ top, bottom }}
    >
      {title}
      <br />
      <small>
        {format(start, 'EEEEEE HH:mm')}
        &nbsp;-&nbsp;
        {format(end, 'EEEEEE HH:mm')}
      </small>

      <div
        className="absolute bottom-0 h-2 inset-x-0 cursor-ns-resize"
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
      />
    </div>
  )
}

const events: MyEventProps[] = [
  {
    id: '0',
    title: 'I can be resized!',
    start: new Date(new Date().setHours(4, 0, 0, 0)),
    end: new Date(new Date().setHours(8, 0, 0, 0)),
    className: 'bg-lime-500 text-white',
  },
]

export const ResizeInvisibleHandle: Story = {
  render: () => {

    const [startDate, setStartDate] = useState(subDays(new Date(), 1))
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
        days={5}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-screen select-none"
              style={{
                gridTemplateColumns: '60px repeat(5, 1fr)',
                gridTemplateRows: 'min-content 1fr'
              }}
            >
              <div />
              <Columns>
                {({ date, key }) => (
                  <div key={key} className="text-center">
                    {format(date, 'ccc d')}
                  </div>
                )}
              </Columns>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-1 row-start-2 relative"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => (
                      <div
                        key={hour}
                        className="text-slate-300 absolute right-2"
                        style={{ top: top - 14 }}
                      >
                        {hour} hs
                      </div>
                    ))}
                  </div>
                )}
              </Ticks>
              <Columns>
                {({ date, key }) => (
                  <Day
                    key={key}
                    date={date}
                  >
                    {({ containerRef, events }) => (
                      <div
                        ref={containerRef}
                        className="relative h-full row-start-2"
                        style={{ gridColumnStart: Number(key) + 2 }}
                      >
                        {events.map(({ event, top, bottom, startsBeforeToday, endsAfterToday }) => {
                          const myEvent = event as MyEventProps
                          return (
                            <Event
                              key={myEvent.id}
                              {...myEvent}
                              top={top}
                              bottom={bottom}
                              onChange={handleEventChange}
                              startsBeforeToday={startsBeforeToday}
                              endsAfterToday={endsAfterToday}
                            />
                          )
                        })}
                      </div>
                    )}
                  </Day>
                )}
              </Columns>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-2 col-span-5 row-start-2 row-end-2 -z-10 relative"
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
