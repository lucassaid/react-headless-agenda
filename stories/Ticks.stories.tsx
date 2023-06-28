import type { Meta, StoryObj } from '@storybook/react'
import { Ticks, dateToPixels } from '../src'
import { useCallback } from 'react'
import { setHours } from 'date-fns'

const meta: Meta<typeof Ticks> = {
  title: 'Components/Ticks',
  component: Ticks,
}

export default meta
type Story = StoryObj<typeof Ticks>

export const ForHours: Story = {
  render: () => (
    <Ticks>
      {({ containerRef, ticks }) => (
        <div
          className="relative h-[700px]"
          ref={containerRef}
        >
          {ticks.map(({ hour, top }) => (
            <div
              key={hour}
              className="text-slate-300 absolute"
              style={{ top: top - 14 }}
            >
              {hour} hs
            </div>
          ))}
        </div>
      )}
    </Ticks>
  )
}

export const ForHorizontalLines: Story = {
  render: () => (
    <Ticks>
      {({ containerRef, ticks }) => (
        <div
          className="relative h-[700px]"
          ref={containerRef}
        >
          {ticks.map(({ hour, top }) => (
            <div
              key={hour}
              className="h-0.5 bg-slate-100 absolute w-full"
              style={{ top }}
            />
          ))}
        </div>
      )}
    </Ticks>
  )
}