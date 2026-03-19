import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const hookBasico = `// Un Custom Hook es una FUNCIÓN que empieza con "use"
// y puede usar otros hooks adentro.
// Es la forma de REUTILIZAR lógica entre componentes.

// Hook personalizado: useContador
function useContador(inicial: number = 0) {
  const [count, setCount] = useState(inicial);

  const incrementar = () => setCount(c => c + 1);
  const decrementar = () => setCount(c => c - 1);
  const reiniciar = () => setCount(inicial);

  return { count, incrementar, decrementar, reiniciar };
}

// Uso en cualquier componente:
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
  const { count, decrementar } = useContador(100);
  return <button onClick={decrementar}>Count: {count}</button>;
}`;

const useFetch = `// Hook para fetch de datos — extremadamente reutilizable

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

function useLocalStorage<T>(key: string, valorInicial: T) {
  // Inicializa leyendo de localStorage
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

export default function CustomHooksPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Custom Hooks</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los Custom Hooks permiten <strong>extraer y reutilizar lógica</strong> entre
        componentes. Son funciones que empiezan con <code>use</code> y pueden usar
        cualquier hook de React adentro.
      </p>

      <InfoBox type="angular">
        En Angular, la lógica reutilizable va en <strong>servicios</strong> (@Injectable).
        En React, va en <strong>custom hooks</strong>. Los hooks son más flexibles porque
        pueden manejar estado, efectos y cualquier lógica de React directamente.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Tu primer Custom Hook</h2>
      <CodeBlock code={hookBasico} language="tsx" filename="custom-hook-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useFetch — Hook para peticiones HTTP</h2>
      <p className="text-text-muted mb-4">
        Uno de los hooks más útiles. Centraliza la lógica de fetch con estados de carga y error.
      </p>
      <CodeBlock code={useFetch} language="tsx" filename="use-fetch.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useLocalStorage — Persistencia</h2>
      <CodeBlock code={useLocalStorage} language="tsx" filename="use-local-storage.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Reglas de Custom Hooks</h2>
      <CodeBlock code={reglas} language="tsx" filename="reglas-hooks.tsx" />

      <InfoBox type="tip" title="¿Cuándo crear un Custom Hook?">
        <ul className="list-disc list-inside space-y-1">
          <li>Cuando <strong>dos o más componentes</strong> comparten la misma lógica</li>
          <li>Cuando un componente tiene <strong>demasiada lógica</strong> y quieres separar responsabilidades</li>
          <li>Para <strong>encapsular</strong> interacciones con APIs, localStorage, WebSockets, etc.</li>
          <li>Para hacer la lógica <strong>testeable</strong> de forma aislada</li>
        </ul>
      </InfoBox>
    </div>
  );
}
