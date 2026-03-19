import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useTransitionCode = `import { useState, useTransition } from 'react';

// useTransition marca actualizaciones de estado como NO urgentes.
// React puede interrumpirlas para priorizar actualizaciones urgentes
// (como el input que el usuario está escribiendo).

function BuscadorLento() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // URGENTE: actualiza el input inmediatamente
    setQuery(valor);

    // NO URGENTE: marcar la búsqueda como transición
    startTransition(() => {
      // React puede diferir esto si hay trabajo más urgente
      setResultados(filtrarDatos(valor)); // operación lenta
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      
      {/* isPending es true mientras la transición está pendiente */}
      {isPending && <p className="text-gray-400">Buscando...</p>}

      <ul style={{ opacity: isPending ? 0.5 : 1 }}>
        {resultados.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}

// SIN useTransition: si la lista es enorme, el input se "traba"
// porque React procesa todo junto antes de actualizar la UI.
//
// CON useTransition: el input responde inmediatamente,
// la lista se actualiza cuando React tiene tiempo.`;

const useDeferredValueCode = `import { useState, useDeferredValue, memo } from 'react';

// useDeferredValue es similar a useTransition pero para PROPS/VALORES,
// no para funciones que modifican estado.
// Retorna una versión "diferida" del valor (puede estar desactualizada
// mientras React procesa la versión nueva).

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

const diferencias = `// useTransition vs useDeferredValue — ¿Cuándo usar cada uno?

// ─── useTransition ───
// Cuando TÚ controlas el setter de estado
// Envuelves la actualización en startTransition()
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setResultados(buscar(query)); // TÚ llamas al setter
});

// ─── useDeferredValue ───
// Cuando recibes un valor como PROP o de otro origen
// y no puedes envolver el setter
const deferredQuery = useDeferredValue(query);
// query viene de algún lugar, no puedes modificar cómo se actualiza

// REGLA:
// - Controlas el setter → useTransition
// - No controlas el setter (viene de prop, de otro componente) → useDeferredValue

// ─── Comparación con debounce ───
// Debounce: espera X ms antes de actualizar (retraso fijo)
// useTransition/useDeferredValue: React decide cuándo actualizar
//   según su prioridad de trabajo (más inteligente)`;

export default function UseTransitionPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useTransition y useDeferredValue</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Hooks del <strong>modo concurrente</strong> de React 18+. Permiten marcar
        actualizaciones de estado como <strong>no urgentes</strong> para que React
        las procese sin bloquear interacciones más importantes como escribir en un input.
      </p>

      <InfoBox type="angular" title="Esto no tiene equivalente directo en Angular">
        Angular con Signals tiene priorización similar mediante <code>computed</code> y detección
        de cambios selectiva. En React, el modo concurrente permite interrumpir renders
        costosos para mantener la UI responsiva. Es uno de los diferenciadores más grandes
        de React en 2026.
      </InfoBox>

      <InfoBox type="info" title="¿Qué es el modo concurrente?">
        Antes de React 18, el renderizado era <strong>síncrono y bloqueante</strong> — React
        procesaba todo de una vez antes de actualizar la pantalla. Con el modo concurrente,
        React puede <strong>interrumpir, pausar y reanudar</strong> renders según su prioridad.
        <code> useTransition</code> y <code>useDeferredValue</code> son la API pública para aprovecharlo.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">useTransition</h2>
      <p className="text-text-muted mb-4">
        Envuelves la actualización lenta en <code>startTransition()</code>. React la
        procesa cuando no hay trabajo más urgente. El input del usuario siempre responde
        inmediatamente.
      </p>
      <CodeBlock code={useTransitionCode} language="tsx" filename="useTransition.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useDeferredValue</h2>
      <p className="text-text-muted mb-4">
        Cuando no controlas el setter — solo tienes el valor — usa <code>useDeferredValue</code>
        para obtener una versión "diferida" que React puede actualizar con baja prioridad.
      </p>
      <CodeBlock code={useDeferredValueCode} language="tsx" filename="useDeferredValue.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cuándo usar cada uno?</h2>
      <CodeBlock code={diferencias} language="tsx" filename="transition-vs-deferred.tsx" />

      <InfoBox type="tip" title="¿Cuándo los necesitas realmente?">
        <ul className="list-disc list-inside space-y-1">
          <li>Buscadores en tiempo real que filtran <strong>listas muy grandes</strong></li>
          <li>Filtros/sorters sobre datasets grandes</li>
          <li>Tabs que renderizan contenido pesado</li>
          <li>Si tu app ya es rápida: <strong>no los necesitas</strong></li>
        </ul>
        Úsalos solo cuando tengas una UI que se "traba" al interactuar. Son la solución para ese problema específico.
      </InfoBox>
    </div>
  );
}
