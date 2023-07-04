<img
  src="./assets/logo.svg"
  alt="Headless agenda for react"
  width="100"
/>
# Headless agenda for react
Completely unstyled components that help you to make your own agenda. Give it a try! It is really simple to use, and allows fully customization (the markup is all yours!). It might look intimidating at first but I'm sure you'll like it.

This library makes it easy to display events in their respective columns (or "days"), with their corresponding position and height, based on their durations. It's not meant to be used as a "calendar" or a "month" view.

✅ Flexible

✅ Controlled

✅ Performant

✅ Unestyled but easy to style

✅ Uses the default `Date` object only

✅ Supports drag and resize for events

<br>

How it looks with some styling:

![day](./assets/complete_agenda.png)

<br>

You can easily adapt it for mobile!
<br>

![vertical_example](./assets/vertical_example.gif)


<br>

# Installation

```bash
npm i react-headless-agenda
```

<br>
<br>

# Usage
All examples use [date-fns](https://www.npmjs.com/package/date-fns) but you can use the library of your choice to manipulate dates.

## `<Agenda>`
Our parent component. Just provide a start day, and some events.

```tsx
import { startOfWeek, addHours }  from 'date-fns'

// only `start` and `end` are required! This event starts now and ends in five hours
const events = [
  {
    id: 'event1',
    someTitle: 'Hey there!',
    start: new Date(),
    end:  addHours(new Date(), 5),
  }
]

<Agenda
  startDate={startOfWeek(new Date())}
  events={events}
/>
```

This is a controlled component. The agenda will NOT have an "inner" state in sync with `events` or `startDate`. Instead, it will fire an event for you to update your state when needed. You'll find more of this in the docs.

<br>

## `<Days>`

It lets you render whatever you need to, for each day. For example, let's render its name and number:

![days header](./assets/days_header.png)

```tsx
import { format }  from 'date-fns'

<div className="flex">
  <Days>
    {({ date }) => (
      <div key={date.toString()} className="flex-1">
        {format(date, 'ccc d')}
      </div>
    )}
  </Days>
</div>
```

<br>

Now the fun part, render your events!

![day](./assets/day.png)

```tsx
// this will be inside <Agenda/> and will receive the events from the context.
<Days>
  {({ date, containerRef, events }) => (
    <div
      key={date.toString()}
      ref={containerRef}
      className="relative h-full"
    >
      {events.map(({ event, top, bottom }) => (
        <div
          className="absolute w-full p-4 rounded-lg"
          style={{ top, bottom }}
        >
          {event.someTitle}
        </div>
      ))}
    </div>
  )}
</Days>
```

<br>
<br>

That's it! You also have `<Ticks>`, `<Needle>`, and `<Crosshair>`, but you'll learn them as you go.

---

PR's are welcome!
