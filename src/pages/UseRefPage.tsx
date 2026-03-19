import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const refDom = `import { useRef, useEffect } from 'react';

// useRef tiene 2 usos principales:
// 1. Acceder a elementos del DOM directamente
// 2. Guardar valores que persisten entre renders sin causar re-render

// USO 1: Referencia al DOM (como @ViewChild en Angular)
function InputConFoco() {
  const inputRef = useRef<HTMLInputElement>(null);

  const enfocar = () => {
    inputRef.current?.focus(); // Accede al elemento DOM directamente
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Escribe aquí..." />
      <button onClick={enfocar}>Enfocar input</button>
    </div>
  );
}`;

const refValor = `// USO 2: Guardar valores mutables que NO causan re-render

function Cronometro() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const intervalRef = useRef<number | null>(null);
  // ↑ Este valor persiste entre renders pero NO causa re-render al cambiar

  const iniciar = () => {
    setCorriendo(true);
    intervalRef.current = window.setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);
  };

  const detener = () => {
    setCorriendo(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // ¿Por qué useRef y no useState para el interval?
  // Porque cambiar el ID del interval NO necesita re-render.
  // useState causaría un render innecesario.

  return (
    <div>
      <p>Tiempo: {tiempo}s</p>
      <button onClick={corriendo ? detener : iniciar}>
        {corriendo ? 'Detener' : 'Iniciar'}
      </button>
    </div>
  );
}`;

const refVsState = `// useRef vs useState — ¿Cuándo usar cada uno?

function Comparacion() {
  // useState: el componente se RE-RENDERIZA cuando cambia
  const [nombre, setNombre] = useState('');

  // useRef: el componente NO se re-renderiza cuando cambia
  const renderCount = useRef(0);

  // Cada vez que el componente se renderiza:
  renderCount.current += 1;
  // ↑ Esto NO causa otro render (a diferencia de setState)

  return (
    <div>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <p>Renders: {renderCount.current}</p>
    </div>
  );
}

// RESUMEN:
// ┌─────────────┬──────────────────┬──────────────────┐
// │             │ useState         │ useRef           │
// ├─────────────┼──────────────────┼──────────────────┤
// │ Re-render   │ SÍ               │ NO               │
// │ Persiste    │ SÍ               │ SÍ               │
// │ Uso típico  │ UI, datos        │ DOM, timers, IDs │
// │ Acceso      │ valor directo    │ .current         │
// └─────────────┴──────────────────┴──────────────────┘`;

export default function UseRefPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useRef</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>useRef</code> crea una referencia mutable que persiste entre renders.
        Tiene dos usos: acceder al DOM directamente y guardar valores que no necesitan
        causar re-renders.
      </p>

      <InfoBox type="angular">
        En Angular usas <code>@ViewChild('miRef')</code> para acceder a elementos del DOM.
        En React usas <code>useRef</code> + el atributo <code>ref</code> en el JSX. Mismo concepto,
        diferente API.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Referencia al DOM</h2>
      <CodeBlock code={refDom} language="tsx" filename="ref-dom.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Guardar valores mutables</h2>
      <CodeBlock code={refValor} language="tsx" filename="ref-valor.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useRef vs useState</h2>
      <CodeBlock code={refVsState} language="tsx" filename="ref-vs-state.tsx" />

      <InfoBox type="tip" title="¿Cuándo usar useRef?">
        <ul className="list-disc list-inside space-y-1">
          <li>Acceder a elementos del DOM (focus, scroll, medir)</li>
          <li>Guardar IDs de timers (setInterval, setTimeout)</li>
          <li>Guardar el valor anterior de un estado</li>
          <li>Cualquier valor mutable que NO necesite re-render</li>
        </ul>
      </InfoBox>
    </div>
  );
}
