/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks, mouseEventToDate } from '../../src'
import { addDays, addHours, format, roundToNearestMinutes, startOfWeek, subMinutes } from 'date-fns'
import { MouseEvent, useState } from 'react'
import { Needle } from '../../src'
import { BaseAgendaEvent } from '../../src/context'

const meta: Meta<typeof Agenda> = {
  title: 'Interaction/add-events/WithGhost',
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
  return (
    <div
      className={`absolute w-full p-4 rounded-lg ${className}`}
      style={{ top, bottom }}
    >
      {title}
      <br />
      <small>
        {format(start, 'HH:mm')}
        &nbsp;-&nbsp;
        {format(end, 'HH:mm')}
      </small>
    </div>
  )
}

const initialEvents: MyEventProps[] = [
  {
    id: '0',
    title: 'Event 1',
    start: addDays(new Date(new Date().setHours(5, 0, 0, 0)), -1),
    end: addDays(new Date(new Date().setHours(12, 0, 0, 0)), -1),
    className: 'bg-blue-500 text-white',
  },
  {
    id: '0',
    title: 'Event 2',
    start: addDays(new Date(new Date().setHours(19, 0, 0, 0)), 1),
    end: addDays(new Date(new Date().setHours(5, 0, 0, 0)), 2),
    className: 'bg-lime-500 text-white',
  }
]

export const WithGhost: Story = {
  render: () => {

    const [ghostEvent, setGhostEvent] = useState<MyEventProps | null>(null)
    const [events, setEvents] = useState(initialEvents)

    /**
     * gets a mouse move or a click event, and returns its corresponding date and time
     * It also needs `Date` to know the day of the week
     */
    const dateFromMoveOrClick = (e: MouseEvent<HTMLElement>, date: Date) => {
      const dateFromEvent = mouseEventToDate(e, date) // the exact date and time of the event
      const dateWithMargin = subMinutes(dateFromEvent, 60) // little margin to the top for a nicer experience
      return roundToNearestMinutes(dateWithMargin, { nearestTo: 30 }) // round to the nearest 30 minutes

      // you can rewrite this function to:
      // return mouseEventToDate(e, date)
      // By doing so, the event will place exactly where your cursor is
    }

    const handleMouseMove = (e: MouseEvent<HTMLElement>, date: Date) => {
      const ghostDate = dateFromMoveOrClick(e, date)
      setGhostEvent({
        id: 'ghost',
        title: 'New Event',
        start: ghostDate,
        end: addHours(ghostDate, 3),
        className: 'bg-slate-200 z-0 opacity-70',
      })
    }

    const handleClick = (e: MouseEvent<HTMLElement>, date: Date) => {
      const newEventDate = dateFromMoveOrClick(e, date)
      setEvents(currEvents => [
        ...events,
        {
          id: (currEvents.length + 1).toString(),
          title: `New Event ${currEvents.length + 1}`,
          start: newEventDate,
          end: addHours(newEventDate, 3),
          className: 'bg-amber-500 text-white z-10',
        }
      ])
    }

    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={[
          ...events,
          ...(ghostEvent ? [ghostEvent] : []),
        ]}
        days={5}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-[700px]"
              style={{
                gridTemplateColumns: '60px repeat(5, 1fr)',
                gridTemplateRows: 'min-content 1fr'
              }}
            >
              <div />
              <Days>
                {({ date, key }) => (
                  <div key={key} className="text-center">
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
                        className="text-slate-300 absolute right-2"
                        style={{ top: top - 14 }}
                      >
                        {hour} hs
                      </div>
                    ))}
                  </div>
                )}
              </Ticks>
              <Days>
                {({ date, key, containerRef, events }) => (
                  <div
                    key={key}
                    ref={containerRef}
                    className="relative h-full row-start-2 cursor-pointer z-10"
                    style={{ gridColumnStart: Number(key) + 2 }}
                    onMouseMove={e => handleMouseMove(e, date)}
                    onMouseLeave={() => setGhostEvent(null)}
                    onClick={e => handleClick(e, date)}
                  >
                    {events.map(({ event, top, bottom }) => {
                      const myEvent = event as MyEventProps
                      return (
                        <Event key={myEvent.title} {...myEvent} top={top} bottom={bottom} />
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
              </Days>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-2 col-span-5 row-start-2 row-end-2 relative"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => (
                      <div
                        key={hour}
                        className="opacity-20 h-0.5 bg-slate-300 absolute right-0 -left-4"
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
