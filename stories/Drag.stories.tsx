/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Columns, Day, Ticks } from '../src'
import { addDays, addHours, format, startOfWeek, subHours } from 'date-fns'
import { useCallback, useState } from 'react'
import { Needle } from '../src'
import { BaseAgendaEvent } from '../src/context'
import { useDragEvent } from '../src/utils'

const meta: Meta<typeof Agenda> = {
  title: 'Drag And Resize/DragOnly',
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
        {format(start, 'EEEEEE HH:mm')}
        &nbsp;-&nbsp;
        {format(end, 'EEEEEE HH:mm')}
      </small>
    </div>
  )
}

const events: MyEventProps[] = [
  {
    id: '0',
    title: 'Event 1',
    start: subHours(new Date(), 2),
    end: addHours(new Date(), 40),
    className: 'bg-lime-500 text-white',
  },
  {
    id: '1',
    title: 'Event 2',
    start: addDays(subHours(new Date(), 2), 1),
    end: addDays(addHours(new Date(), 5), 1),
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
              className="grid gap-4 h-screen select-none"
              style={{
                gridTemplateColumns: '60px repeat(7, 1fr)',
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
                              className="absolute h-1 bg-red-400 z-40 w-full"
                              style={{ top }}
                            />
                          )}
                        </Needle>
                      </div>
                    )}
                  </Day>
                )}
              </Columns>
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
