import { ReactNode } from "react"

const hours = Array.from(new Array(24), (v, i) => i)

interface HoursColumnProps {
  children: ({ hour }: { hour: number }) => ReactNode
}

export default function HoursColumn({
  children
}: HoursColumnProps) {
  return (
    <>
      {hours.map(hour => children({ hour }))}
    </>
  )
}