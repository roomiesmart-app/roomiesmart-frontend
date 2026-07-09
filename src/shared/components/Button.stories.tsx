import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "RoomieSmart/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Publicar ahora",
    variant: "primary",
    size: "md",
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Volver al inicio" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Eliminar publicación" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Publicando..." },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: "Solicitar Unirse" },
  parameters: { layout: "padded" },
};
