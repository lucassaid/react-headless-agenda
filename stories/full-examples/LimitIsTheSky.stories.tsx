/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Crosshair, Days, Ticks, useResize } from '../../src'
import { addDays, addMinutes, format, setHours, startOfWeek, subDays } from 'date-fns'
import { MouseEvent, useCallback, useRef, useState } from 'react'
import { Needle } from '../../src'
import { BaseAgendaEvent } from '../../src/context'
import { AgendaChildrenProps } from '../../src/Agenda'
import { mouseEventToDate, useDragEvent } from '../../src/utils'
import { ArrowsOutCardinal, CaretLeft, CaretRight, Eye, PaintBrushBroad, X } from 'phosphor-react'
import { ExtendedEventProps } from '../../src/types'

type Mode = 'view' | 'move' | 'paint'

const meta: Meta<typeof Agenda> = {
  title: 'Examples/LimitIsTheSky',
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
  {
    id,
    title,
    top,
    bottom,
    className,
    start,
    end,
    mode,
    onDelete,
    startsBeforeToday,
    endsAfterToday,
    isDragging,
  }: MyEventProps & ExtendedEventProps & { mode: Mode, onDelete: () => void }
) => {

  const { handleDragStart, handleDrag } = useResize(id)
  const { handleDragStart: handle2 } = useDragEvent(id)

  return (
    <div
      key={id}
      className={`
        absolute w-full p-4 rounded-lg
        ${className}
        ${{
          'view': 'opacity-90',
          'move': 'shadow-lg',
          'paint': '',
        }[mode]}
        ${startsBeforeToday ? 'rounded-t-none' : ''}
        ${endsAfterToday ? 'rounded-b-none' : ''}
        ${isDragging ? 'ring z-50' : mode === 'move' ? 'opacity-90' : ''}
      `}
      style={{ top, bottom }}
      draggable={mode === 'move'}
      onDragStart={handle2}
    >
      {title}
      <br />
      <small>
        {format(start, 'HH:mm')}
        &nbsp;-&nbsp;
        {format(end, 'HH:mm')}
      </small>

      {mode == 'move' && (
        <>
          {!endsAfterToday && (
            <div
              className="absolute bottom-2 h-2 bg-red-500 inset-x-2 left-2 rounded-md text-center text-xs cursor-ns-resize"
              draggable={mode === 'move'}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
            />
          )}
          {!startsBeforeToday && (
            <X
              size={22}
              className="absolute -top-2.5 -right-2.5 p-0.5 cursor-pointer rounded-full bg-slate-200 text-slate-500"
              onClick={onDelete}
              weight="bold"
            />
          )}
        </>
      )}
    </div>
  )
}

const firstStart = startOfWeek(new Date())

const initialEvents: MyEventProps[] = [
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
    <div className="flex justify-between items-center gap-x-16">
      <button onClick={handleTodayClick} >
        Today
      </button>
      <div className="flex items-center gap-x-3">
        <div onClick={prev} className="cursor-pointer border rounded-full p-1" >
          <CaretLeft size={20} weight="bold" />
        </div>
        <h5>
          {format(startDate, 'd/M')}
          &nbsp; - &nbsp;
          {format(endDate, 'd/M')}
        </h5>
        <div onClick={next} className="cursor-pointer border rounded-full p-1" >
          <CaretRight size={20} weight="bold" />
        </div>
      </div>
      <div className="flex gap-x-3">
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

function ModeButtons({ mode, setMode }: { mode: Mode, setMode: (mode: Mode) => void }) {
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setMode('view')}
        className={`
          flex items-center gap-x-2
          ${mode === 'view' ? 'bg-blue-500 text-white border-blue-500 ring hover:border-blue-500' : ''}
        `}
      >
        <Eye size={20} />
        View
      </button>
      <button
        onClick={() => setMode('move')}
        className={`
          flex items-center gap-x-2
          ${mode === 'move' ? 'bg-blue-500 text-white border-blue-500 ring hover:border-blue-500' : ''}
        `}
      >
        <ArrowsOutCardinal size={20} />
        Move
      </button>
      <button
        onClick={() => setMode('paint')}
        className={`
          flex items-center gap-x-2
          ${mode === 'paint' ? 'bg-blue-500 text-white border-blue-500 ring hover:border-blue-500' : ''}
        `}
      >
        <PaintBrushBroad size={20} />
        Paint
      </button>
    </div>
  )
}

export const LimitIsTheSky: Story = {
  render: () => {

    const [startDate, setStartDate] = useState(startOfWeek(new Date()))
    const [days, setDays] = useState(7)
    const [events, setEvents] = useState(initialEvents)
    const [mode, setMode] = useState<Mode>('view')
    const mouseDown = useRef(false)
    const [dragging, setDragging] = useState(false)

    const handleEventChange = useCallback((event: MyEventProps) => {
      setEvents(curr => curr.map(e => e.id === event.id ? event : e))
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>, date: Date) => {
      if (!mouseDown.current) return

      // update last event
      const DateFromMove = mouseEventToDate(e, date) // exact at cursor position
      const lastEvent = events[events.length - 1] // we'll update the event just created on mouse down
      const minDate = addMinutes(lastEvent.start, 10) // prevent an invalid range of dates
      const newEnd = DateFromMove > minDate ? DateFromMove : minDate // the end will be the current position of the cursor
      setEvents(currEvents => {
        const newEvents = [...currEvents]
        newEvents[newEvents.length - 1].end = newEnd
        return newEvents
      })
    }, [events])

    const handleMouseDown = useCallback((e: MouseEvent<HTMLElement>, date: Date) => {

      if (mode !== 'paint') return

      const DateFromEvent = mouseEventToDate(e, date)
      setEvents(currEvents => [
        ...events,
        {
          id: (currEvents.length + 1).toString(),
          title: `New Event ${currEvents.length + 1}`,
          start: DateFromEvent,
          end: addMinutes(DateFromEvent, 10),
          className: 'bg-red-400 text-white z-10',
        }
      ])
      mouseDown.current = true
    }, [events, mode])

    const handleMouseUp = useCallback(() => {
      mouseDown.current = false
    }, [])

    const handleDragStart = () => {
      setDragging(true)
    }

    return (
      <Agenda
        startDate={startDate}
        onStartDateChange={setStartDate}
        events={events}
        onEventChange={handleEventChange}
        days={days}
        onDragStart={handleDragStart}
        onDrop={() => setDragging(false)}
      >
        {({ prev, next, endDate }) => (
          <>
            <div className="flex items-center justify-between mb-6 w-10/12 mx-auto select-none">
              <NavigationBar
                days={days}
                prev={prev}
                next={next}
                startDate={startDate}
                endDate={endDate}
                setDate={setStartDate}
                setDays={setDays}
              />
              <ModeButtons
                mode={mode}
                setMode={setMode}
              />
            </div>
            <div
              className="grid gap-4 select-none border-b pb-2"
              style={{
                gridTemplateColumns: `60px repeat(${days}, 1fr)`,
              }}
            >
              <div />
              <Days>
                {({ date, key, events }) => (
                  <div key={key} className="text-center">
                    {format(date, 'ccc d')}
                    <br />
                    {events.length > 0 && (
                      <small className="text-slate-500">
                        {events.length > 1 ? `${events.length} events` : '1 event'}
                      </small>
                    )}
                  </div>
                )}
              </Days>
            </div>
            <div
              className="grid gap-4 select-none h-[700px] overflow-hidden"
              style={{
                gridTemplateColumns: `60px repeat(${days}, 1fr)`,
              }}
            >
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className="col-start-1 row-start-1 relative h-full"
                    ref={containerRef}
                  >
                    {ticks.map(({ hour, top }) => {
                      if (hour % 2 === 0) return null
                      return (
                        <div
                          key={hour}
                          className="text-slate-300 absolute right-2"
                          style={{ top: top - 14 }}
                        >
                          {hour}:00
                        </div>
                      )
                    })}
                  </div>
                )}
              </Ticks>
              <Ticks>
                {({ containerRef, ticks }) => (
                  <div
                    className={`
                      col-start-2 row-start-1 relative h-full transition-all
                      ${dragging ? 'bg-slate-100' : ''}
                    `}
                    ref={containerRef}
                    style={{
                      gridColumnEnd: `span ${days}`,
                    }}
                  >
                    {ticks.map(({ hour, top }) => {
                      if (hour === 0) return null
                      return (
                        <div
                          key={hour}
                          className={`
                            h-0.5 w-full absolute 
                            ${dragging ? 'bg-slate-200' : 'bg-slate-50'}
                          `}
                          style={{ top: top }}
                        />
                      )
                    })}
                  </div>
                )}
              </Ticks>
              <Days>
                {({ key, containerRef, events, date }) => (
                  <div
                    key={key}
                    ref={containerRef}
                    className={`
                      relative h-full row-start-1
                      ${{
                        'view': 'cursor-default',
                        'move': 'cursor-move',
                        'paint': 'cursor-crosshair',
                      }[mode]}
                    `}
                    style={{ gridColumnStart: Number(key) + 2 }}
                    onMouseMove={e => handleMouseMove(e, date)}
                    onMouseDown={e => handleMouseDown(e, date)}
                    onMouseUp={handleMouseUp}
                  >
                    {events.map(({ event, top, bottom, endsAfterToday, startsBeforeToday, isDragging }) => {
                      const myEvent = event as MyEventProps
                      return (
                        <Event
                          key={myEvent.title}
                          top={top}
                          bottom={bottom}
                          mode={mode}
                          onDelete={() => setEvents(curr => curr.filter(e => e.id !== myEvent.id))}
                          startsBeforeToday={startsBeforeToday}
                          endsAfterToday={endsAfterToday}
                          isDragging={isDragging}
                          {...myEvent}
                        />
                      )
                    })}
                    <Needle>
                      {({ top }) => (
                        <div
                          className="needle"
                          style={{ top }}
                        />
                      )}
                    </Needle>
                    {mode === 'paint' && (
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
                    )}
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