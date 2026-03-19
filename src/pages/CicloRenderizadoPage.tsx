import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const virtualDom = `// ¿Qué es el Virtual DOM?
//
// React mantiene una representación en memoria del DOM (Virtual DOM).
// Cuando el estado cambia, React:
// 1. Crea un nuevo Virtual DOM
// 2. Lo compara con el anterior (DIFFING)
// 3. Calcula los cambios mínimos (RECONCILIATION)
// 4. Aplica SOLO esos cambios al DOM real (COMMIT)
//
// Esto es mucho más eficiente que manipular el DOM directamente
// en cada cambio, porque las operaciones de DOM son costosas.

// Ejemplo visual:
// Estado anterior:          Estado nuevo:
// <ul>                      <ul>
//   <li>Manzana</li>   →      <li>Manzana</li>
//   <li>Banana</li>           <li>Banana</li>
//   <li>Cereza</li>           <li>Cereza</li>
// </ul>                       <li>Durazno</li>  ← Solo agrega esto
//                           </ul>
//
// React NO re-renderiza toda la lista, solo agrega el último <li>.`;

const fasesRender = `// Las 3 FASES del ciclo de render en React

// FASE 1: TRIGGER (disparador)
// Un render se dispara cuando:
// - El componente se monta por primera vez
// - Cambias estado con setState
// - El componente padre se re-renderiza
// - Cambias props que recibe el componente

function Contador() {
  const [count, setCount] = useState(0); // mount = primer render

  return (
    <button onClick={() => setCount(c => c + 1)}> // click = re-render
      {count}
    </button>
  );
}

// FASE 2: RENDER (cálculo)
// React llama a tu función componente y obtiene el nuevo JSX.
// Esta fase es PURA: no tiene efectos secundarios.
// React puede ejecutarla múltiples veces (StrictMode lo hace adrede).
//
// ⚠️ Por eso no hagas fetch, console.log o mutaciones en el render:
function ComponenteMalo() {
  fetch('/api/data'); // ❌ Efecto secundario en el render
  console.log('render'); // Se ejecuta múltiples veces
  return <div>Hola</div>;
}

// FASE 3: COMMIT (aplicar al DOM)
// React aplica los cambios al DOM real.
// Solo entonces corren los useEffect.`;

const batchingCode = `// BATCHING: React agrupa múltiples setStates en un solo re-render

function Ejemplo() {
  const [count, setCount] = useState(0);
  const [nombre, setNombre] = useState('');

  const handleClick = () => {
    setCount(c => c + 1);  // NO dispara render todavía
    setNombre('React');     // NO dispara render todavía
    // React agrupa los dos y hace UN SOLO render al final ✅
  };

  // En React 18+ el batching funciona incluso en:
  // setTimeout, Promises, event handlers nativos
  const handleAsync = async () => {
    await fetch('/api');
    setCount(c => c + 1);  // React 18: también se agrupa ✅
    setNombre('Nuevo');     // React 18: también se agrupa ✅
  };

  return <button onClick={handleClick}>Click</button>;
}`;

const reconciliation = `// RECONCILIACIÓN: cómo React decide qué re-renderizar

// React usa el TIPO del elemento para decidir:
// - Mismo tipo → actualiza el componente existente (preserva estado)
// - Diferente tipo → destruye y recrea (pierde estado)

function App() {
  const [mostrarA, setMostrarA] = useState(true);

  return (
    <div>
      {/* Mismo tipo: React reutiliza el componente, preserva estado */}
      {mostrarA ? <Contador /> : <Contador />}
      {/* ↑ El estado del Contador se PRESERVA aunque cambie el prop */}

      {/* Diferente tipo: React destruye uno y crea otro, pierde estado */}
      {mostrarA ? <Contador /> : <Boton />}
      {/* ↑ El estado del Contador se PIERDE */}

      {/* POSICIÓN importa: React rastrea por posición en el árbol */}
      {mostrarA && <Contador />}  {/* Posición 0 cuando mostrarA=true */}
      <OtroComponente />          {/* Posición 1 siempre */}
    </div>
  );
}

// KEYS fuerzan a React a tratar un componente como nuevo:
function ListaCambiante() {
  const [userId, setUserId] = useState(1);

  return (
    // key diferente = nuevo componente = estado resetado
    <PerfilUsuario key={userId} userId={userId} />
    // Sin key: React reutiliza el componente y necesitas limpiar
    // el estado manualmente en useEffect
  );
}`;

const strictMode = `// STRICT MODE: React doble-ejecuta renders en desarrollo

// En main.tsx:
// <StrictMode>
//   <App />
// </StrictMode>

// ¿Por qué React ejecuta el render DOS VECES en desarrollo?
// Para detectar efectos secundarios en el render (que deberían ser puros).

// Si ves console.log duplicados → es StrictMode, es intencional.
// En PRODUCCIÓN solo se ejecuta una vez.

// StrictMode también:
// - Ejecuta useEffect DOS VECES (mount → unmount → mount)
//   Para detectar si tienes cleanup correcto
// - Advierte sobre APIs deprecadas

function ComponentePuro() {
  // ✅ El render debe ser PURO: mismas props → mismo resultado
  // Sin efectos secundarios, sin mutaciones
  const resultado = calcular(props); // OK: cálculo puro
  return <div>{resultado}</div>;
}

// Si tu componente se comporta diferente en la segunda ejecución
// de StrictMode, tienes un bug. StrictMode lo expone.`;

export default function CicloRenderizadoPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Ciclo de Renderizado y Virtual DOM</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Entender cómo React decide <strong>cuándo y qué renderizar</strong> es clave
        para escribir componentes correctos y performantes. Cubre el Virtual DOM,
        las fases del render, batching, reconciliación y StrictMode.
      </p>

      <InfoBox type="angular" title="Angular Change Detection vs React Rendering">
        Angular usa <strong>Zone.js</strong> para detectar cambios automáticamente (parchea
        async APIs) o <strong>Signals</strong> para granularidad explícita. React usa un modelo
        más simple: <strong>solo re-renderiza cuando llamas a un setter de estado</strong>.
        No hay magia automática — tú controlas exactamente cuándo cambia el estado.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Virtual DOM — ¿Qué es?</h2>
      <CodeBlock code={virtualDom} language="tsx" filename="virtual-dom.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Las 3 fases del ciclo de render</h2>
      <p className="text-text-muted mb-4">
        Cada render de un componente pasa por tres fases: <strong>Trigger → Render → Commit</strong>.
      </p>
      <CodeBlock code={fasesRender} language="tsx" filename="fases-render.tsx" />

      <InfoBox type="warning" title="El render debe ser PURO">
        La función de tu componente (la fase de render) debe ser una <strong>función pura</strong>:
        mismas entradas → misma salida, sin efectos secundarios. No hagas fetch, no modifiques
        variables externas, no escribas en localStorage en el cuerpo del componente.
        Todo eso va en <code>useEffect</code>.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Batching — Agrupación de actualizaciones</h2>
      <p className="text-text-muted mb-4">
        React 18 agrupa automáticamente múltiples <code>setState</code> en un solo
        re-render, incluso dentro de Promises y timeouts.
      </p>
      <CodeBlock code={batchingCode} language="tsx" filename="batching.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Reconciliación — ¿Cómo React decide qué actualizar?</h2>
      <p className="text-text-muted mb-4">
        React compara el árbol anterior con el nuevo y aplica los cambios mínimos.
        El tipo del elemento y su posición en el árbol son determinantes.
      </p>
      <CodeBlock code={reconciliation} language="tsx" filename="reconciliation.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Strict Mode</h2>
      <p className="text-text-muted mb-4">
        <code>StrictMode</code> ejecuta intencionalmente el render dos veces en desarrollo
        para ayudarte a detectar bugs. No afecta producción.
      </p>
      <CodeBlock code={strictMode} language="tsx" filename="strict-mode.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">React DevTools — Tu herramienta de debugging</h2>
      <p className="text-text-muted mb-4">
        React DevTools es la extensión de Chrome/Firefox que te permite inspeccionar
        el árbol de componentes, ver su estado y props en tiempo real, y detectar
        re-renders innecesarios. <strong>Es indispensable para desarrollar con React.</strong>
      </p>

      <div className="rounded-xl border border-border bg-surface-light p-5 my-4 space-y-4">
        <div>
          <p className="font-semibold text-text mb-1">📦 Instalación</p>
          <p className="text-sm text-text-muted">Busca <strong>"React Developer Tools"</strong> en Chrome Web Store o Firefox Add-ons. Es la extensión oficial del equipo de React.</p>
        </div>
        <div>
          <p className="font-semibold text-text mb-1">🔍 Pestaña Components</p>
          <p className="text-sm text-text-muted">Muestra el árbol de componentes React. Selecciona cualquier componente para ver su <strong>estado actual</strong>, <strong>props</strong>, <strong>hooks</strong> y el componente padre que lo renderizó. Puedes modificar el estado directamente desde DevTools.</p>
        </div>
        <div>
          <p className="font-semibold text-text mb-1">⚡ Pestaña Profiler</p>
          <p className="text-sm text-text-muted">Graba una sesión de interacción y muestra <strong>qué componentes se re-renderizaron</strong>, cuánto tardaron, y por qué se renderizaron. Esencial para detectar renders innecesarios y optimizar con <code>memo</code>/<code>useMemo</code>.</p>
        </div>
        <div>
          <p className="font-semibold text-text mb-1">🔥 Highlight updates</p>
          <p className="text-sm text-text-muted">En Profiler → Settings → activa <strong>"Highlight updates when components render"</strong>. Cada componente que se re-renderiza parpadea en azul/verde/rojo. Muy útil para visualizar el impacto de tus cambios.</p>
        </div>
        <div>
          <p className="font-semibold text-text mb-1">🐛 Debugging de estado</p>
          <p className="text-sm text-text-muted">Selecciona un componente → sección "hooks" → puedes ver el valor actual de cada <code>useState</code>, <code>useRef</code>, y custom hooks. Incluso puedes modificar el estado desde DevTools para probar casos sin cambiar el código.</p>
        </div>
      </div>

      <InfoBox type="angular" title="Angular DevTools vs React DevTools">
        Angular DevTools muestra el árbol de componentes con sus inputs/outputs y el estado de change detection.
        React DevTools hace lo mismo pero también expone todos los hooks (useState, useEffect, custom hooks)
        de cada componente de forma muy visual. El Profiler de React es especialmente potente para
        identificar re-renders en cascada.
      </InfoBox>

      <InfoBox type="tip" title="Resumen del ciclo">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Trigger</strong>: setState, nuevo prop, padre re-renderiza</li>
          <li><strong>Render</strong>: React llama tu función → JSX (fase pura)</li>
          <li><strong>Diffing</strong>: compara Virtual DOM anterior vs nuevo</li>
          <li><strong>Commit</strong>: aplica cambios mínimos al DOM real</li>
          <li><strong>Effects</strong>: useEffect corre después del commit</li>
          <li><strong>Batching</strong>: múltiples setters = un solo re-render</li>
          <li><strong>DevTools</strong>: instala la extensión para debugging en el navegador</li>
        </ul>
      </InfoBox>
    </div>
  );
}
