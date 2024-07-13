export function addDays(date: Date, days: number): Date {
  const _date = new Date(date)
  _date.setDate(_date.getDate() + days)
  return _date
}

export function endOfDay(date: Date): Date {
  const _date = new Date(date)
  _date.setHours(23, 59, 59, 999)
  return _date
}

export function startOfDay(date: Date): Date {
  const _date = new Date(date)
  _date.setHours(0, 0, 0, 0)
  return _date
}

export function addMilliseconds(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount)
}

export function addMinutes(date: Date, amount: number): Date {
  return addMilliseconds(date, amount * 60000)
}

export function differenceInSeconds(dateLeft: Date, dateRight: Date): number {
  return Math.abs(dateLeft.getTime() - dateRight.getTime()) / 1000
}

export function differenceInMinutes(dateLeft: Date, dateRight: Date): number {
  return differenceInSeconds(dateLeft, dateRight) / 60
}

export function isSameDay(dateLeft: Date, dateRight: Date): boolean {
  const dateLeftStartOfDay = startOfDay(dateLeft)
  const dateRightStartOfDay = startOfDay(dateRight)
  return +dateLeftStartOfDay === +dateRightStartOfDay
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getRoundingMethod() {
  return (number: number) => {
    const result = Math.round(number)
    return result === 0 ? 0 : result
  }
}

export function roundToNearestMinutes(date: Date, options?: { nearestTo?: number }): Date {
  const nearestTo = options?.nearestTo ?? 1

  if (nearestTo < 1 || nearestTo > 30) return new Date()

  const fractionalSeconds = date.getSeconds() / 60
  const fractionalMilliseconds = date.getMilliseconds() / 1000 / 60
  const minutes = date.getMinutes() + fractionalSeconds + fractionalMilliseconds

  const roundingMethod = getRoundingMethod()
  const roundedMinutes = roundingMethod(minutes / nearestTo) * nearestTo

  const result = new Date(date)
  result.setMinutes(roundedMinutes, 0, 0)
  return result
}

export function isWithinInterval(date: Date, interval: { start: Date; end: Date }): boolean {
  const time = +new Date(date)
  const [startTime, endTime] = [+new Date(interval.start), +new Date(interval.end)].sort(
    (a, b) => a - b
  )

  return time >= startTime && time <= endTime
}

export function startOfWeek(date: Date): Date {
  const weekStartsOn = 0

  const _date = new Date(date)
  const day = _date.getDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

  _date.setDate(_date.getDate() - diff)
  _date.setHours(0, 0, 0, 0)
  return _date
}
