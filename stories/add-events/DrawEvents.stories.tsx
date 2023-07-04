/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks, mouseEventToDate } from '../../src'
import { addMinutes, format, roundToNearestMinutes, startOfWeek } from 'date-fns'
import { MouseEvent, useRef, useState } from 'react'
import { Needle, Crosshair } from '../../src'
import { BaseAgendaEvent } from '../../src/context'

const meta: Meta<typeof Agenda> = {
  title: 'Interaction/add-events/DrawEvents',
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
      className={`absolute w-full p-4 pb-0 rounded-lg overflow-hidden ${className}`}
      style={{ top, bottom }}
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

export const DrawEvents: Story = {
  render: () => {

    const mouseDown = useRef(false)
    const [events, setEvents] = useState<MyEventProps[]>([])

    const handleMouseMove = (e: MouseEvent<HTMLElement>, date: Date) => {
      if (!mouseDown.current) return

      // update last event
      const DateFromMove = mouseEventToDate(e, date) // exact at cursor position
      const lastEvent = events[events.length - 1] // we'll update the event just created on mouse down
      const minDate = addMinutes(lastEvent.start, 10) // prevent an invalid range of dates
      const newEnd = DateFromMove > minDate ? DateFromMove : minDate // the end will be the current position of the cursor
      setEvents(currEvents => {
        const newEvents = [...currEvents]
        newEvents[newEvents.length - 1].end = newEnd
        return newEvents
      })
    }

    const handleMouseDown = (e: MouseEvent<HTMLElement>, date: Date) => {
      const DateFromEvent = mouseEventToDate(e, date)
      setEvents(currEvents => [
        ...events,
        {
          id: (currEvents.length + 1).toString(),
          title: `New Event ${currEvents.length + 1}`,
          start: DateFromEvent,
          end: addMinutes(DateFromEvent, 10),
          className: 'bg-amber-500 text-white z-10',
        }
      ])
      mouseDown.current = true
    }

    const handleMouseUp = () => {
      mouseDown.current = false
    }

    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={events}
        days={5}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-[700px] select-none"
              style={{
                gridTemplateColumns: '60px repeat(5, 1fr)',
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
                {({ date, containerRef, events, index }) => (
                  <div
                    key={date.toString()}
                    ref={containerRef}
                    className="relative h-full row-start-2 cursor-crosshair z-10"
                    style={{ gridColumnStart: index + 2 }}
                    onMouseMove={e => handleMouseMove(e, date)}
                    onMouseDown={e => handleMouseDown(e, date)}
                    onMouseUp={handleMouseUp}
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
                    <Crosshair>
                      {({ top, date }) => (
                        <div
                          className="absolute h-0.5 bg-slate-300 z-40 w-full"
                          style={{ top }}
                        >
                          <small className="text-slate-500">
                            {format(date, 'HH:mm')}
                          </small>
                        </div>
                      )}
                    </Crosshair>
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
