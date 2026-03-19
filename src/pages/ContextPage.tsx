import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const contextBasico = `import { createContext, useContext, useState } from 'react';

// PASO 1: Crear el contexto con un valor por defecto
interface TemaContexto {
  tema: 'claro' | 'oscuro';
  toggleTema: () => void;
}

const TemaContext = createContext<TemaContexto | null>(null);

// PASO 2: Crear el Provider (componente que PROVEE el valor)
function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<'claro' | 'oscuro'>('oscuro');

  const toggleTema = () => {
    setTema(t => t === 'claro' ? 'oscuro' : 'claro');
  };

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

// PASO 3: Crear un hook personalizado para consumir el contexto
function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema debe usarse dentro de TemaProvider');
  }
  return context;
}

// PASO 4: Usar en cualquier componente hijo (sin importar profundidad)
function BotonTema() {
  const { tema, toggleTema } = useTema();
  return (
    <button onClick={toggleTema}>
      Tema actual: {tema}
    </button>
  );
}

function Encabezado() {
  const { tema } = useTema();
  return <header className={tema === 'oscuro' ? 'bg-black' : 'bg-white'}>Header</header>;
}

// PASO 5: Envolver la app con el Provider
function App() {
  return (
    <TemaProvider>
      <Encabezado />
      <main>
        <BotonTema />
        {/* Cualquier componente dentro puede usar useTema() */}
      </main>
    </TemaProvider>
  );
}`;

const propDrilling = `// EL PROBLEMA que Context resuelve: PROP DRILLING

// ❌ Sin Context: pasar props por TODOS los niveles
function App() {
  const [usuario, setUsuario] = useState({ nombre: 'Ana' });
  return <Layout usuario={usuario} />; // nivel 1
}
function Layout({ usuario }) {
  return <Sidebar usuario={usuario} />; // nivel 2
}
function Sidebar({ usuario }) {
  return <Menu usuario={usuario} />; // nivel 3
}
function Menu({ usuario }) {
  return <p>{usuario.nombre}</p>; // nivel 4 — ¡por fin lo usa!
}

// ✅ Con Context: acceso directo desde cualquier nivel
function App() {
  return (
    <UsuarioProvider>
      <Layout /> {/* no necesita recibir usuario */}
    </UsuarioProvider>
  );
}
function Layout() {
  return <Sidebar />; // limpio, sin props innecesarias
}
function Sidebar() {
  return <Menu />;
}
function Menu() {
  const { usuario } = useUsuario(); // acceso directo ✅
  return <p>{usuario.nombre}</p>;
}`;

const contextCompleto = `// Ejemplo completo: Context de autenticación

interface User { id: number; nombre: string; email: string; }

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al montar
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', { headers: { Authorization: token } })
        .then(r => r.json())
        .then(setUser)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requiere AuthProvider');
  return ctx;
}

// Uso en componentes:
function NavBar() {
  const { user, logout } = useAuth();
  return user
    ? <button onClick={logout}>Salir ({user.nombre})</button>
    : <a href="/login">Iniciar sesión</a>;
}`;

export default function ContextPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Context API</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Context permite <strong>compartir estado entre componentes</strong> sin pasarlo
        como props por cada nivel del árbol. Resuelve el problema del "prop drilling".
      </p>

      <InfoBox type="angular">
        En Angular, los <strong>servicios con @Injectable</strong> resuelven esto: un servicio
        singleton accesible desde cualquier componente via DI. En React, <strong>Context API</strong>{' '}
        + un custom hook logra lo mismo. El Provider = el módulo donde registras el servicio.
        El useContext/hook = la inyección en el constructor.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">El problema: Prop Drilling</h2>
      <CodeBlock code={propDrilling} language="tsx" filename="prop-drilling.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Context paso a paso</h2>
      <CodeBlock code={contextBasico} language="tsx" filename="context-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Ejemplo real: Autenticación</h2>
      <CodeBlock code={contextCompleto} language="tsx" filename="auth-context.tsx" />

      <InfoBox type="warning" title="¿Cuándo NO usar Context?">
        <ul className="list-disc list-inside space-y-1">
          <li>Para estado que solo necesitan 1-2 niveles (usa props)</li>
          <li>Para estado que cambia muy frecuentemente (causa re-renders en todo el árbol)</li>
          <li>Para estado complejo con muchas acciones (mejor useReducer + Context o librería externa)</li>
        </ul>
      </InfoBox>

      <InfoBox type="tip" title="Patrón recomendado">
        Siempre crea un <strong>custom hook</strong> para consumir tu contexto (ej: <code>useAuth</code>,{' '}
        <code>useTema</code>). Esto encapsula la validación de null y da un API más limpio.
      </InfoBox>
    </div>
  );
}
