import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Day } from '../../src'
import { format, setHours } from 'date-fns'

const meta: Meta<typeof Day> = {
  title: 'Components/Day',
  component: Day,
}

export default meta
type Story = StoryObj<typeof Day>

const event = {
  id: '1',
  title: 'Event 1',
  start: setHours(new Date(), 4),
  end: setHours(new Date(), 10),
}

export const BasicDay: Story = {
  render: () => (
    <Agenda events={[event]} >
      {() => (
        <Day date={new Date()}>
          {({ containerRef, events }) => (
            <div
              ref={containerRef}
              className="relative h-80 text-orange-400 border border-orange-400 rounded-md p-3 max-w-sm"
            >
              day container
              {events.map(({ event, top, bottom }) => (
                <div
                  key={event.title}
                  className="absolute inset-x-3 p-4 rounded-lg bg-lime-500 text-white"
                  style={{ top, bottom }}
                >
                  {event.title}
                  <br />
                  <small>
                    {format(event.start, 'HH:mm')}
                    &nbsp;-&nbsp;
                    {format(event.end, 'HH:mm')}
                  </small>
                </div>
              ))}
            </div>
          )}
        </Day>
      )}
    </Agenda>
  ),
}


