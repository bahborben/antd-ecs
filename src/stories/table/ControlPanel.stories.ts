import type { Meta, StoryObj } from '@storybook/react';
import { IEmployee, IEmployeeQC, employee1, employeeItems, employeeQCItems } from '../demoData';
import ControlPanel from '../../comp/table/ControlPanel';


const meta = {
  title: 'Example/table/查询面板',
  component: ControlPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof ControlPanel<IEmployeeQC, IEmployee>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  name: "基本",
  args: {
    filters: {
        data: {},
        items: employeeQCItems,
        cols: 3
    },
    commonFilterKeys: ["code"]
  },
};

