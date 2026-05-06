import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const reducerBasico = `import { useReducer } from 'react';

// ¿QUÉ ES useReducer?
// Es useState para estado COMPLEJO. En vez de llamar setState directamente,
// envías ACCIONES que describen QUÉ PASÓ, y una función REDUCER decide
// CÓMO cambia el estado basándose en la acción.
//
// ¿CÓMO FUNCIONA internamente?
// const [estado, dispatch] = useReducer(reducer, estadoInicial);
//
// 1. dispatch({ type: 'incrementar' })  ← describes QUÉ pasó
// 2. React llama: reducer(estadoActual, { type: 'incrementar' })
// 3. El reducer retorna el NUEVO estado
// 4. React compara nuevo vs anterior → re-render si cambió
//
// ¿POR QUÉ este patrón?
// - PREDECIBLE: dado el mismo estado + misma acción → mismo resultado
// - DOCUMENTADO: las acciones son un "log" de todo lo que puede pasar
// - TESTEABLE: el reducer es una función pura, fácil de testear
// - CENTRALIZADO: toda la lógica de estado en UN lugar

// PASO 1: Definir tipos (TypeScript hace que las acciones sean seguras)
interface Estado {
  count: number;
}

// Union type: TypeScript sabe EXACTAMENTE qué acciones existen
// Si despachas { type: 'incrementr' } (typo) → error de compilación ✅
type Accion =
  | { type: 'incrementar' }
  | { type: 'decrementar' }
  | { type: 'reiniciar' }
  | { type: 'establecer'; payload: number };

// PASO 2: El reducer — función PURA (sin side effects)
// Recibe estado actual + acción → retorna nuevo estado
function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.type) {
    case 'incrementar':
      return { ...estado, count: estado.count + 1 };
    case 'decrementar':
      return { ...estado, count: estado.count - 1 };
    case 'reiniciar':
      return { ...estado, count: 0 };
    case 'establecer':
      return { ...estado, count: accion.payload };
    default:
      return estado; // acción desconocida → estado sin cambios
  }
  // ⚠️ SIEMPRE retorna un NUEVO objeto (inmutabilidad)
  // { ...estado, count: X } crea copia con count modificado
}

// PASO 3: Usar en el componente
function Contador() {
  // useReducer(función reducer, estado inicial)
  // Retorna: [estado actual, función dispatch]
  const [estado, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {estado.count}</p>
      {/* dispatch envía acciones → el reducer decide qué hacer */}
      <button onClick={() => dispatch({ type: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrementar' })}>-</button>
      <button onClick={() => dispatch({ type: 'reiniciar' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'establecer', payload: 100 })}>
        Ir a 100
      </button>
    </div>
  );
}`;

const reducerComplejo = `// Ejemplo REAL: formulario con múltiples estados relacionados
//
// ¿POR QUÉ useReducer para un formulario?
// Este form tiene 5 estados interrelacionados: campos, loading, error, éxito.
// Con useState tendrías 5 setters y la lógica dispersa por el componente.
// Con useReducer: toda la lógica en el reducer, el componente solo despacha.
//
// Además, las transiciones de estado son IMPOSIBLES de hacer mal:
// ENVIAR siempre activa loading y limpia errores — en UN solo lugar.
// Con useState podrías olvidar limpiar el error al enviar.

interface FormState {
  nombre: string;
  email: string;
  enviando: boolean;
  error: string | null;
  exito: boolean;
}

type FormAction =
  | { type: 'SET_CAMPO'; campo: string; valor: string }
  | { type: 'ENVIAR' }
  | { type: 'EXITO' }
  | { type: 'ERROR'; mensaje: string }
  | { type: 'RESET' };

const estadoInicial: FormState = {
  nombre: '', email: '', enviando: false, error: null, exito: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_CAMPO':
      return { ...state, [action.campo]: action.valor, error: null };
    case 'ENVIAR':
      return { ...state, enviando: true, error: null };
    case 'EXITO':
      return { ...estadoInicial, exito: true };
    case 'ERROR':
      return { ...state, enviando: false, error: action.mensaje };
    case 'RESET':
      return estadoInicial;
    default:
      return state;
  }
}

function FormularioContacto() {
  const [state, dispatch] = useReducer(formReducer, estadoInicial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'ENVIAR' });
    try {
      await fetch('/api/contacto', {
        method: 'POST',
        body: JSON.stringify({ nombre: state.nombre, email: state.email }),
      });
      dispatch({ type: 'EXITO' });
    } catch {
      dispatch({ type: 'ERROR', mensaje: 'Error al enviar' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.nombre}
        onChange={e => dispatch({
          type: 'SET_CAMPO', campo: 'nombre', valor: e.target.value
        })}
      />
      <input
        value={state.email}
        onChange={e => dispatch({
          type: 'SET_CAMPO', campo: 'email', valor: e.target.value
        })}
      />
      <button disabled={state.enviando}>
        {state.enviando ? 'Enviando...' : 'Enviar'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.exito && <p className="exito">¡Enviado!</p>}
    </form>
  );
}`;

const vsUseState = `// ¿Cuándo useReducer vs useState? — Guía de decisión
//
// La pregunta clave: ¿el próximo estado depende del estado actual
// Y de qué acción ocurrió? Si sí → useReducer.

// ✅ useState: estado simple e independiente
const [nombre, setNombre] = useState('');
const [activo, setActivo] = useState(false);
// Cada valor cambia independientemente. No hay "transiciones".

// ✅ useReducer: estados relacionados con transiciones complejas
const [formState, dispatch] = useReducer(formReducer, initialState);
// Al ENVIAR: loading=true, error=null (2 cambios atómicos)
// Al ERROR: loading=false, error=mensaje (2 cambios atómicos)
// Con useState tendrías que recordar hacer AMBOS cambios cada vez.

// ─── TABLA DE DECISIÓN ───
// ┌────────────────────────────────┬───────────┬─────────────┐
// │ Situación                      │ useState  │ useReducer  │
// ├────────────────────────────────┼───────────┼─────────────┤
// │ 1-3 valores independientes     │ ✅        │             │
// │ 4+ valores relacionados        │           │ ✅          │
// │ Transiciones de estado claras  │           │ ✅          │
// │ Loading/error/success pattern  │           │ ✅          │
// │ Lógica que otros devs leerán   │           │ ✅          │
// │ Estado en un Context global    │           │ ✅          │
// │ Toggle simple (on/off)         │ ✅        │             │
// └────────────────────────────────┴───────────┴─────────────┘

// ─── Bonus: testing ───
// Un reducer es una función pura → se testea sin React:
// test('incrementar sube el count', () => {
//   const resultado = reducer({ count: 0 }, { type: 'incrementar' });
//   expect(resultado.count).toBe(1);
// });
// No necesitas renderizar componentes para testear la lógica.`;

const ejemploGithub = `// ============================================
// 📁 src/components/TodoApp.tsx
// Ejemplo COMPLETO: useReducer para CRUD de tareas
// ============================================
import { useReducer, useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

type Action =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' };

function todosReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.text, completed: false }];
    case 'TOGGLE':
      return state.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.id);
    case 'CLEAR_COMPLETED':
      return state.filter(t => !t.completed);
  }
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 1, text: 'Aprender useReducer', completed: true },
    { id: 2, text: 'Crear proyecto React', completed: false },
    { id: 3, text: 'Subir a GitHub', completed: false },
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: 'ADD', text: input.trim() });
      setInput('');
    }
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const remaining = todos.filter(t => !t.completed).length;

  return (
    <div className="max-w-md mx-auto border rounded-xl overflow-hidden">
      <form onSubmit={handleSubmit} className="flex border-b">
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Nueva tarea..." className="flex-1 px-4 py-3" />
        <button type="submit" className="px-4 bg-blue-500 text-white">+</button>
      </form>

      <ul>
        {filtered.map(todo => (
          <li key={todo.id} className="flex items-center px-4 py-2 border-b">
            <input type="checkbox" checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
              className="mr-3" />
            <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-400' : ''}\`}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
              className="text-red-400 hover:text-red-600">✕</button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm">
        <span>{remaining} pendientes</span>
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={\`px-2 py-1 rounded \${filter === f ? 'bg-blue-500 text-white' : ''}\`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          className="text-red-500 hover:underline">Limpiar</button>
      </div>
    </div>
  );
}`;

export default function UseReducerPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useReducer</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>useReducer</code> es <code>useState</code> para estado complejo. En vez de
        mutar el estado directamente, envías <strong>acciones</strong> que describen qué pasó,
        y una función <strong>reducer</strong> (pura, testeable) decide cómo cambia el estado.
        El patrón garantiza transiciones predecibles y centralizadas.
      </p>

      <InfoBox type="angular" title="Angular NgRx vs React useReducer">
        <p>
          Si conoces <strong>NgRx</strong> en Angular, <code>useReducer</code> es exactamente el
          mismo patrón: reducer + dispatch + actions. La diferencia: NgRx es una librería externa
          con stores, effects, y selectors. <code>useReducer</code> está integrado en React y es
          más simple — cubre el 80% de los casos. Para el 20% restante (side effects complejos,
          estado global grande), considera <strong>Zustand</strong> o <strong>Redux Toolkit</strong>.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Reducer básico — El patrón paso a paso</h2>
      <p className="text-text-muted mb-4">
        Tres pasos: definir tipos (estado + acciones), escribir el reducer (función pura),
        y usar <code>useReducer</code> en el componente. Las acciones describen <strong>qué
        pasó</strong>; el reducer decide <strong>cómo cambia</strong> el estado.
      </p>
      <CodeBlock code={reducerBasico} language="tsx" filename="reducer-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Ejemplo real — Formulario con loading/error/éxito</h2>
      <p className="text-text-muted mb-4">
        Un formulario con 5 estados interrelacionados: campos, loading, error, éxito. Con
        <code> useReducer</code>, cada acción (ENVIAR, EXITO, ERROR) actualiza múltiples
        valores de forma <strong>atómica</strong> — imposible olvidar un cambio.
      </p>
      <CodeBlock code={reducerComplejo} language="tsx" filename="reducer-form.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿useState o useReducer? — Guía de decisión</h2>
      <p className="text-text-muted mb-4">
        Si el próximo estado depende del estado actual <strong>y</strong> de qué acción ocurrió,
        usa <code>useReducer</code>. Si son valores simples e independientes, <code>useState</code>
        es suficiente. Un reducer también es más fácil de testear (es una función pura).
      </p>
      <CodeBlock code={vsUseState} language="tsx" filename="useState-vs-useReducer.tsx" />

      <InfoBox type="info" title="useReducer + Context = estado global sin librerías">
        Combinar <code>useReducer</code> con <code>Context</code> te da un mini-Redux:
        el reducer maneja la lógica, Context lo distribuye, y dispatch permite que cualquier
        componente envíe acciones. Ideal para apps medianas (tema, auth, carrito). Para apps
        grandes con mucho estado asíncrono, considera Zustand o TanStack Query.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — useReducer">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>dispatch(acción)</strong> → reducer(estado, acción) → nuevo estado</li>
          <li><strong>Función pura</strong>: mismo estado + misma acción = mismo resultado</li>
          <li><strong>Transiciones atómicas</strong>: una acción cambia múltiples valores de forma segura</li>
          <li><strong>TypeScript</strong>: union types en acciones dan seguridad y autocompletado</li>
          <li><strong>Testeable</strong>: el reducer se testea sin renderizar componentes</li>
          <li><strong>useState</strong> para simple, <strong>useReducer</strong> para complejo</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Todo App: useReducer con acciones tipadas (ADD, TOGGLE, DELETE, CLEAR_COMPLETED),
        filtros, estado derivado, y formulario controlado.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/TodoApp.tsx" />
    </div>
  );
}
