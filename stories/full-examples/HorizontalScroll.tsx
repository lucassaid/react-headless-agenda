/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks } from '../../src'
import { addDays, format, startOfWeek } from 'date-fns'
import { useState } from 'react'
import { Needle } from '../../src'
import { BaseAgendaEvent } from '../../src/context'

const meta: Meta<typeof Agenda> = {
  title: 'Examples/Basic',
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
  { title, top, bottom, className, start, end }: MyEventProps & { top: number, bottom: number }
) => (
  <div
    className={`absolute w-full p-4 rounded-lg ${className}`}
    style={{ top, bottom }}
  >
    {title}
    <br />
    <small>
      {format(start, 'EEEE HH:mm')}<br />
      ↓<br />
      {format(end, 'EEEE HH:mm')}
    </small>
  </div>
)

const events: MyEventProps[] = [
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

export const Basic: Story = {
  render: () => {

    const [startDate, setStartDate] = useState(startOfWeek(new Date()))

    return (
      <Agenda
        startDate={startDate}
        onStartDateChange={setStartDate}
        events={events}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-screen"
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
                {({ date, containerRef, events }) => (
                  <div
                    key={date.toString()}
                    ref={containerRef}
                    className="relative h-full row-start-2"
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
            </div>
          </>
        )}
      </Agenda>
    )
  },
}
