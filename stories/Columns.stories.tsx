import type { Meta, StoryObj } from '@storybook/react'
import Agenda, { Columns } from '../src'
import { format } from 'date-fns'

const meta: Meta<typeof Columns> = {
  title: 'Components/Columns',
  component: Columns,
}

export default meta
type Story = StoryObj<typeof Columns>

export const ColumnsHeader: Story = {
  render: () => (
    <Agenda events={[]} >
      {() => (
        <div className="flex max-w-lg">
          <Columns>
            {({ date, key }) => (
              <div key={key} className="flex-1 center">
                {format(date, 'ccc d')}
              </div>
            )}
          </Columns>
        </div>
      )}
    </Agenda>
  ),
}
