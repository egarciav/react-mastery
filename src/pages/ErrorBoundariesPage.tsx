import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const errorBoundary = `import { Component, ErrorInfo, ReactNode } from 'react';

// ¿QUÉ PROBLEMA RESUELVEN los Error Boundaries?
// Sin ellos, si UN componente lanza un error durante el render,
// React desmonta TODA la app → pantalla en blanco.
// Error Boundaries atrapan el error y muestran una UI de fallback,
// manteniendo el resto de la app funcional.
//
// ¿CÓMO FUNCIONAN internamente?
// Funcionan como un try/catch pero para el árbol de componentes React.
// Cuando un hijo lanza un error durante render, React busca el Error
// Boundary más cercano hacia arriba, le pasa el error, y este decide
// qué mostrar en lugar del componente roto.
//
// ¿POR QUÉ necesitan ser componentes de clase?
// Porque usan dos métodos de ciclo de vida que NO tienen equivalente
// en hooks: getDerivedStateFromError y componentDidCatch.
// El equipo de React planea agregar un hook en el futuro, pero en
// React 19 aún no existe. Es el ÚNICO caso donde necesitas una clase.

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // PASO 1: React llama esto cuando un hijo lanza error en render
  // Retorna el nuevo estado → hasError: true → muestra fallback
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // PASO 2: Para logging/reporting (enviar a Sentry, LogRocket, etc.)
  // errorInfo tiene el componentStack: qué componentes estaban en el árbol
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado:', error);
    console.error('Component stack:', errorInfo.componentStack);
    // reportarError(error, errorInfo); // enviar a servicio de monitoreo
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Algo salió mal</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// USO: envuelve componentes que podrían fallar
function App() {
  return (
    <ErrorBoundary fallback={<p>Error en la app</p>}>
      <Header />
      <ErrorBoundary fallback={<p>Error en el contenido</p>}>
        <ContenidoPrincipal />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
  // Si ContenidoPrincipal falla → solo esa sección muestra error
  // Header y Footer siguen funcionando ✅
}`;

const limitaciones = `// ⚠️ Error Boundaries NO capturan estos errores:
//
// ¿POR QUÉ no los capturan?
// Porque Error Boundaries interceptan errores durante el RENDER
// (cuando React está construyendo el árbol de componentes).
// Los event handlers y código async se ejecutan FUERA del render.

// 1. ❌ Event handlers — se ejecutan después del render
// 2. ❌ Código asíncrono (promises, setTimeout, async/await)
// 3. ❌ Server-side rendering (SSR)
// 4. ❌ Errores en el propio Error Boundary (necesitas otro arriba)

// ─── Para errores en EVENT HANDLERS: usa try/catch ───
function Boton() {
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    try {
      hacerAlgoPeligroso();
    } catch (err) {
      // Guardas el error en estado → se muestra en la UI
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (error) return <p className="text-red-500">Error: {error}</p>;
  return <button onClick={handleClick}>Click</button>;
}

// ─── Para errores ASYNC: catch en la promise ───
function ComponenteAsync() {
  const [error, setError] = useState<string | null>(null);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        return r.json();
      })
      .then(data => setDatos(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!datos) return <p>Cargando...</p>;
  return <div>{/* usar datos */}</div>;
}`;

const estrategia = `// ESTRATEGIA DE PLACEMENT: ¿Dónde colocar Error Boundaries?
//
// La misma lógica que Suspense: granularidad adecuada.
// Error Boundaries anidados permiten que los errores se contengan
// en la sección donde ocurren, sin afectar el resto.

// Nivel 1: Error Boundary GLOBAL (última línea de defensa)
// Nivel 2: Error Boundary por FEATURE/SECCIÓN
// Nivel 3: Error Boundary por COMPONENTE crítico

function App() {
  return (
    // Nivel 1: si TODO falla, muestra página de error genérica
    <ErrorBoundary fallback={<PaginaErrorGlobal />}>
      <Layout>
        {/* Nivel 2: cada sección falla independientemente */}
        <ErrorBoundary fallback={<p>Error cargando sidebar</p>}>
          <Sidebar />
        </ErrorBoundary>

        <main>
          <ErrorBoundary fallback={<ErrorConReintento />}>
            {/* Nivel 3: widget específico */}
            <ErrorBoundary fallback={<p>Error en el chat</p>}>
              <ChatWidget />
            </ErrorBoundary>

            <Dashboard />
          </ErrorBoundary>
        </main>
      </Layout>
    </ErrorBoundary>
    // Si ChatWidget falla:
    // → solo se ve "Error en el chat"
    // → Dashboard, Sidebar, Layout siguen funcionando ✅
  );
}

// ─── Error Boundary con REINTENTAR ───
// ¿POR QUÉ es útil? Muchos errores son transitorios (red, timing).
// Reintentar = remountar el componente hijo = nueva oportunidad.
// Al cambiar la key del ErrorBoundary, React lo destruye y recrea,
// reseteando su estado y remontando los hijos.

function ErrorConReintento({ children }: { children: ReactNode }) {
  const [key, setKey] = useState(0);
  return (
    <ErrorBoundary
      key={key}  // cambiar key = resetear el boundary
      fallback={
        <div>
          <p>Algo salió mal</p>
          <button onClick={() => setKey(k => k + 1)}>Reintentar</button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/ErrorBoundary.tsx
// Ejemplo COMPLETO: Error Boundary reutilizable con reintentar
// ============================================
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-6 border border-red-200 bg-red-50 rounded-xl text-center">
          <p className="text-red-600 font-bold text-lg mb-2">Algo salió mal</p>
          <p className="text-red-500 text-sm mb-4">{this.state.error?.message}</p>
          <button onClick={this.resetError}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// 📁 src/App.tsx (uso)
// ============================================
// import { ErrorBoundary } from './components/ErrorBoundary';
//
// function App() {
//   return (
//     <ErrorBoundary onError={(err) => logToService(err)}>
//       <header><NavBar /></header>
//
//       <ErrorBoundary fallback={<p>Error en sidebar</p>}>
//         <Sidebar />
//       </ErrorBoundary>
//
//       <ErrorBoundary>
//         <main><Outlet /></main>
//       </ErrorBoundary>
//     </ErrorBoundary>
//   );
// }`;

export default function ErrorBoundariesPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Error Boundaries</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los Error Boundaries capturan errores de JavaScript en el árbol de componentes
        hijo y muestran una UI de fallback en vez de que la app entera se rompa. Funcionan
        como un <code>try/catch</code> declarativo para tu árbol de componentes: atrapan
        errores durante el render y deciden qué mostrar en su lugar.
      </p>

      <InfoBox type="angular" title="Angular ErrorHandler vs React Error Boundaries">
        <p>
          Angular tiene un <code>ErrorHandler</code> global que captura todos los errores
          en un solo lugar. React usa Error Boundaries que puedes <strong>anidar en diferentes
          niveles</strong> del árbol para atrapar errores de forma granular. La filosofía es
          diferente: Angular centraliza, React permite contener errores por sección.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Crear un Error Boundary — Cómo y por qué</h2>
      <p className="text-text-muted mb-4">
        Es el <strong>único caso</strong> donde necesitas un componente de clase en React
        moderno. Usan dos métodos de ciclo de vida (<code>getDerivedStateFromError</code> y
        <code> componentDidCatch</code>) que no tienen equivalente en hooks todavía.
      </p>
      <CodeBlock code={errorBoundary} language="tsx" filename="error-boundary.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Limitaciones — Qué NO capturan y por qué</h2>
      <p className="text-text-muted mb-4">
        Error Boundaries solo interceptan errores durante el <strong>render</strong> (cuando React
        construye el árbol). Los event handlers y código async se ejecutan fuera del render,
        por lo que necesitan su propio manejo de errores.
      </p>
      <CodeBlock code={limitaciones} language="tsx" filename="limitaciones.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Estrategia de placement — Dónde colocarlos</h2>
      <p className="text-text-muted mb-4">
        La clave es la <strong>granularidad</strong>: Error Boundaries anidados permiten que
        los errores se contengan en la sección donde ocurren. Un error en el chat no debería
        romper el dashboard. Incluye un patrón de "reintentar" para errores transitorios.
      </p>
      <CodeBlock code={estrategia} language="tsx" filename="estrategia-placement.tsx" />

      <InfoBox type="warning" title="En producción: usa react-error-boundary">
        En apps reales, usa la librería <code>react-error-boundary</code> en vez de crear
        tu propia clase. Provee un componente funcional <code>ErrorBoundary</code> con props
        como <code>onReset</code>, <code>resetKeys</code>, y <code>FallbackComponent</code>
        que cubren todos los casos comunes sin escribir una clase.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Error Boundaries">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>try/catch para el render</strong> — atrapan errores en el árbol de componentes</li>
          <li><strong>Único caso de clase</strong> — no hay hook equivalente (aún en React 19)</li>
          <li><strong>No capturan</strong> event handlers ni async — usa try/catch para esos</li>
          <li><strong>Anidados por sección</strong> — un error en X no rompe Y</li>
          <li><strong>Reintentar</strong> cambiando la key del boundary resetea su estado</li>
          <li><strong>En producción</strong> usa <code>react-error-boundary</code></li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        ErrorBoundary reutilizable: fallback personalizable, callback onError para logging,
        botón de reintentar, y ejemplo de anidamiento por secciones.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/ErrorBoundary.tsx" />
    </div>
  );
}
