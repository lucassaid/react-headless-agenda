/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks } from '../../src'
import { addDays, format, setHours, startOfWeek, subDays } from 'date-fns'
import { useState } from 'react'
import { Needle } from '../../src'
import { BaseAgendaEvent } from '../../src/context'
import { AgendaChildrenProps } from '../../src/Agenda'

const meta: Meta<typeof Agenda> = {
  title: 'Examples/Navigation',
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

const firstStart = startOfWeek(new Date())

const events: MyEventProps[] = [
  {
    id: '0',
    title: 'Event 1',
    start: setHours(firstStart, 12),
    end: setHours(firstStart, 18),
    className: 'bg-amber-500 text-white',
  },
  {
    id: '1',
    title: 'Event 2',
    start: setHours(addDays(firstStart, 1), 8),
    end: setHours(addDays(firstStart, 1), 13),
    className: 'bg-blue-500 text-white',
  },
  {
    id: '2',
    title: 'Event 3',
    start: setHours(addDays(firstStart, 3), 17),
    end: setHours(addDays(firstStart, 4), 4),
    className: 'bg-lime-500 text-white',
  },
]

interface NavigationProps extends AgendaChildrenProps {
  setDate: (days: Date) => void
  setDays: (days: number) => void
  startDate: Date
  endDate: Date
  days: number
}

function NavigationBar({
  prev,
  next,
  endDate,
  startDate,
  setDate,
  setDays,
  days,
}: NavigationProps) {

  const handleTodayClick = () => {
    if (days === 1) {
      setDate(new Date())
    }
    if (days === 3) {
      setDate(subDays(new Date(), 1))
    }
    setDate(startOfWeek(new Date()))
  }

  return (
    <div className="flex justify-between items-center mb-10 max-w-lg mx-auto">
      <button onClick={handleTodayClick} >
        Today
      </button>
      <div className="flex items-center gap-x-5">
        <button onClick={prev} >{'<'}</button>
        <h5>
          {format(startDate, 'd/M')}
          &nbsp; - &nbsp;
          {format(endDate, 'd/M')}
        </h5>
        <button onClick={next} >{'>'}</button>
      </div>
      <div className="space-x-3">
        <button onClick={() => setDays(1)}>
          Day
        </button>
        <button onClick={() => setDays(3)} >
          3 Days
        </button>
        <button onClick={() => setDays(7)} >
          Week
        </button>
      </div>
    </div>
  )
}

export const Navigation: Story = {
  render: () => {

    const [startDate, setStartDate] = useState(startOfWeek(new Date()))
    const [days, setDays] = useState(7)

    return (
      <Agenda
        startDate={startDate}
        onStartDateChange={setStartDate}
        events={events}
        days={days}
      >
        {({ prev, next, endDate }) => (
          <>
            <NavigationBar
              days={days}
              prev={prev}
              next={next}
              startDate={startDate}
              endDate={endDate}
              setDate={setStartDate}
              setDays={setDays}
            />
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `60px repeat(${days}, 1fr)`,
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
            </div>
            <br />
            <div
              className="grid gap-4 overflow-y-scroll"
              style={{
                gridTemplateColumns: `60px repeat(${days}, 1fr)`,
                height: 'calc(100vh - 200px)',
              }}
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
              <Days>
                {({ key, containerRef, events }) => (
                  <div
                    key={key}
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
              </Days>
            </div>
          </>
        )}
      </Agenda>
    )
  }
}