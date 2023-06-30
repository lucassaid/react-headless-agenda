import { ComponentProps } from 'react'
import Agenda from './Agenda'

type ArrayType<T> = T extends (infer Item)[] ? Item : T

export type InferredEvents = ComponentProps<typeof Agenda>['events']
export type InferredEvent = ArrayType<InferredEvents>

export interface ExtendedEventProps {
  top: number
  bottom: number
  startsBeforeToday: boolean
  endsAfterToday: boolean
  isDragging: boolean
}
