/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks, useResize } from '../../src'
import { differenceInMinutes, format, startOfWeek } from 'date-fns'
import { useCallback, useState } from 'react'
import { BaseAgendaEvent } from '../../src/context'

const meta: Meta<typeof Agenda> = {
  title: 'Interaction/drag-and-resize/TimeResponsive',
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

  const { handleDragStart, handleDrag } = useResize(id)
  const duration = differenceInMinutes(end, start)
  const isShort = duration < 180

  return (
    <div
      id={id}
      key={id}
      tabIndex={-1}
      className={`
        absolute w-full  rounded-lg select-none ${className}
        ${isShort ? 'bg-red-500 p-3' : 'bg-lime-500 p-4'}
      `}
      style={{ top, bottom }}
    >
      <div className={
        isShort ? 'flex justify-between items-center' : ''
      }>
        {title}
        <br />
        <small>
          {format(start, 'HH:mm')}
          &nbsp;-&nbsp;
          {format(end, 'HH:mm')}
        </small>
      </div>

      <div
        className="absolute bottom-2 bg-red-500 inset-x-2 left-2 rounded-md text-center text-xs cursor-ns-resize"
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
      >
        {isShort ? 'Ok that\'s enough' : 'Drag me to the top!'}
      </div>
    </div>
  )
}

const events: MyEventProps[] = [
  {
    id: '0',
    title: 'Event 1',
    start: new Date(new Date().setHours(4, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    className: 'bg-lime-500 text-white',
  },
]

export const TimeResponsive: Story = {
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
