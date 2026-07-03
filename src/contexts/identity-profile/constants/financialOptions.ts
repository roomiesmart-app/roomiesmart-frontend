export interface RoomTypeOption {
  value: 'privada' | 'compartida';
  label: string;
}

export interface ExpenseManagementOption {
  value: 'fondo-comun' | 'division-digital' | 'individual';
  title: string;
  desc: string;
}

export const ROOM_TYPE_OPTIONS: RoomTypeOption[] = [
  { value: 'privada', label: 'Privada' },
  { value: 'compartida', label: 'Compartida' },
];

export const EXPENSE_MANAGEMENT_OPTIONS: ExpenseManagementOption[] = [
  {
    value: 'fondo-comun',
    title: 'Fondo Común',
    desc: 'Aportamos una cantidad fija cada mes para todo el departamento.',
  },
  {
    value: 'division-digital',
    title: 'División Digital',
    desc: 'Cada uno paga lo suyo y ajustamos cuentas en la app.',
  },
  {
    value: 'individual',
    title: 'Todo Individual',
    desc: 'Cada roomie se encarga de sus propias compras exclusivamente.',
  },
];

export const SHARED_ITEMS_OPTIONS: string[] = [
  'Nevera', 'Cafetera', 'Televisión', 'Productos limpieza',
  'Lavadora', 'Microondas', 'Vajilla', 'Consola de juegos',
];
