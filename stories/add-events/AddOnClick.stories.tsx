/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks, mouseEventToDate } from '../../src'
import { addHours, startOfWeek } from 'date-fns'
import { MouseEvent, useState } from 'react'

const meta: Meta<typeof Agenda> = {
  title: 'Interaction/add-events/AddOnClick',
  component: Agenda,
}

export default meta
type Story = StoryObj<typeof Agenda>

interface MyEventProps {
  id: string
  title: string
  start: Date
  end: Date
  className?: string
}

export const AddOnClick: Story = {
  render: () => {

    const [events, setEvents] = useState<MyEventProps[]>([])

    const handleClick = (e: MouseEvent<HTMLElement>, date: Date) => {
      const clickedDate = mouseEventToDate(e, date)
      setEvents(prev => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          title: `New Event ${(prev.length + 1).toString()}`,
          start: clickedDate,
          end: addHours(clickedDate, 3),
          className: 'bg-blue-500 text-white',
        }
      ])
    }

    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={events}
        days={1}
      >
        {() => (
          <div className="grid h-[500px] grid-cols-1" >
            <Days>
              {({ date, key, containerRef, events }) => (
                <div
                  key={key}
                  ref={containerRef}
                  className="relative h-full row-start-1 col-start-1 cursor-pointer z-10"
                  onClick={e => handleClick(e, date)}
                >
                  {events.map(({ event, top, bottom }) => (
                    <div
                      key={event.id}
                      className={`absolute p-4 rounded-lg shadow-lg ${event.className}`}
                      style={{
                        top,
                        bottom,
                      }}
                    >
                      {event.title}
                      <br />
                      <small>
                        {event.start.toLocaleTimeString()}
                        &nbsp;-&nbsp;
                        {event.end.toLocaleTimeString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </Days>
            <Ticks>
              {({ containerRef, ticks }) => (
                <div
                  className="col-start-1 col-span-1 row-start-1 relative"
                  ref={containerRef}
                >
                  {ticks.map(({ hour, top }) => (
                    <div
                      key={hour}
                      className="opacity-30 h-0.5 bg-slate-300 absolute right-0 left-0"
                      style={{ top }}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </div>
        )}
      </Agenda>
    )
  },
}
