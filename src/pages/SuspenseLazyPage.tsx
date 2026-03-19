import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const lazyBasico = `import { lazy, Suspense } from 'react';

// lazy() permite cargar componentes BAJO DEMANDA (code splitting)
// El bundle se divide: solo carga el código cuando se necesita

// En vez de: import Dashboard from './pages/Dashboard';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Configuracion = lazy(() => import('./pages/Configuracion'));

// Suspense muestra un fallback MIENTRAS el componente carga
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

// Resultado: cuando el usuario navega a /dashboard por primera vez,
// React descarga el código de Dashboard.tsx y muestra el spinner
// mientras carga. Las siguientes visitas son instantáneas (cacheado).`;

const suspenseData = `// Suspense para DATA FETCHING (React 19+)
// Usa el hook use() para "suspender" mientras carga datos

import { use, Suspense } from 'react';

// Función que retorna una Promise
async function fetchUsuarios(): Promise<Usuario[]> {
  const res = await fetch('/api/usuarios');
  return res.json();
}

// Componente que USA la promise directamente
function ListaUsuarios({ dataPromise }: { dataPromise: Promise<Usuario[]> }) {
  // use() "suspende" el componente hasta que la promise resuelve
  const usuarios = use(dataPromise);

  return (
    <ul>
      {usuarios.map(u => <li key={u.id}>{u.nombre}</li>)}
    </ul>
  );
}

// El padre crea la promise y la pasa
function PaginaUsuarios() {
  const usuariosPromise = fetchUsuarios();

  return (
    <Suspense fallback={<p>Cargando usuarios...</p>}>
      <ListaUsuarios dataPromise={usuariosPromise} />
    </Suspense>
  );
}

// Puedes anidar múltiples Suspense para control granular:
function Dashboard() {
  return (
    <div>
      <Suspense fallback={<Skeleton tipo="stats" />}>
        <Estadisticas />
      </Suspense>
      <Suspense fallback={<Skeleton tipo="tabla" />}>
        <TablaRecientes />
      </Suspense>
      {/* Cada sección carga independientemente */}
    </div>
  );
}`;

export default function SuspenseLazyPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Suspense y Lazy Loading</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>lazy()</code> divide tu código en chunks que se cargan bajo demanda.
        <code> Suspense</code> muestra un fallback mientras algo está cargando
        (componentes, datos, etc.).
      </p>

      <InfoBox type="angular">
        Angular tiene lazy loading de módulos con <code>loadChildren</code> en el router.
        React usa <code>lazy()</code> + <code>Suspense</code> para lo mismo, pero de forma
        más granular — puedes hacer lazy load de cualquier componente, no solo rutas.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Lazy Loading de componentes</h2>
      <CodeBlock code={lazyBasico} language="tsx" filename="lazy-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Suspense para datos (React 19+)</h2>
      <p className="text-text-muted mb-4">
        React 19 permite usar Suspense con datos, no solo con código lazy. El hook{' '}
        <code>use()</code> puede "suspender" un componente mientras espera una Promise.
      </p>
      <CodeBlock code={suspenseData} language="tsx" filename="suspense-data.tsx" />

      <InfoBox type="tip" title="Buenas prácticas">
        <ul className="list-disc list-inside space-y-1">
          <li>Usa lazy() para <strong>rutas/páginas</strong> — el impacto es máximo</li>
          <li>Coloca Suspense en el <strong>nivel adecuado</strong> (no muy arriba ni muy abajo)</li>
          <li>El fallback debe ser <strong>rápido</strong>: spinners, skeletons</li>
          <li>Múltiples Suspense = cada sección carga independientemente</li>
        </ul>
      </InfoBox>
    </div>
  );
}
