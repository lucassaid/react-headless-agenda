import { isToday } from 'date-fns'
import { dateToPixels } from './utils'
import { useContext } from 'react'
import { DayContext } from './Day'

interface NeedleProps {
  children: (props: { top: number }) => JSX.Element
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