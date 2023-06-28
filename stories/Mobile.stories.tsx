/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Columns, Day, Needle, Ticks } from '../src'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { BaseAgendaEvent } from '../src/context'

const meta: Meta<typeof Agenda> = {
  title: 'Examples/Mobile',
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
    onDrag={e => {
      console.log('dragging', e)
      e.preventDefault()
    }}
    draggable
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
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(16, 0, 0, 0)),
    className: 'bg-blue-500 text-white',
  }
]

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2'
    }
  },
  render: () => {

    useEffect(() => {
      // scroll to today
      const id = format(new Date(), 'EEEE d')
      const element = document.getElementById(id)
      element?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    return (
      <Agenda events={events} >
        {() => (
          <Columns>
            {({ date, key }) => (
              <Day key={key} date={date} >
                {({ containerRef, events }) => (
                  <div>
                    <h4
                      className="mt-4 mb-2"
                      id={format(date, 'EEEE d')}
                    >
                      {format(date, 'EEEE d')}
                    </h4>
                    <div
                      ref={containerRef}
                      className="flex gap-x-3"
                    >
                      <Ticks>
                        {({ containerRef, ticks }) => (
                          <div
                            className="col-start-1 row-start-2 relative h-[500px] w-12"
                            ref={containerRef}
                          >
                            {ticks.map(({ hour, top }) => (
                              <div
                                key={hour}
                                className="text-slate-300 absolute right-2 text-xs"
                                style={{ top }}
                              >
                                {hour} hs
                              </div>
                            ))}
                          </div>
                        )}
                      </Ticks>
                      <div className="flex-1 relative">
                        {events.map(({ event, top, bottom }) => {
                          const myEvent = event as MyEventProps
                          return (
                            <Event
                              key={myEvent.id}
                              top={top}
                              bottom={bottom}
                              {...myEvent}
                            />
                          )
                        })}
                        <Needle>
                          {({ top }) => (
                            <div
                              className="absolute inset-x-0 h-0.5 bg-red-500"
                              style={{ top }}
                            />
                          )}
                        </Needle>
                      </div>
                    </div>
                  </div>
                )}
              </Day>
            )}
          </Columns>
        )}
      </Agenda >
    )
  }
}