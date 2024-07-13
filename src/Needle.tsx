import { isToday } from './date-utils'
import { dateToPixels } from './utils'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { dayContext } from './Day'

interface NeedleProps {
  children: (props: { top: number }) => ReactNode
}

export default function Needle({ children }: NeedleProps) {
  const { columnHeight, date } = useContext(dayContext)

  const [top, setTop] = useState(dateToPixels(new Date(), columnHeight))

  useEffect(() => {
    // Update the needle when the column height changes
    setTop(dateToPixels(new Date(), columnHeight))
  }, [columnHeight])

  useEffect(() => {
    // Update the needle every minute
    const interval = setInterval(() => {
      setTop(dateToPixels(new Date(), columnHeight))
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [columnHeight])

  if (!isToday(date)) return null

  return <>{children({ top })}</>
}
