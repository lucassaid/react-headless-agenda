import { addDays } from 'date-fns'
import { useContext, useMemo, ReactNode } from 'react'
import context from './context'
import Day, { DayChildrenProps } from './Day'

export interface WeekDayProps extends DayChildrenProps {
  key: string,
  date: Date,
}

export interface WeekProps {
  children: (childrenProps: WeekDayProps) => ReactNode,
}

export default function Days({ children }: WeekProps) {
  const { startDate, days } = useContext(context)

  const daysOfWeek = useMemo(() => [...Array(days).keys()], [days])

  return (
    <>
      {daysOfWeek.map((i: number) => {
        const date = addDays(startDate, i)
        return (
          <Day key={i.toString()} date={date}>
            {({ containerRef, events }) => (
              <>
                {children({
                  date,
                  key: i.toString(),
                  containerRef,
                  events,
                })}
              </>
            )}
          </Day>
        )
      })}
    </>
  )
}