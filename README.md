# Wellness Hub — Frontend

Plataforma integral de bienestar para registrar fitness, nutrición, salud, sueño, meditación e hidratación. Construida con React 19, TypeScript, Vite y Tailwind CSS.

## Requisitos previos

- Node.js 20+
- npm 10+
- Backend corriendo en `http://localhost:3000` (ver repositorio del backend)

## Configuración inicial

```bash
# Clonar e instalar dependencias
npm install

# Copiar el archivo de variables de entorno
cp .env.example .env
```

Edita `.env` con la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR en `http://localhost:5173` |
| `npm run build` | Verificación de tipos + build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta los tests una vez |
| `npm run test:watch` | Ejecuta los tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

## Estructura del proyecto

```
src/
├── components/        # Componentes reutilizables (Login, Register, 2FA, Navbar…)
├── context/           # AuthContext — gestión de sesión de usuario
├── i18n/              # Configuración de i18next
├── locales/           # Traducciones (en.json, es.json)
├── pages/             # Páginas por módulo (Health, Fitness, Nutrition…)
├── services/
│   └── api.ts         # Cliente Axios con interceptores de auth
├── store/
│   └── appStore.ts    # Estado global con Zustand + persistencia
├── tests/             # Tests unitarios (Vitest + Testing Library)
└── utils/
    └── validation.ts  # Utilidades de validación de inputs
```

## Módulos de la aplicación

| Módulo | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard` | Resumen de todos los módulos |
| Analytics | `/dashboard-enhanced` | Gráficos, logros y exportación PDF/CSV |
| Salud | `/health` | Peso, presión arterial, frecuencia cardíaca |
| Fitness | `/fitness` | Planes de entrenamiento y registro de ejercicios |
| Nutrición | `/nutrition` | Registro de comidas y macronutrientes |
| Chatbot IA | `/nutrition-chat` | Recomendaciones nutricionales personalizadas |
| Sueño | `/sleep` | Seguimiento de calidad y duración del sueño |
| Salud Mental | `/mental-health` | Registro de estado de ánimo y estrés |
| Hidratación | `/hydration` | Seguimiento de ingesta de agua |
| Metas | `/goals` | Creación y seguimiento de objetivos |
| Meditación | `/meditation` | Registro de sesiones de meditación |
| Configuración | `/settings` | Perfil, contraseña, 2FA y preferencias |

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend REST | `http://localhost:3000` |

En producción usa `.env.production` o configura la variable en tu plataforma de hosting (Vercel, Netlify, etc.).

## Autenticación

- JWT almacenado en `localStorage`
- Token adjuntado automáticamente a todas las peticiones via interceptor Axios
- Auto-logout cuando el servidor devuelve `401`
- Soporte para 2FA por email

## Deploy en producción

```bash
# Asegúrate de tener configurado VITE_API_URL en .env.production
npm run build

# El directorio dist/ es estático — súbelo a cualquier CDN o servidor
```

### Ejemplo con Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Configura `Root Directory` → `frontend`
3. Agrega la variable de entorno `VITE_API_URL` en el dashboard de Vercel
4. Deploy automático en cada push a `main`

## Tests

```bash
npm test               # Ejecutar todos los tests
npm run test:coverage  # Ver cobertura de código
```

Los tests cubren: interceptores de la API, flujo de autenticación (AuthContext), auto-logout por 401, y utilidades de validación.

## Tecnologías principales

- **React 19** + **TypeScript 6** — UI y tipado estático
- **Vite 8** — Build tool y servidor de desarrollo
- **Tailwind CSS 4** — Estilos utilitarios
- **React Router 7** — Enrutamiento client-side con lazy loading
- **Zustand 5** — Estado global ligero con persistencia
- **Axios** — Cliente HTTP con interceptores
- **i18next** — Internacionalización (ES/EN)
- **Recharts** — Gráficos y visualizaciones
- **Vitest + Testing Library** — Tests unitarios
