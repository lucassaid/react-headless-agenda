import type { Meta, StoryObj } from '@storybook/react'
import { Day, Ticks, Needle } from '../src'
import { format } from 'date-fns'

const meta: Meta<typeof Needle> = {
  tags: ['autodocs'],
  title: 'Components/Needle',
  component: Needle,
}

export default meta
type Story = StoryObj<typeof Needle>

export const BasicNeedle: Story = {
  render: () => (
    <Needle>
      {({ top }) => (
        <div
          className="absolute bg-blue-500 p-0.5"
          style={{ top }}
        >
          Render your own needle! Use position: absolute, and pass the provided `top` property
          <br />
          It will move every minute to match with your local time
        </div>
      )}
    </Needle>
  )
}

export const WithTicks: Story = {
  render: () => (
    <div className="flex">
      <Ticks>
        {({ containerRef, ticks }) => (
          <div
            className="col-start-1 row-start-2 relative h-[700px]"
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
      <Day date={new Date()}>
        {({ containerRef }) => (
          <div
            ref={containerRef}
            className="relative flex-1"
          >
            <Needle>
              {({ top }) => (
                <div
                  className="cursor-pointer absolute bg-blue-500 p-0.5 w-full h-2 transition-all hover:h-10 overflow-hidden text-white"
                  style={{ top }}
                >
                  It is {format(new Date(), 'HH:mm')} in case you wonder
                </div>
              )}
            </Needle>
          </div>
        )}
      </Day>
    </div>
  )
}