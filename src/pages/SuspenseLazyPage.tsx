import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const lazyBasico = `import { lazy, Suspense } from 'react';

// ¿QUÉ PROBLEMA RESUELVE lazy()?
// Sin lazy, cuando el usuario abre tu app, el navegador descarga TODO
// el JavaScript de todas las páginas, aunque solo visite la página de inicio.
// En una app con 30 páginas, eso puede ser 2MB+ de JS inicial.
//
// ¿CÓMO FUNCIONA lazy()?
// lazy() convierte un import estático en un import DINÁMICO.
// En vez de incluir el código en el bundle principal, Vite/Rollup
// lo separa en un archivo aparte (un "chunk"). El navegador solo
// descarga ese chunk cuando React necesita renderizar ese componente.
//
// import normal (estático):
//   import Dashboard from './pages/Dashboard';
//   → Dashboard.tsx se incluye en el bundle principal
//   → Se descarga SIEMPRE, aunque nunca visites /dashboard
//
// import lazy (dinámico):
//   const Dashboard = lazy(() => import('./pages/Dashboard'));
//   → Dashboard.tsx se separa en su propio archivo (chunk)
//   → Se descarga SOLO cuando navegas a /dashboard por primera vez

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Configuracion = lazy(() => import('./pages/Configuracion'));

// ¿CÓMO FUNCIONA Suspense?
// Cuando React intenta renderizar un componente lazy que aún no se descargó:
// 1. React "suspende" el renderizado de ese componente
// 2. Busca el <Suspense> más cercano hacia arriba en el árbol
// 3. Muestra el fallback de ese Suspense
// 4. Cuando el chunk termina de descargar, reemplaza el fallback
//    con el componente real

function App() {
  return (
    <Suspense fallback={<div className="spinner">Cargando...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/config" element={<Configuracion />} />
      </Routes>
    </Suspense>
  );
}

// RESULTADO en la red del navegador:
// 1. Usuario abre la app → descarga index.js (bundle principal, pequeño)
// 2. Navega a /dashboard → descarga Dashboard-abc123.js (chunk separado)
//    Mientras descarga, ve el spinner del Suspense
// 3. Visita /dashboard otra vez → instantáneo (chunk ya cacheado)`;

const comoFuncionaSuspense = `// ¿CÓMO funciona Suspense internamente? El mecanismo de "throw Promise"
//
// Suspense funciona con un mecanismo especial:
// cuando un componente necesita "esperar" algo (código lazy o datos),
// LANZA una Promise (sí, como un throw de error, pero con una Promise).
//
// React atrapa esa Promise en el Suspense boundary más cercano,
// muestra el fallback, y cuando la Promise se resuelve, re-renderiza.
//
// Flujo interno simplificado:
// 1. React intenta renderizar <Dashboard /> (que es lazy)
// 2. lazy() detecta que el código no está cargado → throw promise
// 3. React atrapa la promise en el <Suspense> padre
// 4. Suspense muestra el fallback
// 5. La promise se resuelve (código descargado)
// 6. React re-renderiza Dashboard normalmente

// ¿POR QUÉ este diseño de "throw promise" y no callbacks?
// Porque permite que el componente se escriba como si los datos
// ya estuvieran disponibles. No necesitas manejar loading/error
// dentro del componente — eso lo maneja Suspense por ti.
// Esto hace que el componente sea más simple y declarativo.

// Ejemplo: el componente NO sabe que es lazy
function Dashboard() {
  // Este código no tiene idea de que se cargó bajo demanda
  // Simplemente funciona como cualquier componente normal
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Este componente se cargó on-demand</p>
    </div>
  );
}
export default Dashboard;
// El lazy() y Suspense son transparentes para el componente`;

const suspenseNesting = `// PLACEMENT STRATEGY: ¿Dónde colocar los Suspense boundaries?
//
// ¿POR QUÉ importa el placement?
// Un Suspense muy arriba → reemplaza TODA la UI con un spinner (mala UX)
// Un Suspense muy abajo → muchos spinners pequeños (confuso)
// El punto ideal: un Suspense por cada "unidad de carga independiente"

// ❌ MAL: un solo Suspense para todo — si una parte carga lento,
// TODA la página muestra el spinner
function AppMala() {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <Header />    {/* ya cargado */}
      <Sidebar />   {/* ya cargado */}
      <Dashboard /> {/* lazy, cargando... */}
    </Suspense>
    // ↑ Header y Sidebar desaparecen mientras Dashboard carga
  );
}

// ✅ BIEN: Suspense solo alrededor de lo que es lazy
function AppBuena() {
  return (
    <>
      <Header />   {/* se ve inmediatamente */}
      <Sidebar />  {/* se ve inmediatamente */}
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard /> {/* solo esta parte muestra skeleton */}
      </Suspense>
    </>
  );
}

// ✅ MEJOR: múltiples Suspense para carga independiente
function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Suspense fallback={<Skeleton tipo="grafico" />}>
        <GraficoVentas />  {/* carga independiente */}
      </Suspense>
      <Suspense fallback={<Skeleton tipo="tabla" />}>
        <TablaRecientes />  {/* carga independiente */}
      </Suspense>
      <Suspense fallback={<Skeleton tipo="stats" />}>
        <Estadisticas />  {/* carga independiente */}
      </Suspense>
      {/* Cada sección aparece cuando está lista,
          sin bloquear a las demás */}
    </div>
  );
}`;

const suspenseData = `// SUSPENSE PARA DATOS (React 19+)
//
// Antes de React 19, Suspense solo funcionaba con lazy().
// Ahora también funciona con DATA FETCHING usando el hook use().
//
// ¿CÓMO FUNCIONA?
// use() lee el valor de una Promise. Si la Promise no se resolvió aún,
// use() "suspende" el componente (lanza la promise internamente).
// El Suspense más cercano muestra el fallback.
// Cuando la Promise se resuelve, React re-renderiza con los datos.
//
// ¿POR QUÉ es mejor que useEffect para fetch?
// Con useEffect: renderizas → muestras loading manualmente → fetch →
//   actualizas estado → renderizas de nuevo. Tú manejas todo.
// Con Suspense: React maneja el loading automáticamente.
//   El componente se escribe como si los datos YA estuvieran ahí.

import { use, Suspense } from 'react';

// Función que retorna una Promise (se llama FUERA del componente)
async function fetchUsuarios(): Promise<Usuario[]> {
  const res = await fetch('/api/usuarios');
  return res.json();
}

// El componente usa use() — se escribe como si los datos ya existieran
function ListaUsuarios({ dataPromise }: { dataPromise: Promise<Usuario[]> }) {
  // use() suspende hasta que la promise resuelve
  // Cuando resuelve, 'usuarios' es el valor, no la promise
  const usuarios = use(dataPromise);

  // No hay if (loading), no hay if (error) — Suspense y ErrorBoundary
  // manejan eso por ti
  return (
    <ul>
      {usuarios.map(u => <li key={u.id}>{u.nombre}</li>)}
    </ul>
  );
}

// El padre crea la promise y envuelve en Suspense
function PaginaUsuarios() {
  // ⚠️ La promise se crea AQUÍ (en el padre), no dentro del hijo
  // Si la crearas dentro de ListaUsuarios, se crearía una nueva
  // promise en cada render → loop infinito
  const usuariosPromise = fetchUsuarios();

  return (
    <Suspense fallback={<p>Cargando usuarios...</p>}>
      <ListaUsuarios dataPromise={usuariosPromise} />
    </Suspense>
  );
}`;

export default function SuspenseLazyPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Suspense y Lazy Loading</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>lazy()</code> divide tu código en chunks que se cargan bajo demanda, reduciendo
        el bundle inicial. <code>Suspense</code> muestra un fallback mientras algo está cargando.
        Juntos resuelven un problema clave de rendimiento: <strong>no descargues código que el
        usuario no necesita ahora</strong>. En React 19, Suspense se extiende para manejar
        también la carga de datos.
      </p>

      <InfoBox type="angular" title="Angular lazy loading vs React lazy + Suspense">
        <p>
          Angular tiene lazy loading de módulos con <code>loadChildren</code> en el router —
          solo funciona a nivel de rutas. React usa <code>lazy()</code> + <code>Suspense</code>
          de forma más granular: puedes hacer lazy load de <strong>cualquier componente</strong>,
          no solo rutas. Además, Suspense proporciona un mecanismo unificado para manejar
          cualquier tipo de carga asíncrona (código, datos, imágenes).
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Lazy Loading — Cómo y por qué dividir tu código</h2>
      <p className="text-text-muted mb-4">
        Sin lazy loading, todo el JavaScript de tu app se descarga al abrir la página.
        Con <code>lazy()</code>, cada componente se separa en su propio archivo que se
        descarga <strong>solo cuando se necesita</strong>. Esto reduce drásticamente el
        tiempo de carga inicial.
      </p>
      <CodeBlock code={lazyBasico} language="tsx" filename="lazy-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cómo funciona Suspense internamente?</h2>
      <p className="text-text-muted mb-4">
        Suspense usa un mecanismo especial: cuando un componente necesita esperar algo,
        <strong> lanza una Promise</strong>. React la atrapa en el Suspense boundary más
        cercano, muestra el fallback, y cuando se resuelve, re-renderiza. Esto permite que
        el componente se escriba como si todo estuviera disponible.
      </p>
      <CodeBlock code={comoFuncionaSuspense} language="tsx" filename="como-funciona-suspense.tsx" />

      <InfoBox type="info" title="¿Por qué React eligió el mecanismo de 'throw Promise'?">
        Este diseño permite que los componentes sean <strong>declarativos</strong>: simplemente
        dicen "necesito estos datos" sin preocuparse por el cómo ni cuándo se cargan.
        El manejo de estados de carga se mueve fuera del componente al boundary de Suspense,
        separando la lógica de presentación de la lógica de carga. Es el mismo principio que
        Error Boundaries — separar el manejo de estados excepcionales del flujo normal.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Estrategia de placement — ¿Dónde poner Suspense?</h2>
      <p className="text-text-muted mb-4">
        La ubicación del Suspense boundary afecta directamente la experiencia de usuario.
        Un Suspense muy arriba oculta toda la UI; uno muy abajo crea caos visual. El
        punto ideal: <strong>un Suspense por cada unidad de carga independiente</strong>.
      </p>
      <CodeBlock code={suspenseNesting} language="tsx" filename="suspense-placement.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Suspense para datos (React 19+)</h2>
      <p className="text-text-muted mb-4">
        React 19 extiende Suspense más allá del code splitting. Con el hook <code>use()</code>,
        puedes "suspender" un componente mientras espera datos de una API. El componente se
        escribe como si los datos ya existieran — Suspense maneja el loading automáticamente.
      </p>
      <CodeBlock code={suspenseData} language="tsx" filename="suspense-data.tsx" />

      <InfoBox type="warning" title="Suspense para datos aún está madurando">
        Aunque React 19 soporta Suspense para datos con <code>use()</code>, en la práctica
        la mayoría de apps usan librerías como <strong>TanStack Query</strong> o el fetching
        integrado de <strong>Next.js</strong> que se integran con Suspense. Usar <code>use()</code>
        directamente requiere cuidado con dónde crear las Promises para evitar waterfalls y loops.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Cuándo y cómo usar Suspense">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>lazy() para rutas/páginas</strong> — mayor impacto en bundle size</li>
          <li><strong>Suspense alrededor de cada unidad independiente</strong> — ni muy arriba ni muy abajo</li>
          <li><strong>Fallback rápido</strong>: spinners, skeletons, no componentes pesados</li>
          <li><strong>Múltiples Suspense</strong> = cada sección carga independientemente (mejor UX)</li>
          <li><strong>use() + Suspense (React 19)</strong> — datos se tratan como código lazy</li>
          <li><strong>No crees Promises dentro del componente</strong> que las consume con use()</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        El ejemplo más práctico de Suspense + lazy loading ya está en la sección de
        React Router: revisa el ejemplo completo de esa página donde se combina
        <code> lazy()</code>, <code>Suspense</code>, y rutas anidadas.
      </p>
      <CodeBlock code={suspenseData} language="tsx" filename="src/components/SuspenseData.tsx" />
    </div>
  );
}
