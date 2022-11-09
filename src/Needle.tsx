import { isToday } from 'date-fns'
import { dateToPixels } from './utils'
import { ReactNode, useContext } from 'react'
import { DayContext } from './Day'

interface NeedleProps {
  children: (props: { top: number }) => ReactNode
}

export default function Needle({ children }: NeedleProps) {

  const { columnHeight, date } = useContext(DayContext)
  if (!isToday(date)) return null

  const top = dateToPixels(new Date(), columnHeight)

  return (
    <>
      {children({ top })}
    </>
  )
}