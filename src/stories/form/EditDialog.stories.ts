import type { Meta, StoryObj } from '@storybook/react';
import EditDialogWrapper from './EditDialogWrapper';
import { employee1, employeeItems } from '../demoData';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Example/form/编辑对话框',
  component: EditDialogWrapper,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof EditDialogWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  name: "基本",
  args: {
    items: employeeItems,
    data: employee1,
    title: "编辑",
    cols: 3,
    visible: false,
  },
};

