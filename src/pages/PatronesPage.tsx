import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const composicion = `// COMPOSICIÓN: el patrón más importante de React
// Construir componentes complejos combinando componentes simples

// Componente "shell" que acepta children
function Card({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={\`border rounded-lg shadow-md \${className}\`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b font-bold">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t bg-gray-50">{children}</div>;
}

// Uso: composición flexible
function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <Card>
      <CardHeader>{producto.nombre}</CardHeader>
      <CardBody>
        <p>{producto.descripcion}</p>
        <p className="font-bold">\${producto.precio}</p>
      </CardBody>
      <CardFooter>
        <button>Comprar</button>
      </CardFooter>
    </Card>
  );
}`;

const renderProps = `// RENDER PROPS: pasar una función que retorna JSX
// Útil para compartir lógica de "cómo obtener datos"

interface MouseTrackerProps {
  render: (pos: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <>{render(pos)}</>;
}

// Uso: TÚ decides cómo renderizar los datos
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <p>El mouse está en ({x}, {y})</p>
      )}
    />
  );
}

// NOTA: Hoy en día, los Custom Hooks reemplazan
// la mayoría de casos de Render Props.
// El mismo ejemplo con hook:
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}`;

const hoc = `// HOC (Higher-Order Component): función que recibe un componente
// y retorna un componente mejorado.

// HOC que agrega autenticación
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) return <p>Verificando sesión...</p>;
    if (!user) return <Navigate to="/login" />;

    return <WrappedComponent {...props} />;
  };
}

// Uso:
function Dashboard() {
  return <h1>Dashboard privado</h1>;
}

const DashboardProtegido = withAuth(Dashboard);
// Ahora DashboardProtegido verifica auth automáticamente

// NOTA: Los HOCs son un patrón legacy.
// Hoy se prefieren Custom Hooks:
function Dashboard() {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" />;
  return <h1>Dashboard</h1>;
}`;

const compoundPattern = `// COMPOUND COMPONENTS: componentes que trabajan juntos
// Como <select> + <option> en HTML

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function Tabs({ children, defaultTab }: {
  children: React.ReactNode;
  defaultTab: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b">{children}</div>;
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return (
    <button
      onClick={() => ctx.setActiveTab(id)}
      className={ctx.activeTab === id ? 'border-b-2 border-blue-500' : ''}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  if (ctx.activeTab !== id) return null;
  return <div className="p-4">{children}</div>;
}

// Uso: API declarativa y limpia
function App() {
  return (
    <Tabs defaultTab="general">
      <TabList>
        <Tab id="general">General</Tab>
        <Tab id="seguridad">Seguridad</Tab>
        <Tab id="notificaciones">Notificaciones</Tab>
      </TabList>
      <TabPanel id="general">Configuración general...</TabPanel>
      <TabPanel id="seguridad">Opciones de seguridad...</TabPanel>
      <TabPanel id="notificaciones">Preferencias...</TabPanel>
    </Tabs>
  );
}`;

export default function PatronesPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Patrones de Composición</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React favorece la <strong>composición sobre la herencia</strong>. Estos patrones
        te ayudan a crear componentes flexibles, reutilizables y mantenibles.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Composición con children</h2>
      <p className="text-text-muted mb-4">
        El patrón más fundamental. Componentes que aceptan <code>children</code> como
        contenedores flexibles.
      </p>
      <CodeBlock code={composicion} language="tsx" filename="composicion.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Render Props</h2>
      <p className="text-text-muted mb-4">
        Pasar una función que retorna JSX. Útil pero mayormente reemplazado por hooks.
      </p>
      <CodeBlock code={renderProps} language="tsx" filename="render-props.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Higher-Order Components (HOC)</h2>
      <p className="text-text-muted mb-4">
        Funciones que envuelven componentes. Patrón legacy, preferir hooks.
      </p>
      <CodeBlock code={hoc} language="tsx" filename="hoc.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Compound Components</h2>
      <p className="text-text-muted mb-4">
        Componentes que trabajan juntos compartiendo estado implícito. Patrón avanzado
        muy elegante.
      </p>
      <CodeBlock code={compoundPattern} language="tsx" filename="compound.tsx" />

      <InfoBox type="tip" title="¿Qué patrón usar en 2026?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Composición + children</strong>: siempre, es la base</li>
          <li><strong>Custom Hooks</strong>: para lógica reutilizable (reemplaza HOCs y render props)</li>
          <li><strong>Compound Components</strong>: para APIs declarativas complejas</li>
          <li><strong>Render Props / HOCs</strong>: solo si mantienes código legacy</li>
        </ul>
      </InfoBox>
    </div>
  );
}
