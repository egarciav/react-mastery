import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const errorBoundary = `import { Component, ErrorInfo, ReactNode } from 'react';

// Error Boundaries son el ÚNICO caso donde NECESITAS un componente de clase.
// No existe un hook equivalente (aún en React 19).

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

  // Se llama cuando un hijo lanza un error durante el render
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Para logging (enviar a un servicio de errores)
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado:', error, errorInfo);
    // Aquí enviarías a Sentry, LogRocket, etc.
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
}`;

const limitaciones = `// ⚠️ Error Boundaries NO capturan:
// 1. Errores en event handlers (usa try/catch)
// 2. Código asíncrono (promises, setTimeout)
// 3. Server-side rendering
// 4. Errores en el propio Error Boundary

// Para errores en event handlers:
function Boton() {
  const handleClick = () => {
    try {
      // código que podría fallar
      hacerAlgoPeligroso();
    } catch (error) {
      // Maneja el error con estado local
      console.error(error);
    }
  };
  return <button onClick={handleClick}>Click</button>;
}

// Para errores async:
function ComponenteAsync() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  return <div>Contenido</div>;
}`;

export default function ErrorBoundariesPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Error Boundaries</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los Error Boundaries capturan errores de JavaScript en el árbol de componentes
        hijo y muestran una UI de fallback en vez de que la app entera se rompa.
      </p>

      <InfoBox type="angular">
        Angular tiene <code>ErrorHandler</code> global. React usa Error Boundaries que puedes
        colocar en diferentes niveles del árbol para atrapar errores de forma granular.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Crear un Error Boundary</h2>
      <p className="text-text-muted mb-4">
        Es el <strong>único caso</strong> donde necesitas un componente de clase en React moderno.
      </p>
      <CodeBlock code={errorBoundary} language="tsx" filename="error-boundary.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Limitaciones</h2>
      <CodeBlock code={limitaciones} language="tsx" filename="limitaciones.tsx" />

      <InfoBox type="tip" title="Estrategia recomendada">
        Coloca Error Boundaries en diferentes niveles: uno global para la app, y otros más
        específicos alrededor de features independientes. Así un error en el chat no rompe el dashboard.
      </InfoBox>
    </div>
  );
}
