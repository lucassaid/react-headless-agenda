/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Columns, Day, Ticks } from '../src'
import { addHours, format, subHours } from 'date-fns'
import { useState } from 'react'
import { Needle } from '../src'
import { BaseAgendaEvent } from '../src/context'

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
      {format(start, 'HH:mm')}
      &nbsp;-&nbsp;
      {format(end, 'HH:mm')}
    </small>
  </div>
)

const events: MyEventProps[] = [
  {
    id: '0',
    title: 'Event 1',
    start: subHours(new Date(), 2),
    end: addHours(new Date(), 5),
    className: 'bg-blue-500 text-white',
  }
]

export const Basic: Story = {
  render: () => {

    const [startDate, setStartDate] = useState(new Date())

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
                  <Day key={key} date={date} >
                    {({ containerRef, events }) => (
                      <div
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
                  </Day>
                )}
              </Columns>
            </div>
          </>
        )}
      </Agenda>
    )
  },
}