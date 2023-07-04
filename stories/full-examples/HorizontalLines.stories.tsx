/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks } from '../../src'
import { format } from 'date-fns'

const meta: Meta<typeof Agenda> = {
  title: 'Examples/HorizontalLines',
  component: Agenda,
}

export default meta
type Story = StoryObj<typeof Agenda>

export const HorizontalLines: Story = {
  render: () => (
    <Agenda
      startDate={new Date()}
      events={[]}
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
            <Ticks>
              {({ containerRef, ticks }) => (
                <div
                  className="col-start-2 col-span-7 row-start-2 row-end-2 -z-10 relative"
                  ref={containerRef}
                >
                  {ticks.map(({ hour, top }) => (
                    <div
                      key={hour}
                      className="opacity-30 h-0.5 bg-slate-300 absolute right-0 -left-4"
                      style={{ top }}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </div>
        </>
      )}
    </Agenda>
  )
}
