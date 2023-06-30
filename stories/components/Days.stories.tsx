import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days } from '../../src'
import { format, setHours } from 'date-fns'

const meta: Meta<typeof Days> = {
  title: 'Components/Days',
  component: Days,
}

export default meta
type Story = StoryObj<typeof Days>

export const AgendaHeader: Story = {
  render: () => (
    <Agenda events={[]} >
      {() => (
        <div className="flex max-w-lg">
          <Days>
            {({ date, key }) => (
              <div key={key} className="flex-1 center">
                {format(date, 'ccc d')}
              </div>
            )}
          </Days>
        </div>
      )}
    </Agenda>
  ),
}

export const RenderingEvents: Story = {
  render: () => {

    const event = {
      id: '1',
      title: 'Event 1',
      start: setHours(new Date(), 4),
      end: setHours(new Date(), 10),
    }

    return (
      <Agenda events={[event]} >
        {() => (
          <div className="flex gap-x-3">
            <Days>
              {({ key, containerRef, events }) => (
                <div
                  key={key}
                  ref={containerRef}
                  className="relative h-80 text-orange-400 border border-orange-400 rounded-md p-3 flex-1 text-sm"
                >
                  Day container
                  {events.map(({ event, top, bottom }) => (
                    <div
                      key={event.title}
                      className="absolute inset-x-3 p-2 rounded-md border border-lime-500 text-lime-600"
                      style={{ top, bottom }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )}
            </Days>
          </div>
        )}
      </Agenda>
    )
  },
}
