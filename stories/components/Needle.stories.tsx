import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Ticks, Needle, Days } from '../../src'
import { format, startOfWeek } from 'date-fns'

const meta: Meta<typeof Needle> = {
  title: 'Components/Needle',
  component: Needle,
}

export default meta
type Story = StoryObj<typeof Needle>

export const Basic: Story = {
  render: () => (
    <Agenda
      startDate={startOfWeek(new Date())}
      events={[]}
    >
      {() => (
        <>
          <div
            className="grid gap-4 h-[600px]"
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
                      className="text-slate-300 absolute right-2 text-sm"
                      style={{ top: top - 10 }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
              )}
            </Ticks>
            <Days>
              {({ date, containerRef }) => (
                <div
                  key={date.toString()}
                  ref={containerRef}
                  className="relative h-full row-start-2"
                >
                  <Needle>
                    {({ top }) => (
                      <div
                        className="absolute h-0.5 bg-red-400 w-full"
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

export const Elegant: Story = {
  render: () => (
    <Agenda
      startDate={startOfWeek(new Date())}
      events={[]}
    >
      {() => (
        <>
          <div
            className="grid gap-4 h-[600px]"
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
                      className="text-slate-300 absolute right-2 text-sm"
                      style={{ top: top - 10 }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
              )}
            </Ticks>
            <Days>
              {({ date, containerRef }) => (
                <div
                  key={date.toString()}
                  ref={containerRef}
                  className="relative h-full row-start-2"
                >
                  <Needle>
                    {({ top }) => (
                      <div
                        className="needle"
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

export const WithInteraction: Story = {
  render: () => (
    <Agenda
      startDate={startOfWeek(new Date())}
      events={[]}
    >
      {() => (
        <>
          <div
            className="grid gap-4 h-[600px]"
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
                      className="text-slate-300 absolute right-2 text-sm"
                      style={{ top: top - 10 }}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
              )}
            </Ticks>
            <Days>
              {({ date, containerRef }) => (
                <div
                  key={date.toString()}
                  ref={containerRef}
                  className="relative h-full row-start-2"
                >
                  <Needle>
                    {({ top }) => (
                      <div
                        className="rounded cursor-pointer absolute bg-blue-500 p-0.5 w-full h-2 transition-all hover:h-8 overflow-hidden text-white z-40 text-center"
                        style={{ top }}
                      >
                        It{'\''}s {format(new Date(), 'HH:mm')}!! 🎉 &nbsp;&nbsp; (?)
                      </div>
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
