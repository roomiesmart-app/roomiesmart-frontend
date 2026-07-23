# RoomieSmart Frontend 🏠💡

Frontend de **RoomieSmart**, una aplicación multiplataforma diseñada para revolucionar la convivencia. La plataforma facilita el *matchmaking* inteligente para encontrar a los compañeros de cuarto ideales y ofrece un sistema avanzado de gestión de finanzas compartidas en tiempo real.

Este repositorio contiene la arquitectura, el diseño de interfaz y la lógica de cliente, optimizada para ofrecer un rendimiento excepcional y una experiencia de usuario fluida.

---

## 🚀 Tecnologías y Stack Destacado

El proyecto está construido con un enfoque en alto rendimiento, comunicación en tiempo real y procesamiento eficiente en el lado del cliente:

*   **Core:** React + TypeScript + Vite
*   **Enrutamiento:** React Router DOM
*   **Estilos y UI:** Tailwind CSS
*   **Gestión de Estado Global:** Zustand (manejo de sesión, IDs de departamento y perfiles sin *prop drilling*)
*   **Data Fetching & Caché:** TanStack Query (React Query) para optimizar solicitudes al backend.
*   **Mensajería en Tiempo Real:** Socket.io (WebSockets) para el chat de roomies.
*   **Cálculos de Alto Rendimiento:** WebAssembly (Wasm) para el procesamiento de métricas financieras y división de gastos directamente en el cliente, reduciendo la carga del servidor.
*   **Validación:** Zod (esquemas de validación estrictos para formularios).
*   **Optimización de Rendimiento:** Implementación de utilidades como `debounce` para controlar la frecuencia de peticiones en búsquedas y filtros en tiempo real.

---

## 🏗️ Arquitectura y Decisiones de Diseño

La arquitectura del frontend fue diseñada para soportar una aplicación escalable y modular, separando claramente las responsabilidades:

- **Cálculos Descentralizados:** Integración de **WebAssembly** en el módulo de finanzas. Los cálculos complejos (división equitativa, ajuste de deudas cruzadas y proyecciones de gastos) se realizan a la velocidad de lenguajes de bajo nivel directamente en el navegador.
- **Comunicación Bidireccional:** Uso de **WebSockets** a través de Socket.io para garantizar que las notificaciones de pagos, los mensajes del chat y las actualizaciones de tareas del hogar se reflejen instantáneamente en la interfaz de todos los convivientes.
- **Estado Sincronizado:** Combinación de **Zustand** para el estado de la UI/Sesión y **TanStack Query** para el estado del servidor, garantizando que los datos mostrados estén siempre cacheados y actualizados sin peticiones redundantes.

### Estructura Principal

```text
src/
├── app/                  # Providers globales, configuración de Router y Store de Zustand
├── assets/               # Recursos estáticos (imágenes, iconos, WebAssembly modules)
├── features/             # Módulos principales del negocio
│   ├── matchmaking/      # Lógica y UI de búsqueda y filtros de roomies
│   ├── finances/         # Cálculos de gastos, deudas y presupuestos (Wasm integration)
│   └── chat/             # Mensajería en tiempo real (Socket.io)
├── components/           # Componentes UI reutilizables (Tailwind)
├── hooks/                # Custom hooks (ej. useDebounce, useWebSocket)
├── services/             # Clientes de API, endpoints y queries de TanStack
├── types/                # Definiciones de TypeScript y esquemas de Zod
└── utils/                # Helpers, formateadores y funciones puras
