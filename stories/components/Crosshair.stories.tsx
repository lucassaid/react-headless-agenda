/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Days, Ticks, Crosshair } from '../../src'
import { format, startOfWeek } from 'date-fns'

const meta: Meta<typeof Agenda> = {
  title: 'Components/Crosshair',
  component: Agenda,
}

export default meta
type Story = StoryObj<typeof Agenda>

export const WithTime: Story = {
  render: () => {
    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={[]}
        days={5}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-[700px] select-none"
              style={{
                gridTemplateColumns: '60px repeat(5, 1fr)',
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
              <Days>
                {({ date, containerRef, events, index }) => (
                  <div
                    key={date.toString()}
                    ref={containerRef}
                    className="relative h-full row-start-2 cursor-crosshair z-10"
                    style={{ gridColumnStart: index + 2 }}
                  >
                    {events.map(({ event, top, bottom }) => (
                      <div
                        key={event.id}
                        className={`absolute w-full p-4 pb-0 rounded-lg overflow-hidden ${event.className}`}
                        style={{ top, bottom }}
                      >
                        {event.title}
                      </div>
                    ))}
                    <Crosshair>
                      {({ top, date }) => (
                        <div
                          className="absolute h-0.5 bg-slate-300 z-40 w-full"
                          style={{ top }}
                        >
                          <small className="text-slate-500">
                            {format(date, 'HH:mm')}
                          </small>
                        </div>
                      )}
                    </Crosshair>
                  </div>
                )}
              </Days>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-2 col-span-5 row-start-2 row-end-2 relative"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => (
                      <div
                        key={hour}
                        className="opacity-10 h-0.5 bg-slate-300 absolute right-0 -left-4"
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
  },
}

export const Dashed: Story = {
  render: () => {
    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={[]}
        days={5}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-[700px] select-none"
              style={{
                gridTemplateColumns: '60px repeat(5, 1fr)',
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
              <Days>
                {({ date, containerRef, events, index }) => (
                  <div
                    key={date.toString()}
                    ref={containerRef}
                    className="relative h-full row-start-2 cursor-crosshair z-10"
                    style={{ gridColumnStart: index + 2 }}
                  >
                    {events.map(({ event, top, bottom }) => (
                      <div
                        key={event.id}
                        className={`absolute w-full p-4 pb-0 rounded-lg overflow-hidden ${event.className}`}
                        style={{ top, bottom }}
                      >
                        {event.title}
                      </div>
                    ))}
                    <Crosshair>
                      {({ top }) => (
                        <div
                          className="absolute border-b-2 border-dotted border-slate-500 z-40 w-full border-collapse"
                          style={{ top }}
                        />
                      )}
                    </Crosshair>
                  </div>
                )}
              </Days>
            </div>
          </>
        )}
      </Agenda>
    )
  },
}

export const RoundedMinutes: Story = {
  render: () => {
    return (
      <Agenda
        startDate={startOfWeek(new Date())}
        events={[]}
        days={5}
      >
        {() => (
          <>
            <div
              className="grid gap-4 h-[700px] select-none"
              style={{
                gridTemplateColumns: '60px repeat(5, 1fr)',
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
              <Days>
                {({ date, containerRef, events, index }) => (
                  <div
                    key={date.toString()}
                    ref={containerRef}
                    className="relative h-full row-start-2 cursor-crosshair z-10"
                    style={{ gridColumnStart: index + 2 }}
                  >
                    {events.map(({ event, top, bottom }) => (
                      <div
                        key={event.id}
                        className={`absolute w-full p-4 pb-0 rounded-lg overflow-hidden ${event.className}`}
                        style={{ top, bottom }}
                      >
                        {event.title}
                      </div>
                    ))}
                    <Crosshair roundMinutes={30}>
                      {({ top, date }) => (
                        <div
                          className="absolute h-0.5 bg-slate-300 z-40 w-full"
                          style={{ top }}
                        >
                          <small className="text-slate-500">
                            {format(date, 'HH:mm')}
                          </small>
                        </div>
                      )}
                    </Crosshair>
                  </div>
                )}
              </Days>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-2 col-span-5 row-start-2 row-end-2 relative"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => (
                      <div
                        key={hour}
                        className="opacity-10 h-0.5 bg-slate-300 absolute right-0 -left-4"
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
  },
}