import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const reducerBasico = `import { useReducer } from 'react';

// useReducer es como useState pero para estado COMPLEJO.
// Sigue el patrón: (estado, acción) => nuevoEstado

// 1. Definir el tipo del estado y las acciones
interface Estado {
  count: number;
}

type Accion =
  | { type: 'incrementar' }
  | { type: 'decrementar' }
  | { type: 'reiniciar' }
  | { type: 'establecer'; payload: number };

// 2. Definir el reducer (función PURA)
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
      return estado;
  }
}

// 3. Usar en el componente
function Contador() {
  const [estado, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {estado.count}</p>
      <button onClick={() => dispatch({ type: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrementar' })}>-</button>
      <button onClick={() => dispatch({ type: 'reiniciar' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'establecer', payload: 100 })}>
        Ir a 100
      </button>
    </div>
  );
}`;

const reducerComplejo = `// Ejemplo real: gestión de un formulario con useReducer

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

const vsUseState = `// ¿Cuándo useReducer vs useState?

// ✅ useState: estado simple (booleano, string, número)
const [nombre, setNombre] = useState('');
const [activo, setActivo] = useState(false);

// ✅ useReducer: estado complejo con múltiples sub-valores
// o cuando las transiciones de estado siguen una lógica clara
const [formState, dispatch] = useReducer(formReducer, initialState);

// REGLA GENERAL:
// - 1-3 valores simples → useState
// - 4+ valores relacionados → useReducer
// - Lógica de transición compleja → useReducer
// - Estado que otros devs necesitan entender → useReducer
//   (las acciones documentan las transiciones)`;

export default function UseReducerPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useReducer</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>useReducer</code> es una alternativa a <code>useState</code> para estado complejo.
        Usa el patrón <strong>reducer</strong>: defines acciones que describen qué pasó, y una
        función pura decide cómo cambia el estado.
      </p>

      <InfoBox type="angular">
        Si conoces NgRx en Angular, <code>useReducer</code> es el mismo patrón (reducer + dispatch + actions)
        pero integrado directamente en React sin librerías externas. Si no conoces NgRx, piensa en
        useReducer como un useState más estructurado para estado complejo.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Reducer básico</h2>
      <CodeBlock code={reducerBasico} language="tsx" filename="reducer-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Ejemplo real: formulario</h2>
      <CodeBlock code={reducerComplejo} language="tsx" filename="reducer-form.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿useState o useReducer?</h2>
      <CodeBlock code={vsUseState} language="tsx" filename="useState-vs-useReducer.tsx" />

      <InfoBox type="tip" title="useReducer + Context = mini Redux">
        Combinar <code>useReducer</code> con <code>Context</code> te da un sistema de estado
        global similar a Redux pero sin librerías externas. Ideal para apps medianas.
      </InfoBox>
    </div>
  );
}
