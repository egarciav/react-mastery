import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const estructuraBasica = `// ESTRUCTURA BÁSICA de un proyecto React con Vite
//
// ¿POR QUÉ importa la estructura?
// React NO impone una estructura de carpetas (a diferencia de Angular).
// Esto es libertad, pero también responsabilidad. Sin convenciones,
// un proyecto crece caótico rápidamente. Estas son las convenciones
// más usadas en la industria en 2026.

// Proyecto pequeño-mediano (recomendado para empezar):
//
// mi-app/
// ├── public/                  ← Archivos estáticos (favicon, robots.txt)
// │   └── favicon.svg
// ├── src/
// │   ├── assets/              ← Imágenes, fonts, SVGs importados por código
// │   │   └── logo.svg
// │   ├── components/          ← Componentes REUTILIZABLES (UI genérica)
// │   │   ├── Button.tsx
// │   │   ├── Card.tsx
// │   │   ├── Modal.tsx
// │   │   └── InfoBox.tsx
// │   ├── hooks/               ← Custom hooks reutilizables
// │   │   ├── useFetch.ts
// │   │   ├── useLocalStorage.ts
// │   │   └── useDebounce.ts
// │   ├── pages/               ← Componentes de PÁGINA (una por ruta)
// │   │   ├── HomePage.tsx
// │   │   ├── AboutPage.tsx
// │   │   └── DashboardPage.tsx
// │   ├── context/             ← Providers de Context API
// │   │   ├── AuthContext.tsx
// │   │   └── ThemeContext.tsx
// │   ├── types/               ← Interfaces y tipos TypeScript compartidos
// │   │   └── index.ts
// │   ├── utils/               ← Funciones utilitarias puras (sin React)
// │   │   ├── formatDate.ts
// │   │   └── cn.ts
// │   ├── services/            ← Llamadas a APIs externas
// │   │   └── api.ts
// │   ├── App.tsx              ← Componente raíz (routing, providers)
// │   ├── main.tsx             ← Punto de entrada (ReactDOM.createRoot)
// │   └── index.css            ← Estilos globales / Tailwind
// ├── index.html               ← HTML base (Vite lo usa como entry point)
// ├── vite.config.ts           ← Configuración de Vite
// ├── tsconfig.json            ← Configuración de TypeScript
// ├── tailwind.config.js       ← Configuración de Tailwind (si lo usas)
// └── package.json             ← Dependencias y scripts`;

const estructuraFeatures = `// ESTRUCTURA POR FEATURES (proyectos medianos-grandes)
//
// ¿CUÁNDO usar esta estructura?
// Cuando el proyecto crece y tienes 50+ archivos en components/.
// En vez de agrupar por TIPO (todos los componentes juntos),
// agrupas por FEATURE (todo lo del dashboard junto).
//
// ¿POR QUÉ es mejor para proyectos grandes?
// - Cada feature es autónoma: puedes entenderla sin navegar 10 carpetas
// - Fácil de eliminar/mover features completas
// - Los imports son más cortos y claros
// - Cada dev trabaja en su feature sin conflictos

// mi-app/
// ├── src/
// │   ├── features/                 ← Agrupado por FEATURE/dominio
// │   │   ├── auth/                 ← Todo lo de autenticación
// │   │   │   ├── components/
// │   │   │   │   ├── LoginForm.tsx
// │   │   │   │   └── RegisterForm.tsx
// │   │   │   ├── hooks/
// │   │   │   │   └── useAuth.ts
// │   │   │   ├── context/
// │   │   │   │   └── AuthProvider.tsx
// │   │   │   ├── services/
// │   │   │   │   └── authApi.ts
// │   │   │   ├── types.ts
// │   │   │   └── index.ts          ← Barrel export (API pública)
// │   │   │
// │   │   ├── dashboard/            ← Todo lo del dashboard
// │   │   │   ├── components/
// │   │   │   │   ├── StatsCard.tsx
// │   │   │   │   └── RecentActivity.tsx
// │   │   │   ├── hooks/
// │   │   │   │   └── useDashboardData.ts
// │   │   │   ├── DashboardPage.tsx
// │   │   │   └── index.ts
// │   │   │
// │   │   └── products/             ← Todo lo de productos
// │   │       ├── components/
// │   │       │   ├── ProductCard.tsx
// │   │       │   └── ProductList.tsx
// │   │       ├── hooks/
// │   │       │   └── useProducts.ts
// │   │       ├── ProductsPage.tsx
// │   │       └── index.ts
// │   │
// │   ├── shared/                   ← Componentes/hooks compartidos
// │   │   ├── components/
// │   │   │   ├── Button.tsx
// │   │   │   ├── Modal.tsx
// │   │   │   └── Layout.tsx
// │   │   ├── hooks/
// │   │   │   ├── useFetch.ts
// │   │   │   └── useLocalStorage.ts
// │   │   └── utils/
// │   │       └── cn.ts
// │   │
// │   ├── App.tsx
// │   ├── main.tsx
// │   └── index.css`;

const barrelExports = `// BARREL EXPORTS: el archivo index.ts de cada carpeta/feature
//
// ¿QUÉ ES un barrel?
// Un archivo index.ts que re-exporta todo lo público de una carpeta.
// Simplifica los imports y define la "API pública" de cada módulo.
//
// ¿POR QUÉ usarlo?
// Sin barrel:  import { LoginForm } from '../features/auth/components/LoginForm'
// Con barrel:  import { LoginForm } from '../features/auth'
// Mucho más limpio y si reorganizas archivos internos, no rompes imports.

// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { useAuth } from './hooks/useAuth';
export { AuthProvider } from './context/AuthProvider';
export type { User, AuthState } from './types';

// Uso desde cualquier parte de la app:
import { LoginForm, useAuth, AuthProvider } from '@/features/auth';

// ─── El archivo index.ts también actúa como DOCUMENTACIÓN ───
// Cualquier dev puede abrir index.ts y ver TODO lo que exporta
// esa feature — es la "API pública" del módulo.`;

const convenciones = `// CONVENCIONES DE NOMBRADO en React
//
// ¿POR QUÉ importan las convenciones?
// Consistencia = productividad. Si todo el equipo sigue las mismas
// reglas, cualquiera puede navegar el código sin fricción.

// ── ARCHIVOS ──────────────────────────────────────────────────
// Componentes:     PascalCase.tsx     → Button.tsx, UserCard.tsx
// Hooks:           camelCase.ts       → useAuth.ts, useFetch.ts
// Utilidades:      camelCase.ts       → formatDate.ts, cn.ts
// Tipos:           camelCase.ts       → types.ts, user.types.ts
// Tests:           *.test.tsx         → Button.test.tsx
// Estilos:         *.module.css       → Button.module.css
// Constantes:      UPPER_SNAKE.ts     → API_ENDPOINTS.ts

// ── COMPONENTES ───────────────────────────────────────────────
// Nombre = función = archivo
function UserCard() {}      // ✅ PascalCase, nombre descriptivo
// export default UserCard;  // en UserCard.tsx

// ── HOOKS ─────────────────────────────────────────────────────
function useAuth() {}       // ✅ siempre empieza con "use"
function useFetch() {}      // ✅ camelCase después del "use"

// ── PROPS INTERFACES ──────────────────────────────────────────
interface UserCardProps {}   // ✅ NombreComponente + "Props"
interface ButtonProps {}     // ✅ consistente

// ── ENUMS / CONSTANTES ────────────────────────────────────────
const API_BASE_URL = 'https://...';  // ✅ UPPER_SNAKE_CASE
enum UserRole { Admin, Editor, Viewer }  // ✅ PascalCase

// ── ESTRUCTURA DE UN COMPONENTE (orden recomendado) ───────────
// 1. Imports
// 2. Interface de props
// 3. Componente (function declaration)
// 4. Sub-componentes privados (si los hay)
// 5. Export default`;

const vsAngular = `// ANGULAR vs REACT: Estructura de proyecto
//
// ── ANGULAR (muy opinionado) ──────────────────────────────────
// Angular CLI genera estructura por ti:
// app/
//   feature/
//     feature.component.ts       ← clase con @Component
//     feature.component.html     ← template separado
//     feature.component.css      ← estilos separados (encapsulados)
//     feature.component.spec.ts  ← tests
//     feature.module.ts          ← módulo (o standalone)
//     feature.service.ts         ← servicio @Injectable
//     feature.guard.ts           ← guard de ruta
//     feature.resolver.ts        ← resolver de datos
//
// Total: 8 archivos por feature
// Angular CLI los genera con ng generate

// ── REACT (flexible) ─────────────────────────────────────────
// Un componente = UN archivo .tsx (UI + lógica + estilos con Tailwind)
// features/
//   feature/
//     FeaturePage.tsx            ← componente (función + JSX + Tailwind)
//     useFeatureData.ts          ← hook (reemplaza service + resolver)
//     FeatureForm.tsx            ← sub-componente
//     types.ts                   ← tipos compartidos
//     index.ts                   ← barrel export
//
// Total: ~4-5 archivos por feature
// No hay CLI oficial — TÚ decides la estructura

// ── EQUIVALENCIAS ────────────────────────────────────────────
// Angular @Component    →  React function component (.tsx)
// Angular service       →  React custom hook (.ts)
// Angular guard         →  React wrapper component
// Angular resolver      →  React hook con Suspense
// Angular module        →  No existe (imports directos)
// Angular pipe          →  React función utilitaria
// Angular directive     →  React custom hook o componente
// template.html         →  JSX dentro del componente
// styles.css            →  Tailwind classes / CSS Modules`;

const ejemploReal = `// EJEMPLO REAL: estructura de este proyecto (react-learning-site)
//
// react-learning-site/
// ├── public/
// │   └── favicon.svg
// ├── src/
// │   ├── components/          ← UI reutilizable
// │   │   ├── CodeBlock.tsx    ← bloque de código con syntax highlighting
// │   │   ├── InfoBox.tsx      ← cajas de info/warning/tip/angular
// │   │   ├── Layout.tsx       ← layout con Sidebar + Outlet
// │   │   ├── ScrollToTop.tsx  ← scroll al navegar entre páginas
// │   │   └── Sidebar.tsx      ← menú lateral con navegación
// │   ├── pages/               ← una página por tema (lazy loaded)
// │   │   ├── HomePage.tsx
// │   │   ├── JsxPage.tsx
// │   │   ├── ComponentesPage.tsx
// │   │   ├── PropsPage.tsx
// │   │   └── ... (29 páginas)
// │   ├── App.tsx              ← BrowserRouter + Routes + lazy imports
// │   ├── main.tsx             ← createRoot + StrictMode
// │   └── index.css            ← Tailwind + tema custom
// ├── index.html
// ├── vite.config.ts
// ├── tsconfig.json
// ├── tailwind.config.js
// └── package.json
//
// ¿POR QUÉ esta estructura?
// - Es un proyecto educativo con ~30 páginas independientes
// - No hay features compartidas → estructura por tipo es suficiente
// - Cada página es lazy-loaded → bundles pequeños
// - components/ solo tiene 5 archivos reutilizables
// - Si creciera, migraría features/ como dashboard, auth, etc.`;

export default function EstructuraProyectoPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Estructura de Proyecto</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React no impone una estructura de carpetas — eso es libertad pero también
        responsabilidad. Aquí están las <strong>convenciones más usadas</strong> en
        la industria para organizar proyectos React de forma mantenible y escalable.
      </p>

      <InfoBox type="angular" title="Angular CLI genera todo vs React tú decides">
        <p>
          Angular CLI (<code>ng generate</code>) crea archivos con estructura fija: component,
          module, service, guard, spec... todo separado. En React <strong>tú decides</strong> la
          estructura. No hay CLI oficial. Esto da flexibilidad pero necesitas conocer las
          convenciones. Esta guía te da las más aceptadas en 2026.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Estructura básica — Proyectos pequeños/medianos</h2>
      <p className="text-text-muted mb-4">
        Agrupa por <strong>tipo de archivo</strong>: todos los componentes juntos, todos los hooks
        juntos, etc. Funciona bien hasta ~30-50 archivos. Es la forma más común de empezar.
      </p>
      <CodeBlock code={estructuraBasica} language="bash" filename="estructura-basica/" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Estructura por Features — Proyectos grandes</h2>
      <p className="text-text-muted mb-4">
        Agrupa por <strong>dominio/feature</strong>: todo lo del auth junto, todo lo del
        dashboard junto. Cada feature es autónoma. Escala mucho mejor que la estructura por tipo.
      </p>
      <CodeBlock code={estructuraFeatures} language="bash" filename="estructura-features/" />

      <InfoBox type="tip" title="¿Cuándo migrar de básica a features?">
        Cuando <code>components/</code> tiene más de ~15-20 archivos y empiezas a preguntarte
        "¿dónde está el componente X?". Esa es la señal de que necesitas organizar por feature.
        No migres todo de golpe — empieza con la feature más clara.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Barrel Exports — Imports limpios</h2>
      <p className="text-text-muted mb-4">
        El archivo <code>index.ts</code> de cada carpeta actúa como "API pública" del módulo.
        Define qué se exporta y simplifica los imports.
      </p>
      <CodeBlock code={barrelExports} language="tsx" filename="barrel-exports.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Convenciones de nombrado</h2>
      <p className="text-text-muted mb-4">
        Consistencia en el naming es lo que hace que un equipo sea productivo. Estas son
        las convenciones estándar de React.
      </p>
      <CodeBlock code={convenciones} language="tsx" filename="convenciones.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Angular vs React — Comparación de estructura</h2>
      <p className="text-text-muted mb-4">
        Angular genera ~8 archivos por feature con su CLI. React necesita ~4-5. Aquí la
        comparación directa y las equivalencias.
      </p>
      <CodeBlock code={vsAngular} language="tsx" filename="angular-vs-react.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Ejemplo real — Este proyecto</h2>
      <p className="text-text-muted mb-4">
        La estructura real de este sitio que estás viendo ahora mismo, explicada.
      </p>
      <CodeBlock code={ejemploReal} language="bash" filename="react-learning-site/" />

      <InfoBox type="warning" title="Reglas de oro">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>No sobre-organices</strong> al inicio — empieza simple, refactoriza cuando duela</li>
          <li><strong>Co-localización</strong>: archivos que cambian juntos deben vivir juntos</li>
          <li><strong>Un componente por archivo</strong> (excepto sub-componentes internos pequeños)</li>
          <li><strong>Barrel exports</strong> solo en la raíz de cada feature (no en sub-carpetas)</li>
          <li><strong>No crees carpetas vacías</strong> "por si acaso" — crécelas cuando las necesites</li>
        </ul>
      </InfoBox>

      <InfoBox type="info" title="Resumen — Estructura de proyecto React">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Básica (por tipo)</strong>: components/, pages/, hooks/ — hasta 50 archivos</li>
          <li><strong>Features (por dominio)</strong>: features/auth/, features/dashboard/ — proyectos grandes</li>
          <li><strong>shared/</strong>: componentes y hooks que usan múltiples features</li>
          <li><strong>Barrel exports</strong>: index.ts como API pública de cada carpeta</li>
          <li><strong>PascalCase</strong> para componentes, <strong>camelCase</strong> para hooks/utils</li>
          <li><strong>Angular: 8 archivos/feature</strong> → React: 4-5 archivos/feature</li>
        </ul>
      </InfoBox>
    </div>
  );
}
