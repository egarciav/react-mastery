import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useTransitionCode = `import { useState, useTransition } from 'react';

// ¿QUÉ PROBLEMA RESUELVE useTransition?
// Imagina: el usuario escribe en un buscador que filtra 50,000 elementos.
// Sin useTransition, cada tecla causa: actualizar input + filtrar lista.
// Si filtrar tarda 200ms, el input se "traba" porque React hace todo
// SÍNCRONO — no actualiza la pantalla hasta terminar.
//
// ¿CÓMO FUNCIONA?
// useTransition divide las actualizaciones en DOS prioridades:
// - URGENTE: setQuery(valor) → el input se actualiza INMEDIATAMENTE
// - NO URGENTE: startTransition(() => setResultados(...)) → React
//   puede INTERRUMPIR esto si el usuario sigue escribiendo.
//
// Internamente, React usa el scheduler del modo concurrente:
// 1. El usuario escribe "a" → setQuery("a") se procesa inmediato
// 2. startTransition(() => filtrar("a")) se agenda como baja prioridad
// 3. Si el usuario escribe "ab" antes de que termine:
//    → React DESCARTA el render de "a" (ya es obsoleto)
//    → Procesa setQuery("ab") inmediato
//    → Inicia filtrar("ab") como nueva transición

function BuscadorLento() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  // isPending: boolean — true mientras la transición está en proceso
  // startTransition: función para envolver actualizaciones no urgentes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // URGENTE: el input debe reflejar lo que el usuario escribe al instante
    setQuery(valor);

    // NO URGENTE: la lista puede esperar
    startTransition(() => {
      setResultados(filtrarDatos(valor)); // operación costosa
      // React puede interrumpir este render si llega una actualización
      // urgente (otra tecla del usuario)
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      
      {/* Feedback visual: la lista se atenúa mientras actualiza */}
      {isPending && <p className="text-gray-400">Buscando...</p>}

      <ul style={{ opacity: isPending ? 0.5 : 1 }}>
        {resultados.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}

// COMPARACIÓN:
// SIN useTransition: tecla → bloqueo 200ms → input + lista actualizan juntos
// CON useTransition: tecla → input instantáneo → lista actualiza cuando puede`;

const useDeferredValueCode = `import { useState, useDeferredValue, memo } from 'react';

// ¿QUÉ HACE useDeferredValue?
// Retorna una copia "diferida" de un valor. Cuando el valor cambia,
// React primero re-renderiza con el valor VIEJO (rápido) y luego
// agenda un re-render con el valor NUEVO (puede ser lento).
//
// ¿CUÁNDO usarlo vs useTransition?
// useTransition: TÚ controlas el setter → envuelves en startTransition
// useDeferredValue: recibes un valor (prop) → no puedes envolver su setter
//
// ¿CÓMO funciona con memo()?
// Si pasas deferredQuery a un componente con memo(), React puede
// saltarse el re-render costoso mientras deferredQuery no cambie.

// Componente costoso que queremos diferir
const ListaResultados = memo(function ListaResultados({
  query
}: { query: string }) {
  // Imagina que esto filtra 50,000 elementos
  const resultados = busquedaCostosa(query);

  return (
    <ul>
      {resultados.map((r, i) => <li key={i}>{r}</li>)}
    </ul>
  );
});

function BuscadorConDeferred() {
  const [query, setQuery] = useState('');

  // deferredQuery puede estar "atrasada" respecto a query
  // React prioriza actualizar query (input) sobre deferredQuery (lista)
  const deferredQuery = useDeferredValue(query);

  // Si deferredQuery !== query, React está trabajando en actualizarla
  const estaActualizando = deferredQuery !== query;

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      
      {/* La lista usa el valor diferido — puede estar 1 render atrás */}
      <div style={{ opacity: estaActualizando ? 0.5 : 1 }}>
        <ListaResultados query={deferredQuery} />
      </div>
    </div>
  );
}`;

const diferencias = `// useTransition vs useDeferredValue vs debounce
//
// Los tres resuelven el mismo problema: "la UI se traba al actualizar".
// Pero funcionan de formas MUY diferentes.

// ─── useTransition ───
// Controlas el setter → envuelves en startTransition()
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setResultados(buscar(query)); // TÚ decides qué es no-urgente
});
// isPending te da feedback visual
// React puede CANCELAR el render si llega algo más urgente

// ─── useDeferredValue ───
// NO controlas el setter (viene como prop o de otro lugar)
const deferredQuery = useDeferredValue(query);
// React mantiene el valor viejo visible mientras procesa el nuevo
// Ideal cuando: recibes query de un padre y no puedes envolverla

// ─── debounce (setTimeout/lodash) ───
// Espera un tiempo FIJO antes de actualizar
// const debouncedQuery = useDebounce(query, 300);
// Problema: el retraso es arbitrario (300ms? 500ms? depende del dispositivo)
// useTransition se adapta: en un PC rápido casi no hay retraso,
// en un móvil lento React difiere más. Es INTELIGENTE.

// ─── TABLA DE DECISIÓN ───
// ┌─────────────────────┬──────────────┬────────────────────┬──────────┐
// │ Situación           │ useTransition│ useDeferredValue   │ debounce │
// ├─────────────────────┼──────────────┼────────────────────┼──────────┤
// │ Controlas el setter │ ✅           │                    │ ✅       │
// │ Valor como prop     │              │ ✅                 │ ✅       │
// │ Feedback (isPending)│ ✅           │ manual (a !== b)   │ manual   │
// │ Se adapta al device │ ✅           │ ✅                 │ ❌       │
// │ Cancela renders     │ ✅           │ ✅                 │ ❌       │
// └─────────────────────┴──────────────┴────────────────────┴──────────┘`;

const ejemploGithub = `// ============================================
// 📁 src/components/HeavySearch.tsx
// Ejemplo COMPLETO: useTransition + useDeferredValue
// ============================================
import { useState, useTransition, useDeferredValue, useMemo, memo } from 'react';

// Simula una lista pesada (5000 items)
const ITEMS = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  text: \`Item \${i + 1} — \${['React', 'Angular', 'Vue', 'Svelte', 'Next.js'][i % 5]}\`,
}));

// Componente pesado envuelto en memo
const HeavyList = memo(function HeavyList({ query }: { query: string }) {
  const filtrados = ITEMS.filter(item =>
    item.text.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ul className="max-h-64 overflow-auto border rounded">
      {filtrados.slice(0, 100).map(item => (
        <li key={item.id} className="px-3 py-1 border-b text-sm">
          {item.text}
        </li>
      ))}
      {filtrados.length > 100 && (
        <li className="px-3 py-2 text-gray-400 text-sm">
          ...y {filtrados.length - 100} más
        </li>
      )}
    </ul>
  );
});

// Ejemplo 1: useTransition — controlas el setter
function ConTransition() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);              // urgente: actualiza el input YA
    startTransition(() => {
      setQuery(e.target.value);            // no-urgente: puede esperar
    });
  };

  return (
    <div className="p-4 border rounded-xl mb-4">
      <h3 className="font-bold mb-2">useTransition</h3>
      <input value={input} onChange={handleChange}
        placeholder="Buscar en 5000 items..."
        className="w-full px-3 py-2 border rounded mb-2" />
      {isPending && <p className="text-sm text-blue-500 animate-pulse">Filtrando...</p>}
      <HeavyList query={query} />
    </div>
  );
}

// Ejemplo 2: useDeferredValue — recibes un valor diferido
function ConDeferred() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div className="p-4 border rounded-xl">
      <h3 className="font-bold mb-2">useDeferredValue</h3>
      <input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Buscar en 5000 items..."
        className="w-full px-3 py-2 border rounded mb-2" />
      <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <HeavyList query={deferredQuery} />
      </div>
    </div>
  );
}

export default function HeavySearch() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <ConTransition />
      <ConDeferred />
    </div>
  );
}`;

export default function UseTransitionPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useTransition y useDeferredValue</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Hooks del <strong>modo concurrente</strong> de React 18+. Permiten separar
        actualizaciones en <strong>urgentes</strong> (input del usuario) y <strong>no
        urgentes</strong> (filtrar lista enorme). React procesa las urgentes primero,
        pudiendo interrumpir y descartar renders no urgentes que ya son obsoletos.
      </p>

      <InfoBox type="angular" title="Angular no tiene equivalente directo">
        <p>
          Angular con <strong>Signals</strong> tiene priorización similar mediante <code>computed</code>
          y detección de cambios selectiva. Pero el modo concurrente de React es único: puede
          <strong> interrumpir un render a mitad de camino</strong> si llega algo más urgente.
          Angular procesa cambios síncronamente. Esta capacidad de interrupción es uno de los
          diferenciadores más grandes de React.
        </p>
      </InfoBox>

      <InfoBox type="info" title="¿Qué es el modo concurrente?">
        Antes de React 18, el renderizado era <strong>síncrono y bloqueante</strong> — React
        procesaba todo de una vez. Con el modo concurrente, React puede <strong>interrumpir,
        pausar y reanudar</strong> renders según su prioridad. No es una API que "activas" —
        se activa automáticamente cuando usas <code>useTransition</code> o <code>useDeferredValue</code>.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">useTransition — Controlas el setter</h2>
      <p className="text-text-muted mb-4">
        Cuando <strong>tú</strong> llamas al setter de estado, envuelve la parte lenta en
        <code> startTransition()</code>. React la procesa con baja prioridad y te da
        <code> isPending</code> para mostrar feedback visual.
      </p>
      <CodeBlock code={useTransitionCode} language="tsx" filename="useTransition.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useDeferredValue — No controlas el setter</h2>
      <p className="text-text-muted mb-4">
        Cuando recibes un valor como prop y no puedes envolver su setter, usa
        <code> useDeferredValue</code>. React retorna una versión "atrasada" del valor que
        se actualiza con baja prioridad. Combinado con <code>memo()</code>, salta renders costosos.
      </p>
      <CodeBlock code={useDeferredValueCode} language="tsx" filename="useDeferredValue.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Comparación — useTransition vs useDeferredValue vs debounce</h2>
      <p className="text-text-muted mb-4">
        Los tres resuelven "la UI se traba", pero de formas diferentes. <code>useTransition</code>
        y <code>useDeferredValue</code> se adaptan al dispositivo; debounce usa un retraso fijo.
      </p>
      <CodeBlock code={diferencias} language="tsx" filename="transition-vs-deferred.tsx" />

      <InfoBox type="warning" title="¿Cuándo los necesitas realmente?">
        <ul className="list-disc list-inside space-y-1">
          <li>Buscadores en tiempo real sobre <strong>listas muy grandes</strong> (1000+ items)</li>
          <li>Filtros/sorters sobre datasets pesados</li>
          <li>Tabs que renderizan contenido complejo (charts, tablas grandes)</li>
          <li>Si tu app <strong>ya es rápida: no los necesitas</strong></li>
        </ul>
        <p className="mt-2">
          No son para optimización general — son para un problema específico: la UI se traba
          al interactuar. Mide primero con React DevTools Profiler.
        </p>
      </InfoBox>

      <InfoBox type="tip" title="Resumen — useTransition y useDeferredValue">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>useTransition</strong>: controlas el setter → startTransition + isPending</li>
          <li><strong>useDeferredValue</strong>: recibes un valor → versión diferida + memo()</li>
          <li><strong>Modo concurrente</strong>: React interrumpe renders no urgentes</li>
          <li><strong>vs debounce</strong>: se adaptan al dispositivo, cancelan renders obsoletos</li>
          <li><strong>Regla</strong>: si no se traba, no lo necesitas</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Buscador pesado con 5000 items: useTransition (controlas el setter) y useDeferredValue
        (recibes valor diferido) lado a lado para comparar ambos enfoques.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/HeavySearch.tsx" />
    </div>
  );
}
