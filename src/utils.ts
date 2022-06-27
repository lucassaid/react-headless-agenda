import { differenceInSeconds, endOfDay } from 'date-fns'

export const dateToPixels = (date: Date, columnHeight: number) => {
  const differenceWithEnd = differenceInSeconds(endOfDay(date), date)
  const minutesLeft = 86400 - differenceWithEnd
  const percentage = (minutesLeft / 86400) * 100
  return (percentage * columnHeight) / 100
}