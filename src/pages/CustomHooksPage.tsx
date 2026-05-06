import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const hookBasico = `// ¿QUÉ ES un Custom Hook?
// Una función de JavaScript que:
// 1. Empieza con "use" (convención obligatoria)
// 2. Puede llamar a otros hooks (useState, useEffect, etc.)
// 3. Retorna lo que quieras (valores, funciones, objetos)
//
// ¿CÓMO FUNCIONA?
// Es solo una función. No tiene magia. React no la trata de forma
// especial. Lo que la hace "hook" es que DENTRO usa otros hooks.
// El prefijo "use" activa las reglas del linter para validar
// que se cumplan las reglas de hooks.
//
// ¿POR QUÉ crear custom hooks?
// - REUTILIZAR: misma lógica en múltiples componentes
// - SEPARAR: sacar lógica compleja del componente (responsabilidad única)
// - TESTEAR: probar lógica aislada del componente
// - COMPONER: combinar hooks pequeños para crear lógica más compleja

// Hook personalizado: useContador
function useContador(inicial: number = 0) {
  const [count, setCount] = useState(inicial);

  const incrementar = () => setCount(c => c + 1);
  const decrementar = () => setCount(c => c - 1);
  const reiniciar = () => setCount(inicial);

  // Retorna un objeto con estado + acciones
  return { count, incrementar, decrementar, reiniciar };
}

// Cada componente que usa useContador tiene su PROPIA instancia
// ComponenteA y ComponenteB NO comparten estado — cada uno tiene su count
function ComponenteA() {
  const { count, incrementar, reiniciar } = useContador(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={incrementar}>+</button>
      <button onClick={reiniciar}>Reset</button>
    </div>
  );
}

function ComponenteB() {
  const { count, decrementar } = useContador(100); // otro inicial
  return <button onClick={decrementar}>Count: {count}</button>;
}`;

const useFetch = `// Hook para fetch de datos — el custom hook más común
//
// ¿POR QUÉ este hook?
// Sin él, CADA componente que hace fetch repite: useState para data,
// loading, error + useEffect con try/catch + cleanup. Con useFetch,
// esa lógica se escribe UNA vez y se reutiliza en toda la app.
//
// ¿CÓMO funciona?
// 1. Recibe una URL → hace fetch en un useEffect
// 2. Maneja 3 estados: data, loading, error
// 3. useCallback memoriza fetchData → useEffect depende de ella
// 4. Retorna los 3 estados + refetch para recargar manualmente
//
// Nota: en producción, usa TanStack Query (React Query) que agrega
// cache, deduplicación, retry, y mucho más. Este hook es educativo.

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Uso — limpio y reutilizable en cualquier componente
function Usuarios() {
  const { data, loading, error } = useFetch<User[]>('/api/users');
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

function Productos() {
  const { data, loading, refetch } = useFetch<Product[]>('/api/products');
  // ¡Misma lógica, diferente endpoint!
  return <div>...</div>;
}`;

const useLocalStorage = `// Hook para sincronizar estado con localStorage
//
// ¿POR QUÉ este hook?
// useState pierde su valor al recargar la página. useLocalStorage
// persiste el estado en localStorage automáticamente. Es useState
// que "sobrevive" entre sesiones del navegador.
//
// ¿CÓMO funciona?
// 1. Inicializa: lee de localStorage (lazy initializer en useState)
// 2. Sincroniza: useEffect escribe en localStorage cada vez que cambia
// 3. Retorna [valor, setValor] — misma API que useState

function useLocalStorage<T>(key: string, valorInicial: T) {
  // Lazy initializer: esta función solo se ejecuta en el PRIMER render
  // (no en cada re-render). Lee de localStorage una sola vez.
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  // Sincroniza con localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valor));
  }, [key, valor]);

  return [valor, setValor] as const;
}

// Uso:
function Configuracion() {
  const [tema, setTema] = useLocalStorage('tema', 'oscuro');
  const [idioma, setIdioma] = useLocalStorage('idioma', 'es');

  return (
    <div>
      <select value={tema} onChange={e => setTema(e.target.value)}>
        <option value="oscuro">Oscuro</option>
        <option value="claro">Claro</option>
      </select>
      {/* El valor persiste aunque recargues la página */}
    </div>
  );
}`;

const reglas = `// REGLAS DE LOS HOOKS — y por qué existen

// ─── REGLA 1: Solo llama hooks en el nivel TOP ───
// ❌ NUNCA dentro de if, for, while, o funciones anidadas

function ComponenteMalo() {
  if (condicion) {
    const [valor, setValor] = useState(0); // ❌ Rompe el orden de hooks
  }

  for (let i = 0; i < 3; i++) {
    useEffect(() => {}); // ❌ El número de hooks cambia entre renders
  }
}

// ✅ Siempre al nivel raíz, en el mismo orden, en cada render
function ComponenteBien() {
  const [valor, setValor] = useState(0);  // Hook 1, siempre
  const [nombre, setNombre] = useState(''); // Hook 2, siempre
  useEffect(() => {}, []);                 // Hook 3, siempre

  // La condicional va DENTRO del hook, no alrededor
  useEffect(() => {
    if (condicion) {
      hacerAlgo();
    }
  }, [condicion]);
}

// ¿POR QUÉ esta regla?
// React identifica cada hook por su POSICIÓN en el orden de llamada.
// Internamente maneja una lista: [Hook1, Hook2, Hook3, ...].
// Si el orden cambia entre renders (por un if), React no sabe
// qué estado corresponde a qué hook → comportamiento indefinido.

// ─── REGLA 2: Solo llama hooks desde React ───
// ✅ Desde componentes funcionales
function MiComponente() {
  const [x, setX] = useState(0); // ✅
}

// ✅ Desde custom hooks
function useMyHook() {
  const [x, setX] = useState(0); // ✅
}

// ❌ NUNCA desde funciones regulares de JavaScript
function funcionNormal() {
  const [x, setX] = useState(0); // ❌ React no tiene contexto aquí
}

// ❌ NUNCA desde clases
class MiClase {
  metodo() {
    useState(0); // ❌
  }
}

// ─── REGLA 3: Nombre DEBE empezar con "use" ───
function useMyHook() {} // ✅ React lo reconoce como hook, activa el linter
function myHook() {}    // ❌ El linter no puede validar las reglas de hooks

// ─── REGLA 4: Cada componente tiene su PROPIA instancia ───
// Si 3 componentes usan useContador(), cada uno tiene
// su propio count independiente. No comparten estado.
function A() { const { count } = useContador(); } // count = 0
function B() { const { count } = useContador(); } // count = 0 (diferente)
function C() { const { count } = useContador(); } // count = 0 (diferente)`;

const ejemploGithub = `// ============================================
// 📁 src/hooks/useAsync.ts
// Custom hook COMPLETO: manejo genérico de async operations
// ============================================
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null, loading: false, error: null,
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// ============================================
// 📁 src/hooks/useLocalStorage.ts
// ============================================
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = newValue instanceof Function ? newValue(prev) : newValue;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  }, [key]);

  return [value, setStoredValue] as const;
}

// ============================================
// 📁 src/components/UserManager.tsx (uso de ambos hooks)
// ============================================
// import { useAsync } from '../hooks/useAsync';
// import { useLocalStorage } from '../hooks/useLocalStorage';
//
// interface User { id: number; name: string; email: string; }
//
// export default function UserManager() {
//   const { data: users, loading, error, execute } = useAsync<User[]>();
//   const [favoritos, setFavoritos] = useLocalStorage<number[]>('favs', []);
//
//   const cargarUsuarios = () => {
//     execute(() =>
//       fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json())
//     );
//   };
//
//   const toggleFav = (id: number) => {
//     setFavoritos(prev =>
//       prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
//     );
//   };
//
//   return (
//     <div className="p-4">
//       <button onClick={cargarUsuarios}
//         className="px-4 py-2 bg-blue-500 text-white rounded mb-4">
//         {loading ? 'Cargando...' : 'Cargar usuarios'}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//       {users?.map(u => (
//         <div key={u.id} className="flex items-center gap-2 p-2 border-b">
//           <button onClick={() => toggleFav(u.id)}>
//             {favoritos.includes(u.id) ? '★' : '☆'}
//           </button>
//           <span>{u.name}</span>
//           <span className="text-sm text-gray-400">{u.email}</span>
//         </div>
//       ))}
//     </div>
//   );
// }`;

export default function CustomHooksPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Custom Hooks</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los Custom Hooks permiten <strong>extraer y reutilizar lógica</strong> entre
        componentes. Son funciones que empiezan con <code>use</code>, pueden llamar a
        cualquier hook de React, y cada componente que los usa tiene su propia instancia
        independiente. Son la herramienta principal para composición y separación de
        responsabilidades en React.
      </p>

      <InfoBox type="angular" title="Angular Services vs React Custom Hooks">
        <p>
          En Angular, la lógica reutilizable va en <strong>servicios @Injectable</strong>
          (singleton, inyectados via DI). En React, va en <strong>custom hooks</strong>.
          Diferencias clave: los servicios Angular son singleton (estado compartido entre
          componentes); los hooks crean <strong>instancias independientes</strong> por componente.
          Para compartir estado, los hooks se combinan con Context. Los hooks también pueden
          manejar estado, efectos y ciclo de vida directamente — algo que los servicios Angular
          no hacen (necesitan RxJS para eso).
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Tu primer Custom Hook</h2>
      <p className="text-text-muted mb-4">
        Un custom hook es solo una función con <code>use</code> al inicio. No tiene magia —
        lo especial es que <strong>puede usar otros hooks</strong> adentro. Cada componente
        que lo llama obtiene su propia instancia de estado.
      </p>
      <CodeBlock code={hookBasico} language="tsx" filename="custom-hook-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useFetch — Centralizar peticiones HTTP</h2>
      <p className="text-text-muted mb-4">
        El hook más común en proyectos reales. Encapsula fetch + loading + error + refetch
        en una sola llamada. En producción, usa <strong>TanStack Query</strong> que agrega
        cache, deduplicación y retry automático.
      </p>
      <CodeBlock code={useFetch} language="tsx" filename="use-fetch.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useLocalStorage — Estado que persiste</h2>
      <p className="text-text-muted mb-4">
        <code>useState</code> que sobrevive al recargar la página. Usa un lazy initializer
        para leer de localStorage solo en el primer render, y <code>useEffect</code> para
        sincronizar cada cambio.
      </p>
      <CodeBlock code={useLocalStorage} language="tsx" filename="use-local-storage.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Reglas de Hooks — Por qué existen</h2>
      <p className="text-text-muted mb-4">
        React identifica cada hook por su <strong>posición en el orden de llamada</strong>.
        Si el orden cambia entre renders (por un if/for), React no sabe qué estado corresponde
        a qué hook. Por eso las reglas son estrictas.
      </p>
      <CodeBlock code={reglas} language="tsx" filename="reglas-hooks.tsx" />

      <InfoBox type="tip" title="¿Cuándo crear un Custom Hook?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Reutilización</strong>: 2+ componentes comparten la misma lógica</li>
          <li><strong>Separación</strong>: el componente tiene demasiada lógica (SRP)</li>
          <li><strong>Encapsulación</strong>: APIs, localStorage, WebSockets, timers</li>
          <li><strong>Testing</strong>: probar lógica aislada con @testing-library/react-hooks</li>
          <li><strong>Composición</strong>: combinar hooks pequeños en lógica más compleja</li>
        </ul>
      </InfoBox>

      <InfoBox type="info" title="Resumen — Custom Hooks">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Función use*</strong>: prefijo obligatorio que activa reglas del linter</li>
          <li><strong>Instancia propia</strong>: cada componente tiene su estado independiente</li>
          <li><strong>Composición</strong>: un hook puede llamar a otros hooks</li>
          <li><strong>Reglas</strong>: siempre top-level, mismo orden, solo en componentes/hooks</li>
          <li><strong>Hooks populares</strong>: useFetch, useLocalStorage, useDebounce, useMediaQuery</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Dos custom hooks reales: <code>useAsync</code> (genérico para operaciones async) y
        <code> useLocalStorage</code> (persistencia), con ejemplo de uso combinado.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/hooks/useAsync.ts + useLocalStorage.ts" />
    </div>
  );
}
