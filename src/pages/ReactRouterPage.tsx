import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const instalacion = `# Instalación
npm install react-router-dom

# Con TypeScript los tipos ya vienen incluidos en v6+`;

const setupBasico = `import { BrowserRouter, Routes, Route } from 'react-router-dom';

// BrowserRouter: provee el contexto de routing a toda la app
// Routes: contenedor de rutas (solo renderiza la primera que coincide)
// Route: define un path → componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/usuarios" element={<Usuarios />} />
        {/* Ruta comodín: si ninguna coincide */}
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}`;

const navegacion = `import { Link, NavLink, useNavigate } from 'react-router-dom';

// ─── Link ───
// Reemplaza <a href>. Navega sin recargar la página.
function Menu() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/about">Acerca</Link>
      <Link to="/usuarios">Usuarios</Link>
    </nav>
  );
}

// ─── NavLink ───
// Igual que Link pero sabe si su ruta está activa.
// Recibe una función className para estilar el estado activo.
function MenuConEstilos() {
  return (
    <nav>
      <NavLink
        to="/usuarios"
        className={({ isActive }) =>
          isActive ? 'text-blue-500 font-bold' : 'text-gray-400'
        }
      >
        Usuarios
      </NavLink>
    </nav>
  );
}

// ─── useNavigate ───
// Navegar programáticamente (después de un submit, login, etc.)
function FormLogin() {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
    navigate('/dashboard');           // redirigir
    navigate(-1);                     // ir atrás (como el botón back)
    navigate('/dashboard', { replace: true }); // replace en historial
  };

  return <form onSubmit={handleLogin}>...</form>;
}`;

const params = `import { useParams, useSearchParams, useLocation } from 'react-router-dom';

// ─── useParams ───
// Lee los parámetros dinámicos de la URL

// Route definida como: <Route path="/usuarios/:id" element={<DetalleUsuario />} />
function DetalleUsuario() {
  const { id } = useParams<{ id: string }>();
  // URL /usuarios/42 → id = "42"

  useEffect(() => {
    fetchUsuario(id!);
  }, [id]);

  return <div>Usuario: {id}</div>;
}

// ─── useSearchParams ───
// Lee/escribe los query params (?busqueda=react&pagina=2)
function BuscadorUsuarios() {
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get('q') || '';

  return (
    <div>
      <input
        value={busqueda}
        onChange={e => setSearchParams({ q: e.target.value })}
        placeholder="Buscar..."
      />
      <p>Buscando: {busqueda}</p>
    </div>
  );
}

// ─── useLocation ───
// Accede a la ubicación actual: pathname, search, state
function Breadcrumbs() {
  const location = useLocation();
  // location.pathname = "/usuarios/42"
  // location.search = "?tab=info"
  // location.state = { desde: 'lista' } (pasado con navigate)

  return <p>Estás en: {location.pathname}</p>;
}`;

const rutasAnidadas = `// RUTAS ANIDADAS: layout compartido entre varias rutas

import { Outlet } from 'react-router-dom';

// El Layout con Outlet
function DashboardLayout() {
  return (
    <div className="flex">
      <aside>
        <Link to="/dashboard">Inicio</Link>
        <Link to="/dashboard/perfil">Perfil</Link>
        <Link to="/dashboard/config">Config</Link>
      </aside>
      <main>
        <Outlet /> {/* Aquí se renderiza la ruta hija */}
      </main>
    </div>
  );
}

// Configuración de rutas anidadas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas anidadas bajo /dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* index: la ruta por defecto cuando vas a /dashboard */}
          <Route index element={<DashboardHome />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="config" element={<Configuracion />} />
          <Route path="usuarios/:id" element={<DetalleUsuario />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
// URLs resultantes:
// /dashboard          → DashboardLayout + DashboardHome
// /dashboard/perfil   → DashboardLayout + Perfil
// /dashboard/usuarios/42 → DashboardLayout + DetalleUsuario`;

const rutasProtegidas = `// RUTAS PROTEGIDAS: solo accesibles si el usuario está autenticado

// Componente guardián
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Verificando sesión...</p>;

  if (!user) {
    // Redirige al login, guardando la URL actual para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// También puedes hacerlo como wrapper de ruta
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user?.esAdmin) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

// Uso en el router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="admin" element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// En el login, volver a donde estaba el usuario
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = async () => {
    await login();
    navigate(from, { replace: true }); // vuelve a donde iba
  };

  return <button onClick={handleLogin}>Iniciar sesión</button>;
}`;

const lazyRouter = `// Combinar React Router con lazy loading
import { lazy, Suspense } from 'react';

// Cada página se carga solo cuando se navega a ella
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Configuracion = lazy(() => import('./pages/Configuracion'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="spinner">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/config" element={<Configuracion />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
// Resultado: el bundle de Dashboard solo se descarga cuando
// el usuario navega a /dashboard por primera vez.`;

export default function ReactRouterPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">React Router</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React Router es la librería estándar para routing en React. Permite crear
        SPAs con múltiples vistas, URLs dinámicas, rutas anidadas y protegidas.
        Usamos <strong>v6</strong> (la versión actual y estándar en 2026).
      </p>

      <InfoBox type="angular" title="Angular Router vs React Router">
        Angular tiene su router integrado con <code>RouterModule</code>, guards (<code>CanActivate</code>),
        resolvers y lazy loading de módulos. React Router v6 logra todo eso con una API más simple:
        <code>useNavigate</code> reemplaza al <code>Router</code> service, no hay guards — solo
        componentes wrapper, y lazy loading usa <code>React.lazy()</code>.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Instalación y setup básico</h2>
      <CodeBlock code={instalacion} language="bash" filename="terminal" />
      <CodeBlock code={setupBasico} language="tsx" filename="App.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Navegación: Link, NavLink, useNavigate</h2>
      <CodeBlock code={navegacion} language="tsx" filename="navegacion.tsx" />

      <InfoBox type="warning" title="Nunca uses &lt;a href&gt; dentro de una SPA">
        Usar <code>&lt;a href="/ruta"&gt;</code> recarga la página completa, perdiendo
        todo el estado de React. Siempre usa <code>&lt;Link to="/ruta"&gt;</code> de React Router.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Parámetros: useParams, useSearchParams, useLocation</h2>
      <CodeBlock code={params} language="tsx" filename="params.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Rutas anidadas con Outlet</h2>
      <p className="text-text-muted mb-4">
        Las rutas anidadas permiten compartir un layout entre varias rutas hijas.
        <code> Outlet</code> es el "hueco" donde se renderiza la ruta hija activa —
        equivalente a <code>&lt;router-outlet&gt;</code> de Angular.
      </p>
      <CodeBlock code={rutasAnidadas} language="tsx" filename="rutas-anidadas.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Rutas protegidas</h2>
      <p className="text-text-muted mb-4">
        En React no hay "guards" como en Angular. El patrón es un componente wrapper
        que verifica la autenticación y redirige si no está permitido.
      </p>
      <CodeBlock code={rutasProtegidas} language="tsx" filename="rutas-protegidas.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Lazy loading con Router</h2>
      <CodeBlock code={lazyRouter} language="tsx" filename="lazy-router.tsx" />

      <InfoBox type="tip" title="Hooks de React Router — Resumen">
        <ul className="list-disc list-inside space-y-1">
          <li><code>useNavigate()</code> — navegar programáticamente</li>
          <li><code>useParams()</code> — leer parámetros dinámicos <code>:id</code></li>
          <li><code>useSearchParams()</code> — leer/escribir query params <code>?q=</code></li>
          <li><code>useLocation()</code> — pathname, search, state actuales</li>
          <li><code>useMatch(pattern)</code> — comprobar si la URL coincide</li>
        </ul>
      </InfoBox>
    </div>
  );
}
