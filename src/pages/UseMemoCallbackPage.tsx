import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useMemoCode = `import { useState, useMemo } from 'react';

// useMemo MEMORIZA el resultado de un cálculo costoso.
// Solo recalcula cuando sus dependencias cambian.

function ListaFiltrada() {
  const [busqueda, setBusqueda] = useState('');
  const [tema, setTema] = useState('claro');
  const items = generarMilItems(); // imaginemos una lista grande

  // ❌ Sin useMemo: filtra en CADA render (incluso si solo cambió el tema)
  // const filtrados = items.filter(i => i.includes(busqueda));

  // ✅ Con useMemo: solo recalcula cuando 'busqueda' o 'items' cambian
  const filtrados = useMemo(() => {
    console.log('Filtrando...'); // Solo aparece cuando busqueda cambia
    return items.filter(i => i.nombre.includes(busqueda));
  }, [busqueda, items]);
  // ↑ Array de dependencias: igual que useEffect

  // Cambiar el tema NO recalcula el filtro (porque 'tema' no es dependencia)
  return (
    <div className={tema}>
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      <button onClick={() => setTema(t => t === 'claro' ? 'oscuro' : 'claro')}>
        Cambiar tema
      </button>
      <ul>
        {filtrados.map(i => <li key={i.id}>{i.nombre}</li>)}
      </ul>
    </div>
  );
}`;

const useCallbackCode = `import { useState, useCallback, memo } from 'react';

// useCallback MEMORIZA una función para que no se recree en cada render.
// Útil cuando pasas funciones como props a componentes memorizados.

// Componente hijo envuelto en memo (solo re-renderiza si sus props cambian)
const BotonContador = memo(function BotonContador({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  console.log(\`Renderizando: \${label}\`);
  return <button onClick={onClick}>{label}</button>;
});

function Padre() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  // ❌ Sin useCallback: se crea una función NUEVA en cada render
  // const incrementarA = () => setCountA(c => c + 1);
  // Esto hace que BotonContador A se re-renderice SIEMPRE

  // ✅ Con useCallback: la función se memoriza
  const incrementarA = useCallback(() => {
    setCountA(c => c + 1);
  }, []); // [] = la función nunca cambia

  const incrementarB = useCallback(() => {
    setCountB(c => c + 1);
  }, []);

  // Ahora al hacer click en A, solo BotonContador A re-renderiza
  return (
    <div>
      <p>A: {countA} | B: {countB}</p>
      <BotonContador onClick={incrementarA} label="Incrementar A" />
      <BotonContador onClick={incrementarB} label="Incrementar B" />
    </div>
  );
}`;

const memoComponent = `import { memo } from 'react';

// React.memo envuelve un componente para que solo se re-renderice
// si sus props REALMENTE cambiaron (shallow comparison)

interface CardProps {
  titulo: string;
  descripcion: string;
}

// Sin memo: se re-renderiza SIEMPRE que el padre re-renderiza
function Card({ titulo, descripcion }: CardProps) {
  console.log('Card renderizada');
  return <div><h3>{titulo}</h3><p>{descripcion}</p></div>;
}

// Con memo: solo se re-renderiza si titulo o descripcion cambian
const CardMemo = memo(function Card({ titulo, descripcion }: CardProps) {
  console.log('CardMemo renderizada');
  return <div><h3>{titulo}</h3><p>{descripcion}</p></div>;
});

// memo + useCallback = optimización completa
// memo evita re-render si props no cambian
// useCallback evita que las funciones-prop cambien innecesariamente`;

const cuandoUsar = `// ¿CUÁNDO usar useMemo / useCallback?

// ✅ USA useMemo cuando:
// - Tienes un cálculo costoso (filtrar/ordenar arrays grandes)
// - Quieres evitar recrear un objeto/array que se pasa como prop
// - El cálculo depende de pocas variables

// ✅ USA useCallback cuando:
// - Pasas funciones como props a componentes con memo()
// - Pasas funciones como dependencias de useEffect
// - La función se usa en un contexto donde la identidad importa

// ❌ NO uses useMemo/useCallback cuando:
// - El cálculo es trivial (sumar dos números)
// - El componente siempre re-renderiza de todas formas
// - No hay problemas de rendimiento medibles
// Memorizar tiene un costo. No optimices prematuramente.

// REGLA DE ORO:
// 1. Escribe tu código sin memorización
// 2. Mide si hay un problema de rendimiento
// 3. Solo entonces agrega useMemo/useCallback donde sea necesario`;

export default function UseMemoCallbackPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useMemo y useCallback</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Hooks de <strong>optimización de rendimiento</strong>. <code>useMemo</code> memoriza
        valores calculados. <code>useCallback</code> memoriza funciones. Ambos evitan
        trabajo innecesario en re-renders.
      </p>

      <InfoBox type="angular">
        Angular maneja esto diferente: usa <code>OnPush</code> change detection strategy y
        pipes puros para optimizar. En React, <code>memo</code> + <code>useMemo</code> +{' '}
        <code>useCallback</code> son el equivalente para controlar cuándo se re-renderiza un componente.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">useMemo — Memorizar valores</h2>
      <CodeBlock code={useMemoCode} language="tsx" filename="useMemo.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useCallback — Memorizar funciones</h2>
      <CodeBlock code={useCallbackCode} language="tsx" filename="useCallback.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">React.memo — Memorizar componentes</h2>
      <CodeBlock code={memoComponent} language="tsx" filename="react-memo.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cuándo usar cada uno?</h2>
      <CodeBlock code={cuandoUsar} language="tsx" filename="cuando-usar.tsx" />

      <InfoBox type="warning" title="No optimices prematuramente">
        La memorización tiene un costo (memoria + comparaciones). Solo úsala cuando
        tengas un problema de rendimiento real y medible. La mayoría de componentes
        NO necesitan <code>useMemo</code> ni <code>useCallback</code>.
      </InfoBox>
    </div>
  );
}
