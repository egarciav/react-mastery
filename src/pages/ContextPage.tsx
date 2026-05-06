import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const contextBasico = `import { createContext, useContext, useState } from 'react';

// ¿CÓMO FUNCIONA Context internamente?
// Context crea un "canal" de datos que atraviesa el árbol de componentes.
// El Provider pone un valor en el canal. Cualquier componente hijo puede
// leer ese valor con useContext, sin importar cuántos niveles abajo esté.
//
// Internamente, React mantiene una PILA de providers. Cuando un componente
// llama useContext(MiContext), React busca el Provider más cercano HACIA
// ARRIBA en el árbol. Si no encuentra ninguno, usa el valor por defecto.
//
// ¿POR QUÉ re-renderiza?
// Cuando el value del Provider cambia, React re-renderiza TODOS los
// componentes que consumen ese contexto (que llaman useContext).
// Es por eso que Context no es ideal para estado que cambia muy seguido.

// PASO 1: Crear el contexto con tipo (null = sin provider)
interface TemaContexto {
  tema: 'claro' | 'oscuro';
  toggleTema: () => void;
}

// null como default → fuerza usar el Provider (si no hay, el hook lanzará error)
const TemaContext = createContext<TemaContexto | null>(null);

// PASO 2: Provider — componente que PROVEE el valor al árbol
function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<'claro' | 'oscuro'>('oscuro');

  const toggleTema = () => {
    setTema(t => t === 'claro' ? 'oscuro' : 'claro');
  };

  // value={{ tema, toggleTema }} → este objeto se comparte con todo el subárbol
  // ⚠️ Cada render del Provider crea un objeto nuevo → re-renderiza consumidores
  // Para optimizar: useMemo en el value (ver más abajo en "cuándo no usar")
  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

// PASO 3: Custom hook — encapsula useContext + validación
// ¿POR QUÉ un custom hook y no useContext directamente?
// 1. Valida que el Provider existe (mejor error que undefined silencioso)
// 2. Encapsula la implementación (puedes cambiar de Context a Zustand sin romper nada)
// 3. TypeScript infiere el tipo correctamente (sin | null)
function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema debe usarse dentro de TemaProvider');
  }
  return context; // TypeScript sabe que aquí NO es null ✅
}

// PASO 4: Consumir — cualquier componente hijo, sin importar profundidad
function BotonTema() {
  const { tema, toggleTema } = useTema(); // acceso directo
  return (
    <button onClick={toggleTema}>
      Tema actual: {tema}
    </button>
  );
}

function Encabezado() {
  const { tema } = useTema(); // otro consumidor, mismo contexto
  return <header className={tema === 'oscuro' ? 'bg-black' : 'bg-white'}>Header</header>;
}

// PASO 5: Envolver la app (o una sección) con el Provider
function App() {
  return (
    <TemaProvider>
      <Encabezado />
      <main>
        <BotonTema />
        {/* Todo dentro de TemaProvider puede usar useTema() */}
      </main>
    </TemaProvider>
  );
}`;

const propDrilling = `// EL PROBLEMA: PROP DRILLING
//
// ¿QUÉ ES prop drilling?
// Cuando un dato necesita llegar a un componente profundo, pasas
// la prop por CADA nivel intermedio — aunque esos niveles no la usen.
// Es tedioso, frágil, y contamina las interfaces de componentes.

// ❌ Sin Context: Layout y Sidebar NO usan usuario, solo lo pasan
function App() {
  const [usuario, setUsuario] = useState({ nombre: 'Ana' });
  return <Layout usuario={usuario} />; // nivel 1: pasa sin usar
}
function Layout({ usuario }) {
  return <Sidebar usuario={usuario} />; // nivel 2: pasa sin usar
}
function Sidebar({ usuario }) {
  return <Menu usuario={usuario} />; // nivel 3: pasa sin usar
}
function Menu({ usuario }) {
  return <p>{usuario.nombre}</p>; // nivel 4: ¡POR FIN lo usa!
}
// Problemas:
// - Layout/Sidebar tienen una prop que NO les corresponde
// - Si cambias la forma de usuario, hay que actualizar 4 componentes
// - Si agregas otro dato (permisos), hay que perforar de nuevo

// ✅ Con Context: solo el que NECESITA el dato lo consume
function App() {
  return (
    <UsuarioProvider>
      <Layout /> {/* NO recibe props de usuario */}
    </UsuarioProvider>
  );
}
function Layout() {
  return <Sidebar />; // limpio: solo sus propias props
}
function Sidebar() {
  return <Menu />;
}
function Menu() {
  const { usuario } = useUsuario(); // acceso DIRECTO al dato ✅
  return <p>{usuario.nombre}</p>;
}
// Layout y Sidebar ni se enteran de que usuario existe.
// Solo Menu consume el contexto — tal como debería ser.`;

const contextCompleto = `// Ejemplo REAL: Context de autenticación
//
// ¿POR QUÉ auth como Context?
// La autenticación es el caso ideal para Context:
// - Muchos componentes necesitan saber si hay usuario (NavBar, rutas, perfiles)
// - Cambia pocas veces (login/logout, no cada segundo)
// - Es estado "global" de la app, no de un componente específico

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

const ejemploGithub = `// ============================================
// 📁 src/context/ThemeContext.tsx
// Ejemplo COMPLETO: Context + custom hook + Provider
// ============================================
import { createContext, useContext, useState, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: { bg: string; text: string; border: string };
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    colors: theme === 'dark'
      ? { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-700' }
      : { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' },
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ============================================
// 📁 src/components/ThemedCard.tsx (consumidor)
// ============================================
// import { useTheme } from '../context/ThemeContext';
//
// function ThemedCard({ title, children }: { title: string; children: React.ReactNode }) {
//   const { colors, theme, toggleTheme } = useTheme();
//   return (
//     <div className={\`p-6 rounded-xl border \${colors.bg} \${colors.text} \${colors.border}\`}>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">{title}</h2>
//         <button onClick={toggleTheme}
//           className="px-3 py-1 rounded border text-sm">
//           {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
//         </button>
//       </div>
//       {children}
//     </div>
//   );
// }

// ============================================
// 📁 src/App.tsx (setup)
// ============================================
// import { ThemeProvider } from './context/ThemeContext';
// import ThemedCard from './components/ThemedCard';
//
// function App() {
//   return (
//     <ThemeProvider>
//       <ThemedCard title="Mi App">
//         <p>El tema se comparte por Context sin prop drilling.</p>
//       </ThemedCard>
//     </ThemeProvider>
//   );
// }`;

export default function ContextPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Context API</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Context permite <strong>compartir estado entre componentes</strong> sin pasarlo
        como props por cada nivel del árbol. Resuelve el "prop drilling" creando un canal
        de datos que cualquier componente hijo puede consumir directamente — sin importar
        cuántos niveles de profundidad tenga.
      </p>

      <InfoBox type="angular" title="Angular Services (@Injectable) vs React Context">
        <p>
          En Angular, los <strong>servicios con @Injectable</strong> resuelven esto: un servicio
          singleton inyectable en cualquier componente via DI. En React, <strong>Context +
          custom hook</strong> logra lo mismo. La equivalencia:
          <code> createContext</code> = definir el servicio,
          <code> Provider</code> = registrarlo en un módulo,
          <code> useContext/hook</code> = inyectarlo en el constructor.
          La diferencia: en Angular el servicio es singleton global; en React, el scope
          del Context depende de dónde pongas el Provider (más flexible).
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">El problema: Prop Drilling</h2>
      <p className="text-text-muted mb-4">
        Pasar datos a través de componentes intermedios que no los necesitan. Context
        elimina este problema: solo el componente que usa el dato lo consume.
      </p>
      <CodeBlock code={propDrilling} language="tsx" filename="prop-drilling.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Context paso a paso — 5 pasos</h2>
      <p className="text-text-muted mb-4">
        Crear contexto → Provider con estado → custom hook con validación → consumir
        en componentes → envolver la app. El custom hook es clave: encapsula la
        validación de null y permite cambiar la implementación sin romper consumidores.
      </p>
      <CodeBlock code={contextBasico} language="tsx" filename="context-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Ejemplo real — Context de autenticación</h2>
      <p className="text-text-muted mb-4">
        Auth es el caso ideal para Context: muchos componentes lo necesitan, cambia pocas
        veces (login/logout), y es estado global de la app.
      </p>
      <CodeBlock code={contextCompleto} language="tsx" filename="auth-context.tsx" />

      <InfoBox type="warning" title="¿Cuándo NO usar Context?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>1-2 niveles</strong>: usa props directamente (Context es overkill)</li>
          <li><strong>Estado que cambia muy seguido</strong> (posición del mouse, animaciones): cada
          cambio re-renderiza TODOS los consumidores — usa Zustand o signals</li>
          <li><strong>Estado muy complejo</strong>: mejor useReducer + Context, o una librería
          como Zustand/TanStack Query para estado servidor</li>
        </ul>
        <p className="mt-2">
          Truco: si el Provider re-renderiza mucho, envuelve el <code>value</code> en
          <code> useMemo</code> para evitar re-renders innecesarios en los consumidores.
        </p>
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Context API">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>createContext</strong> → crea el canal de datos</li>
          <li><strong>Provider</strong> → pone un valor en el canal para el subárbol</li>
          <li><strong>useContext</strong> → lee el valor del Provider más cercano hacia arriba</li>
          <li><strong>Custom hook</strong> → siempre encapsula useContext + validación de null</li>
          <li><strong>Ideal para</strong>: tema, auth, idioma, configuración (cambia poco)</li>
          <li><strong>Evitar para</strong>: estado que cambia muy rápido (usa librería externa)</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Theme Context completo: createContext + custom hook + Provider con useMemo,
        consumidor ThemedCard, y setup en App.tsx.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/context/ThemeContext.tsx" />
    </div>
  );
}
