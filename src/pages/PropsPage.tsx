import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const propsBasicas = `// ¿QUÉ SON las Props?
// Los ARGUMENTOS que recibe un componente — como parámetros de función.
// El padre decide qué datos pasa; el hijo solo los usa (no los modifica).
//
// ¿CÓMO FUNCIONAN?
// React pasa TODAS las props como UN objeto al primer parámetro.
// <Saludo nombre="María" edad={28} /> → props = { nombre: "María", edad: 28 }
// Desestructurar es la convención: ({ nombre, edad }) en vez de (props).
//
// ¿POR QUÉ props y no variables globales?
// Props hacen el flujo de datos EXPLÍCITO y predecible:
// padre → hijo. Sabes exactamente qué datos usa cada componente.

// El componente recibe props como un OBJETO en el primer parámetro
function Saludo(props: { nombre: string; edad: number }) {
  return (
    <div>
      <h1>Hola, {props.nombre}</h1>
      <p>Tienes {props.edad} años</p>
    </div>
  );
}

// Lo más común es DESESTRUCTURAR las props directamente
function SaludoMejor({ nombre, edad }: { nombre: string; edad: number }) {
  return (
    <div>
      <h1>Hola, {nombre}</h1>
      <p>Tienes {edad} años</p>
    </div>
  );
}

// Uso: las props se pasan como atributos en JSX
function App() {
  return (
    <div>
      <SaludoMejor nombre="María" edad={28} />
      <SaludoMejor nombre="Carlos" edad={35} />
    </div>
  );
}`;

const propsInterface = `// Lo recomendado: definir una INTERFACE para las props

interface CardProps {
  titulo: string;               // obligatoria
  descripcion: string;          // obligatoria
  imagen?: string;              // opcional (?)
  destacada?: boolean;          // opcional
  etiquetas?: string[];         // opcional, array de strings
  onClick?: () => void;         // opcional, función sin retorno
  onEliminar?: (id: number) => void; // opcional, función con parámetro
}

function Card({
  titulo,
  descripcion,
  imagen = '/placeholder.jpg',  // valor por defecto si no se pasa
  destacada = false,            // valor por defecto
  etiquetas = [],               // valor por defecto
  onClick,
  onEliminar,
}: CardProps) {
  return (
    <div
      className={\`card \${destacada ? 'card-destacada' : ''}\`}
      onClick={onClick}
    >
      <img src={imagen} alt={titulo} />
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      
      {etiquetas.length > 0 && (
        <div className="tags">
          {etiquetas.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      
      {onEliminar && (
        <button onClick={(e) => {
          e.stopPropagation(); // evita que se active onClick del div padre
          onEliminar(1);
        }}>
          Eliminar
        </button>
      )}
    </div>
  );
}

// Uso con diferentes combinaciones de props
function App() {
  return (
    <div>
      {/* Solo props obligatorias */}
      <Card titulo="React" descripcion="Librería de UI" />

      {/* Con props opcionales */}
      <Card
        titulo="TypeScript"
        descripcion="JavaScript con tipos"
        destacada={true}
        etiquetas={['lenguaje', 'tipos']}
        onClick={() => console.log('click')}
      />
    </div>
  );
}`;

const childrenProp = `// CHILDREN: la prop más importante para composición
//
// ¿CÓMO funciona?
// Todo lo que pones ENTRE <Componente> y </Componente> llega como
// props.children. Es ReactNode: puede ser JSX, strings, números, arrays.
// Angular usa <ng-content> para esto; React lo hace automático.

interface ContenedorProps {
  children: React.ReactNode;  // ReactNode = cualquier cosa renderizable
  titulo?: string;
}

function Contenedor({ children, titulo }: ContenedorProps) {
  return (
    <div className="border rounded-lg p-4">
      {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
      {children}  {/* Aquí se renderiza lo que va dentro */}
    </div>
  );
}

// Uso: lo que pones ENTRE las etiquetas es "children"
function App() {
  return (
    <Contenedor titulo="Mi Sección">
      <p>Este párrafo es el children del Contenedor</p>
      <p>Y este también</p>
      <button>Y este botón también</button>
    </Contenedor>
  );
}

// Puedes anidar componentes con children infinitamente:
function PaginaCompleta() {
  return (
    <Layout>
      <Sidebar>
        <Menu />
      </Sidebar>
      <Main>
        <Contenedor titulo="Artículos">
          <ListaArticulos />
        </Contenedor>
      </Main>
    </Layout>
  );
}`;

const propsInmutables = `// ⚠️ REGLA FUNDAMENTAL: Las props son de SOLO LECTURA

interface ContadorProps {
  valor: number;
}

// ❌ NUNCA hagas esto — las props son INMUTABLES
function ContadorMalo({ valor }: ContadorProps) {
  // valor = valor + 1;  // ❌ ERROR: no puedes modificar props
  // props.valor = 10;   // ❌ ERROR: no puedes modificar props
  return <p>{valor}</p>;
}

// ✅ Si necesitas modificar algo, usa ESTADO (useState)
// El padre controla el valor, el hijo solo lo muestra
function ContadorDisplay({ valor }: ContadorProps) {
  return <p>Contador: {valor}</p>;
}

// El padre es quien cambia el estado
function PadreControlador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <ContadorDisplay valor={contador} />
      <button onClick={() => setContador(c => c + 1)}>
        Incrementar
      </button>
    </div>
  );
}`;

const spreadProps = `// SPREAD de props — pasar múltiples props de un objeto

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ label, ...inputProps }: InputProps) {
  // "...inputProps" captura TODAS las props excepto "label"
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />  {/* Spread: pasa todas las props restantes */}
    </div>
  );
}

// Uso
function Formulario() {
  const campoConfig = {
    type: 'email',
    placeholder: 'tu@email.com',
    required: true,
  };

  return (
    <div>
      {/* Pasar props una por una */}
      <InputField
        label="Nombre"
        type="text"
        placeholder="Tu nombre"
        required={true}
      />

      {/* O usar spread de un objeto */}
      <InputField label="Email" {...campoConfig} />
    </div>
  );
}`;

const pasarFunciones = `// Pasar FUNCIONES como props (equivalente a @Output en Angular)

interface ListaItemProps {
  id: number;
  texto: string;
  completado: boolean;
  onToggle: (id: number) => void;      // el hijo LLAMA esta función
  onEliminar: (id: number) => void;    // el hijo LLAMA esta función
}

function ListaItem({ id, texto, completado, onToggle, onEliminar }: ListaItemProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={completado}
        onChange={() => onToggle(id)}  // Llama al padre con el id
      />
      <span className={completado ? 'line-through' : ''}>
        {texto}
      </span>
      <button onClick={() => onEliminar(id)}>❌</button>
    </div>
  );
}

// El PADRE define las funciones y las pasa como props
function ListaTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Aprender React', completado: false },
    { id: 2, texto: 'Crear proyecto', completado: false },
  ]);

  const toggleTarea = (id: number) => {
    setTareas(prev =>
      prev.map(t => t.id === id ? { ...t, completado: !t.completado } : t)
    );
  };

  const eliminarTarea = (id: number) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      {tareas.map(tarea => (
        <ListaItem
          key={tarea.id}
          {...tarea}
          onToggle={toggleTarea}
          onEliminar={eliminarTarea}
        />
      ))}
    </div>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/NotificationList.tsx
// Ejemplo COMPLETO: props, children, funciones, spread
// ============================================
import { useState } from 'react';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'warning' | 'error';
  leida: boolean;
}

interface NotificationItemProps {
  notificacion: Notification;
  onMarcarLeida: (id: number) => void;
  onEliminar: (id: number) => void;
}

// Componente hijo: recibe datos y funciones como props
function NotificationItem({ notificacion, onMarcarLeida, onEliminar }: NotificationItemProps) {
  const colores = {
    info: 'border-blue-400 bg-blue-50',
    warning: 'border-yellow-400 bg-yellow-50',
    error: 'border-red-400 bg-red-50',
  };

  return (
    <div className={\`p-4 border-l-4 rounded mb-2 \${colores[notificacion.tipo]} \${
      notificacion.leida ? 'opacity-50' : ''
    }\`}>
      <div className="flex justify-between">
        <h4 className="font-bold">{notificacion.titulo}</h4>
        <div className="flex gap-2">
          {!notificacion.leida && (
            <button onClick={() => onMarcarLeida(notificacion.id)}
              className="text-sm text-blue-600 hover:underline">
              Marcar leída
            </button>
          )}
          <button onClick={() => onEliminar(notificacion.id)}
            className="text-sm text-red-600 hover:underline">
            Eliminar
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{notificacion.mensaje}</p>
    </div>
  );
}

// Componente contenedor con children
function Panel({ children, titulo }: { children: React.ReactNode; titulo: string }) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">{titulo}</h2>
      {children}
    </div>
  );
}

// Componente padre: tiene el estado y pasa funciones como props
export default function NotificationList() {
  const [notificaciones, setNotificaciones] = useState<Notification[]>([
    { id: 1, titulo: 'Bienvenido', mensaje: 'Tu cuenta fue creada', tipo: 'info', leida: false },
    { id: 2, titulo: 'Alerta', mensaje: 'Tu sesión expirará pronto', tipo: 'warning', leida: false },
    { id: 3, titulo: 'Error', mensaje: 'No se pudo guardar', tipo: 'error', leida: false },
  ]);

  const marcarLeida = (id: number) => {
    setNotificaciones(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const eliminar = (id: number) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  };

  const sinLeer = notificaciones.filter(n => !n.leida).length;

  return (
    <Panel titulo={\`Notificaciones (\${sinLeer} sin leer)\`}>
      {notificaciones.length === 0 ? (
        <p className="text-gray-400">No hay notificaciones</p>
      ) : (
        notificaciones.map(n => (
          <NotificationItem
            key={n.id}
            notificacion={n}
            onMarcarLeida={marcarLeida}
            onEliminar={eliminar}
          />
        ))
      )}
    </Panel>
  );
}`;

export default function PropsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Props</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Las props son el mecanismo para <strong>pasar datos de padre a hijo</strong>.
        Son los parámetros de tus componentes, como los argumentos de una función.
        Son <strong>inmutables</strong> — el componente hijo no puede modificarlas.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Props básicas</h2>
      <p className="text-text-muted mb-4">
        Las props llegan como un objeto al primer parámetro de la función. La
        convención es desestructurarlas directamente.
      </p>
      <CodeBlock code={propsBasicas} language="tsx" filename="props-basicas.tsx" />

      <InfoBox type="angular" title="Props vs @Input()">
        En Angular usas <code>@Input() nombre: string;</code> como propiedad de clase.
        En React las props son el <strong>parámetro de la función</strong>. No hay
        decoradores, no hay metadata. Las pasas como atributos JSX y llegan como un
        objeto. Es más directo y funcional.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Tipado con interfaces</h2>
      <p className="text-text-muted mb-4">
        Definir una interface para las props es la práctica recomendada. TypeScript te
        avisará si olvidas una prop obligatoria o pasas el tipo incorrecto.
      </p>
      <CodeBlock code={propsInterface} language="tsx" filename="props-interface.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Children — La prop especial</h2>
      <p className="text-text-muted mb-4">
        <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">children</code> es una
        prop especial que contiene lo que pones <strong>entre las etiquetas</strong> del
        componente. Es equivalente a <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">&lt;ng-content&gt;</code> de
        Angular.
      </p>
      <CodeBlock code={childrenProp} language="tsx" filename="children-prop.tsx" />

      <InfoBox type="angular" title="children vs ng-content">
        Angular usa <code>&lt;ng-content&gt;</code> para proyectar contenido dentro de un componente.
        En React es automático: todo lo que va entre las etiquetas del componente llega como{' '}
        <code>children</code>. No necesitas declarar ningún slot especial.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Props son inmutables</h2>
      <p className="text-text-muted mb-4">
        Esta regla es sagrada en React: <strong>nunca modifiques las props</strong>.
        Los datos fluyen en una sola dirección: de padre a hijo.
      </p>
      <CodeBlock code={propsInmutables} language="tsx" filename="props-inmutables.tsx" />

      <InfoBox type="warning" title="Flujo unidireccional de datos">
        React sigue un modelo de <strong>flujo unidireccional</strong>: los datos bajan
        del padre al hijo via props. Si el hijo necesita comunicarse con el padre,
        lo hace llamando una <strong>función que el padre le pasó como prop</strong>.
        Nunca modifica la prop directamente.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Spread de props</h2>
      <p className="text-text-muted mb-4">
        El operador spread (<code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">...</code>)
        permite pasar múltiples props desde un objeto de una sola vez.
      </p>
      <CodeBlock code={spreadProps} language="tsx" filename="spread-props.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Funciones como props (comunicación hijo → padre)</h2>
      <p className="text-text-muted mb-4">
        Para que un hijo comunique algo al padre, el padre pasa una función como prop
        y el hijo la llama. Es el equivalente a <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">@Output() + EventEmitter</code> de
        Angular, pero más simple.
      </p>
      <CodeBlock code={pasarFunciones} language="tsx" filename="funciones-como-props.tsx" />

      <InfoBox type="angular" title="@Output + EventEmitter vs funciones como props">
        <p>
          En Angular: <code>@Output() onToggle = new EventEmitter&lt;number&gt;()</code> y luego{' '}
          <code>this.onToggle.emit(id)</code>. En React: simplemente pasas una función
          como prop y el hijo la llama: <code>onToggle(id)</code>. Mismo resultado, menos
          boilerplate.
        </p>
      </InfoBox>

      <InfoBox type="tip" title="Resumen de Props">
        <ul className="list-disc list-inside space-y-1">
          <li>Son el <strong>parámetro de la función</strong> componente</li>
          <li>Fluyen de <strong>padre a hijo</strong> (unidireccional)</li>
          <li>Son <strong>inmutables</strong> — no las modifiques</li>
          <li><code>children</code> es lo que va entre las etiquetas</li>
          <li>Funciones como props = comunicación hijo → padre</li>
          <li>Usa interfaces para tipar las props</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Sistema de notificaciones: props tipadas, children, funciones como props (hijo → padre),
        estado derivado, y renderizado condicional.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/NotificationList.tsx" />
    </div>
  );
}
