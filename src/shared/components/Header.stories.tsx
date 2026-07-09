import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

const meta = {
  title: "RoomieSmart/Header",
  component: Header,
  tags: ["autodocs"],
  // El Header usa useNavigate: necesita un Router de mentira.
  // showBell=false porque la campanita depende de Supabase Realtime.
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="bg-gradient-to-br from-[#FFF5F0] to-[#FDF0EB] p-8">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    userName: "Esteban Larrea",
    userSubtitle: "Universidad Central",
    showBell: false,
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConLogout: Story = {
  args: {
    onLogout: () => alert("Cerrando sesión..."),
  },
};

export const UsuarioAnonimo: Story = {
  args: {
    userName: "Roomie",
    userSubtitle: "Invitado",
  },
};
