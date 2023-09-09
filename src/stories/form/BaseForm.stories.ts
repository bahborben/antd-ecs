import type { Meta, StoryObj } from '@storybook/react';
import { employee1, employeeItems } from '../demoData';
import { BaseForm } from '../../comp/form';


const meta = {
  title: 'Example/form/基本表单',
  component: BaseForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof BaseForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  name: "基本",
  args: {
    items: employeeItems,
    data: employee1,
    cols: 3,
  },
};

