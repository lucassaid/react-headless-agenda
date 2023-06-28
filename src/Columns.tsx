import { addDays } from 'date-fns'
import { useContext, useMemo, ReactNode } from 'react'
import context from './context'

export interface WeekDayProps {
  key: string,
  date: Date,
}

export interface WeekProps {
  children: (childrenProps: WeekDayProps) => ReactNode,
}

export default function Columns({ children }: WeekProps) {
  const { startDate, days } = useContext(context)

  const daysOfWeek = useMemo(() => (
    Array.from(new Array(days), (v, i) => i)
  ), [days])

  return (
    <>
      {daysOfWeek.map((i: number) => {
        return children({
          date: addDays(startDate, i),
          key: i.toString(),
        })
      })}
    </>
  )
}