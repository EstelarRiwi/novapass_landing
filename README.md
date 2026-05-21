# events_landing — PWA Pública

Frontend de la **PWA publica** del sistema **NovaPass**.  
Construida con Laravel + React + Vite + Tailwind CSS.

---

## Stack

| Capa          | Tecnología                |
| ------------- | ------------------------- |
| Framework     | Laravel 13                |
| Frontend      | React 19                  |
| Bundler       | Vite 8                    |
| CSS           | Tailwind CSS 4            |
| Navegación    | React Router DOM 7        |
| API Client    | Fetch nativo + JWT        |
| PWA           | Service Worker + Manifest |

---

## Arquitectura

Laravel **no contiene lógica de negocio**. Su único rol es servir el HTML inicial con React montado. Toda la lógica, validaciones y datos viven en `events_api` (ASP.NET Core 10).

Flujo:

```
Usuario → events_landing (Laravel + React)
               ↓  HTTP + JWT
        events_api (ASP.NET Core)
               ↓
        PostgreSQL + MongoDB
```

---

## Frontend implementado

> **Nota:** Todas las funcionalidades listadas están implementadas en el frontend (UI, hooks, lógica de estado y conexión HTTP), pero dependen de `events_api` para funcionar. Hasta que el backend esté operativo, mostrarán errores de conexión o estados vacíos.


- Cartelera pública de eventos
- Registro con correo y contraseña
- Login con correo y contraseña
- Login con Google (OAuth 2.0)
- Compra de boletas con Mercado Pago
  - Selección de evento, categoría y cantidad
  - Redirección a Mercado Pago
  - Pantalla de confirmación post-pago
- Mis Compras — historial de boletas
- Mis Entradas — visualización y descarga de QR + PDF
- Mis Favoritos — agregar y quitar eventos favoritos
- Mi Perfil — edición de datos y foto
- PQRS — formulario de envío y seguimiento
- Chatbot de asistencia
- PWA — instalable, offline vía Service Worker

---

## Requisitos

- PHP 8.3+
- Composer
- Node.js 20+
- PostgreSQL 16 (o conexión a la API remota)

---

## Setup

```bash
# Clonar e instalar dependencias
composer install
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Configurar la URL de la API en .env
VITE_API_URL=http://localhost:5000/api

# Desarrollo (Laravel + Vite)
composer run dev

# O por separado
php artisan serve   # Backend Laravel en :8000
npm run dev         # Vite dev server en :5173
```

---

## Variables de entorno

| Variable         | Descripción                          | Default                            |
| ---------------- | ------------------------------------ | ---------------------------------- |
| `APP_URL`        | URL base de Laravel                  | `http://localhost`                 |
| `VITE_API_URL`   | URL de la API (events_api)           | `http://localhost:5000/api`        |
| `DB_CONNECTION`  | Conexión a BD (no usada por React)   | `pgsql`                            |

---

## Estructura del proyecto

```
resources/
├── js/
│   ├── api/client.ts         # Cliente HTTP con JWT
│   ├── App.tsx                # Router principal
│   ├── main.tsx               # Entry point React
│   ├── components/
│   │   ├── Chatbot.tsx
│   │   ├── EventCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx    # Estado global de auth
│   ├── hooks/
│   │   ├── useEvents.ts
│   │   ├── useFavorites.ts
│   │   ├── usePqrs.ts
│   │   ├── useProfile.ts
│   │   └── useTickets.ts
│   ├── pages/
│   │   ├── EventDetail.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── MiPerfil.tsx
│   │   ├── MisCompras.tsx
│   │   ├── MisEntradas.tsx
│   │   ├── MisFavoritos.tsx
│   │   ├── PQRS.tsx
│   │   ├── PurchaseConfirmation.tsx
│   │   └── Register.tsx
│   └── styles/
│       └── global.css
└── views/
    └── app.blade.php          # HTML base con PWA tags
```

---

## API Endpoints que consume

| Método | Endpoint               | Uso                    |
| ------ | ---------------------- | ---------------------- |
| GET    | `/events`              | Cartelera pública      |
| GET    | `/events/:id`          | Detalle de evento      |
| POST   | `/auth/register`       | Registro               |
| POST   | `/auth/login`          | Login                  |
| GET    | `/auth/google`         | Redirect OAuth Google  |
| PUT    | `/auth/profile`        | Actualizar perfil      |
| POST   | `/auth/profile/photo`  | Subir foto             |
| GET    | `/tickets`             | Mis entradas           |
| GET    | `/tickets/history`     | Historial de compras   |
| POST   | `/tickets/checkout`    | Crear preferencia MP   |
| GET    | `/tickets/:id/pdf`     | Descargar PDF          |
| GET    | `/tickets/payment/verify` | Verificar pago      |
| GET    | `/favorites`           | Favoritos del usuario  |
| POST   | `/favorites`           | Agregar favorito       |
| DELETE | `/favorites/:id`       | Quitar favorito        |
| GET    | `/pqrs`                | Solicitudes del usuario|
| POST   | `/pqrs`                | Crear solicitud        |
| POST   | `/chatbot`             | Mensaje al chatbot     |

---

## PWA

La aplicación es instalable como PWA:

- `public/manifest.json` — configurado con nombre, iconos y tema
- `public/sw.js` — Service Worker con:
  - Precaché de assets críticos
  - Cache-first para assets estáticos
  - Network-first para peticiones a la API
  - Limpieza de cachés antiguas en activación
- `public/icons/` — iconos 192×192 y 512×512

---

## Repositorios relacionados

| Repositorio             | Descripción                         |
| ----------------------- | ----------------------------------- |
| `events_infrastructure` | Documentación, esquema SQL, Docker  |
| `events_api`            | API principal — ASP.NET Core 10     |
| `events_admin`          | PWA Admin                           |
| `events_tickets`        | PWA Taquilla                        |
| `events_access`         | PWA Acceso                          |
