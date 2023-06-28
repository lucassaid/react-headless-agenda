/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Columns, Day, Ticks, dateToPixels } from '../src'
import { format, startOfWeek, subHours, subMinutes } from 'date-fns'
import { useCallback } from 'react'
import { Needle } from '../src'
import { BaseAgendaEvent } from '../src/context'

const meta: Meta<typeof Agenda> = {
  title: 'Examples/Scroll',
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
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(13, 0, 0, 0)),
    className: 'bg-blue-500 text-white',
  }
]

export const Scroll: Story = {
  render: () => {
    /**
     * Scroll to some specific time on mount
     * In this case we use the start of the event
     */
    const scrollAreaRef = useCallback((node: HTMLDivElement) => {
      if (node) {
        const dateToScrollTo = subHours(events[0].start, 1) // some margin at the top
        const top = dateToPixels(dateToScrollTo, node.scrollHeight)
        node.scrollTo({ top, behavior: 'smooth' })
      }
    }, [])

    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={events}
      >
        {() => (
          <>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: '60px repeat(7, 1fr)',
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
            </div>
            <hr className="mt-4" />
            <div
              className="grid gap-4 h-80 overflow-y-scroll"
              style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
              ref={scrollAreaRef}
            >
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-1 row-start-1 relative h-screen"
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
                        className="relative h-full"
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
