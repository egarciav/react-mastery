import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const tiposComponentes = `// TypeScript con componentes: NUNCA uses React.FC
// React.FC tiene problemas históricos y ya no se recomienda.

// ❌ Evitar: React.FC
const ComponenteMalo: React.FC<{ nombre: string }> = ({ nombre }) => {
  return <p>{nombre}</p>;
};

// ✅ Preferir: tipo explícito en los parámetros
function Saludo({ nombre, edad }: { nombre: string; edad: number }) {
  return <p>{nombre}, {edad} años</p>;
}

// ✅ Con interface separada (recomendado para props complejas)
interface TarjetaProps {
  titulo: string;
  descripcion?: string;
  onClick: () => void;
}

function Tarjeta({ titulo, descripcion, onClick }: TarjetaProps) {
  return <div onClick={onClick}><h2>{titulo}</h2></div>;
}

// ✅ Tipar el valor de retorno (opcional pero útil en componentes complejos)
function Boton({ children }: { children: React.ReactNode }): React.ReactElement {
  return <button>{children}</button>;
}`;

const tiposChildren = `// Tipos para 'children' — cuál usar cuándo

interface Props1 {
  children: React.ReactNode;        // ✅ Más amplio: JSX, strings, números, null, arrays
}
interface Props2 {
  children: React.ReactElement;     // Solo un único elemento JSX (no strings ni null)
}
interface Props3 {
  children: string;                 // Solo strings de texto
}
interface Props4 {
  children: React.ReactNode[];      // Array de cualquier cosa renderizable
}

// La mayoría de veces quieres ReactNode:
function Layout({ children }: { children: React.ReactNode }) {
  return <div className="layout">{children}</div>;
}`;

const tiposEventos = `// Tipos de eventos — los más comunes

function Formulario() {
  // onChange en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  // onChange en select
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  // onChange en textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
  };

  // onSubmit en form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // onClick en button
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  // onKeyDown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') console.log('Enter');
  };

  // Atajo: si no necesitas el tipo del target, usa solo el tipo base
  const handleGenericClick = (e: React.MouseEvent) => {};
  const handleGenericChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return <form onSubmit={handleSubmit}>...</form>;
}`;

const hooksTyped = `// TypeScript con Hooks — patrones y tipos

// useState con tipo explícito cuando no puede inferirse
const [usuario, setUsuario] = useState<Usuario | null>(null);
const [estado, setEstado] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
const [items, setItems] = useState<string[]>([]);

// useRef con tipo del elemento DOM
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);

// useRef para valores mutables (NO null, tiene valor inicial)
const contadorRef = useRef<number>(0);
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

// useReducer tipado
type Estado = { count: number; loading: boolean };
type Accion =
  | { type: 'increment' }
  | { type: 'setLoading'; payload: boolean };

const [state, dispatch] = useReducer(
  (estado: Estado, accion: Accion): Estado => {
    switch (accion.type) {
      case 'increment': return { ...estado, count: estado.count + 1 };
      case 'setLoading': return { ...estado, loading: accion.payload };
    }
  },
  { count: 0, loading: false }
);

// Context tipado
interface TemaContextType { tema: 'claro' | 'oscuro'; toggle: () => void; }
const TemaContext = createContext<TemaContextType | null>(null);`;

const utilityTypes = `// Utility types de TypeScript muy útiles en React

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  rol: 'admin' | 'usuario';
}

// Partial<T>: todas las props opcionales (para updates parciales)
function actualizarUsuario(id: number, datos: Partial<Usuario>) {
  // datos puede tener solo algunas props de Usuario
}

// Omit<T, K>: quitar props específicas
type UsuarioSinId = Omit<Usuario, 'id'>;
// { nombre, email, edad, rol }

// Pick<T, K>: seleccionar solo ciertas props
type CredencialesUsuario = Pick<Usuario, 'email' | 'rol'>;
// { email, rol }

// Required<T>: hace todas las props obligatorias
type UsuarioCompleto = Required<Usuario>;

// Readonly<T>: no se puede modificar
type UsuarioReadonly = Readonly<Usuario>;

// ComponentProps: obtener los tipos de props de un elemento HTML
type InputProps = React.ComponentPropsWithRef<'input'>;
// ↑ Contiene TODAS las props nativas de <input>

// Para extender props nativas de un elemento HTML:
interface MiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;  // prop extra
  error?: string; // prop extra
}

function MiInput({ label, error, ...inputProps }: MiInputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />  {/* pasa todas las props nativas */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}`;

const genericos = `// Generics en componentes y hooks

// Componente genérico: Lista que funciona con cualquier tipo
interface ListaProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function Lista<T>({ items, renderItem, keyExtractor }: ListaProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Uso: TypeScript infiere el tipo automáticamente
interface Producto { id: number; nombre: string; precio: number; }

function App() {
  const productos: Producto[] = [...];

  return (
    <Lista
      items={productos}
      keyExtractor={p => p.id}        // TypeScript sabe que p es Producto
      renderItem={p => <span>{p.nombre} - \${p.precio}</span>}
    />
  );
}

// Hook genérico
function useLocalStorage<T>(key: string, inicial: T): [T, (v: T) => void] {
  const [valor, setValor] = useState<T>(() => {
    const guardado = localStorage.getItem(key);
    return guardado ? JSON.parse(guardado) : inicial;
  });
  // ...
  return [valor, setValor];
}

const [tema, setTema] = useLocalStorage<'claro' | 'oscuro'>('tema', 'oscuro');`;

export default function TypeScriptReactPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">TypeScript con React</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        TypeScript y React son una combinación poderosa. Como vienes de Angular
        (donde TS es obligatorio), ya tienes la base. Aquí están los patrones
        específicos de <strong>TypeScript en el contexto de React</strong>.
      </p>

      <InfoBox type="angular" title="TypeScript en Angular vs React">
        En Angular TypeScript es obligatorio y muy estricto (decoradores, metadata types, DI tokens).
        En React es opcional pero altamente recomendado. La gran diferencia es que React aprovecha
        TypeScript de forma más funcional: <strong>tipos en funciones, generics en hooks y componentes</strong>,
        sin decoradores ni metadata especial.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Tipar componentes — No uses React.FC</h2>
      <CodeBlock code={tiposComponentes} language="tsx" filename="tipos-componentes.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tipos para children</h2>
      <CodeBlock code={tiposChildren} language="tsx" filename="tipos-children.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tipos de eventos</h2>
      <CodeBlock code={tiposEventos} language="tsx" filename="tipos-eventos.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Hooks tipados</h2>
      <CodeBlock code={hooksTyped} language="tsx" filename="hooks-tipados.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Utility Types de TypeScript</h2>
      <p className="text-text-muted mb-4">
        TypeScript ofrece tipos utilitarios que son especialmente útiles en React.
      </p>
      <CodeBlock code={utilityTypes} language="tsx" filename="utility-types.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Generics en componentes y hooks</h2>
      <CodeBlock code={genericos} language="tsx" filename="genericos.tsx" />

      <InfoBox type="tip" title="Reglas prácticas de TypeScript con React">
        <ul className="list-disc list-inside space-y-1">
          <li>Prefiere <strong>function declarations</strong> sobre React.FC</li>
          <li>Usa <strong>interfaces</strong> para props de componentes</li>
          <li>Usa <strong>type</strong> para unions, tuples y tipos complejos</li>
          <li>Extiende <strong>HTMLAttributes</strong> para componentes que envuelven elementos HTML</li>
          <li><strong>Generics</strong> en componentes de lista y hooks reutilizables</li>
          <li><code>React.ReactNode</code> para children en la mayoría de casos</li>
        </ul>
      </InfoBox>
    </div>
  );
}
