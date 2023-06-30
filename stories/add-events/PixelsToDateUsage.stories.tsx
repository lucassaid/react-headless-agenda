/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks, mouseEventToDate } from '../../src'
import { MouseEvent } from 'react'

const meta: Meta<typeof Agenda> = {
  title: 'Interaction/add-events/PixelsToDateUsage',
  component: Agenda,
}

export default meta
type Story = StoryObj<typeof Agenda>

export const PixelsToDateUsage: Story = {
  render: () => {

    const handleClick = (e: MouseEvent<HTMLElement>, date: Date) => {
      alert(`User clicked at: ${mouseEventToDate(e, date).toString()}`)
    }

    return (
      <Agenda startDate={new Date()} events={[]} days={1} >
        {() => (
          <div className="grid h-[500px] grid-cols-1" >
            <Days>
              {({ date, key, containerRef }) => (
                <div
                  key={key}
                  ref={containerRef}
                  className="relative h-full row-start-1 col-start-1 cursor-pointer z-10"
                  onClick={e => handleClick(e, date)}
                />
              )}
            </Days>
            <Ticks>
              {({ containerRef, ticks }) => (
                <div
                  className="col-start-1 col-span-1 row-start-1 relative"
                  ref={containerRef}
                >
                  {ticks.map(({ hour, top }) => (
                    <div
                      key={hour}
                      className="opacity-30 h-0.5 bg-slate-300 absolute right-0 left-0"
                      style={{ top }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
              )}
            </Ticks>
          </div>
        )}
      </Agenda>
    )
  },
}
