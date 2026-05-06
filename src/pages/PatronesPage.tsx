import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const composicion = `// COMPOSICIÓN: el patrón FUNDAMENTAL de React
//
// ¿QUÉ ES composición?
// Construir componentes complejos combinando componentes simples.
// En vez de herencia (class B extends A), React usa composición:
// componentes que CONTIENEN otros componentes via children/props.
//
// ¿POR QUÉ composición sobre herencia?
// - Herencia crea acoplamiento rígido (cambiar el padre rompe los hijos)
// - Composición es flexible: combinas piezas como LEGO
// - Cada componente tiene UNA responsabilidad (Card no sabe qué hay dentro)
// - Puedes reemplazar cualquier pieza sin afectar las demás
//
// ¿CÓMO funciona children?
// children es una prop especial que contiene TODO lo que pones
// entre las tags de apertura y cierre de un componente:
// <Card>esto es children</Card>

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
//
// ¿QUÉ ES?
// Un componente recibe una FUNCIÓN como prop. Esa función recibe datos
// y retorna JSX. El componente maneja la lógica; la función decide la UI.
//
// ¿POR QUÉ existió?
// Antes de hooks, era la forma principal de compartir lógica con estado
// entre componentes. El componente encapsula la lógica (tracking del mouse),
// y el consumidor decide cómo renderizar los datos.
//
// ¿Se usa todavía?
// Poco. Custom hooks resuelven el 95% de los casos de forma más limpia.
// Pero render props siguen útiles cuando necesitas CONTROL sobre qué
// se renderiza (no solo los datos, sino la estructura JSX completa).

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

const hoc = `// HOC (Higher-Order Component)
//
// ¿QUÉ ES?
// Una FUNCIÓN que recibe un componente y retorna un componente mejorado.
// Es un patrón de la programación funcional: función que transforma funciones.
//
// ¿CÓMO funciona?
// withAuth(Dashboard) → retorna un NUEVO componente que:
// 1. Verifica si hay usuario autenticado
// 2. Si no → redirige al login
// 3. Si sí → renderiza Dashboard normalmente
//
// ¿POR QUÉ es legacy?
// Los HOCs tienen problemas: envuelven componentes en capas ("wrapper hell"),
// hacen difícil saber de dónde vienen las props, y los tipos de TypeScript
// son complicados. Custom hooks resuelven lo mismo de forma más directa.

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
//
// ¿QUÉ ES?
// Un grupo de componentes que comparten estado IMPLÍCITO via Context.
// El usuario los combina de forma declarativa, como HTML nativo:
// <select> + <option>, <table> + <tr> + <td>
//
// ¿POR QUÉ este patrón?
// - API DECLARATIVA: el consumidor escribe JSX limpio sin manejar estado
// - FLEXIBLE: el consumidor decide el orden y contenido de cada pieza
// - ENCAPSULADO: el estado compartido (qué tab está activa) es interno
// - EXTENSIBLE: puedes agregar nuevos TabPanels sin cambiar Tabs

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
        React favorece la <strong>composición sobre la herencia</strong>. En vez de crear
        jerarquías de clases, combinas componentes simples para construir UIs complejas.
        Estos patrones evolucionaron con React: de HOCs → render props → hooks, pero la
        composición con <code>children</code> siempre fue y será la base.
      </p>

      <InfoBox type="angular" title="Angular herencia vs React composición">
        <p>
          En Angular es común usar herencia entre componentes (<code>extends BaseComponent</code>)
          y servicios. React desaconseja herencia completamente — la documentación oficial
          dice "no hemos encontrado ningún caso donde recomendemos herencia". En su lugar:
          composición con children, custom hooks para lógica, y Context para estado compartido.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Composición con children — La base de todo</h2>
      <p className="text-text-muted mb-4">
        Componentes que aceptan <code>children</code> como contenedores flexibles. El
        componente padre define la estructura; el consumidor decide el contenido. Es como
        crear tus propios tags HTML personalizados.
      </p>
      <CodeBlock code={composicion} language="tsx" filename="composicion.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Render Props — Compartir lógica (pre-hooks)</h2>
      <p className="text-text-muted mb-4">
        Pasar una función como prop que recibe datos y retorna JSX. Era la forma principal
        de reutilizar lógica antes de hooks. Hoy, custom hooks lo reemplazan en el 95% de
        los casos, pero entenderlo ayuda a leer código legacy.
      </p>
      <CodeBlock code={renderProps} language="tsx" filename="render-props.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Higher-Order Components — Patrón legacy</h2>
      <p className="text-text-muted mb-4">
        Funciones que reciben un componente y retornan uno mejorado. Fue muy popular
        (Redux <code>connect()</code>, React Router <code>withRouter()</code>) pero tiene
        problemas de "wrapper hell" y tipado. Hoy se prefieren custom hooks.
      </p>
      <CodeBlock code={hoc} language="tsx" filename="hoc.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Compound Components — API declarativa avanzada</h2>
      <p className="text-text-muted mb-4">
        Componentes que trabajan juntos compartiendo estado implícito via Context.
        Como <code>{'<select> + <option>'}</code> en HTML. El consumidor escribe JSX limpio;
        el estado interno se maneja automáticamente. Usado en librerías como Radix UI y Headless UI.
      </p>
      <CodeBlock code={compoundPattern} language="tsx" filename="compound.tsx" />

      <InfoBox type="tip" title="¿Qué patrón usar hoy?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Composición + children</strong>: siempre — es la base de todo en React</li>
          <li><strong>Custom Hooks</strong>: para lógica reutilizable (reemplaza HOCs y render props)</li>
          <li><strong>Compound Components</strong>: para APIs declarativas complejas (tabs, accordions)</li>
          <li><strong>Render Props</strong>: raro — solo si necesitas control total sobre el JSX renderizado</li>
          <li><strong>HOCs</strong>: solo en código legacy o librerías que los requieran</li>
        </ul>
      </InfoBox>

      <InfoBox type="info" title="Resumen — Patrones de composición">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Composición &gt; herencia</strong> — principio fundamental de React</li>
          <li><strong>children</strong>: prop especial para contenido flexible</li>
          <li><strong>Render Props</strong>: función como prop → datos → JSX</li>
          <li><strong>HOC</strong>: función(componente) → componente mejorado</li>
          <li><strong>Compound</strong>: grupo de componentes + Context implícito</li>
          <li><strong>Evolución</strong>: HOCs → Render Props → Custom Hooks</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        El patrón Compound Components de arriba es el ejemplo más completo para tu GitHub.
        Revisa también los Custom Hooks (<code>useAsync</code>, <code>useLocalStorage</code>)
        en la página de Custom Hooks — son el patrón moderno más importante.
      </p>
      <CodeBlock code={compoundPattern} language="tsx" filename="src/components/Tabs.tsx" />
    </div>
  );
}
