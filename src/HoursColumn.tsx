
const hours = Array.from(new Array(24), (v, i) => i)

interface HoursColumnProps {
  children: ({ hour }: { hour: number }) => JSX.Element,
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