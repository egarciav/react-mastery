import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useMemoCode = `import { useState, useMemo } from 'react';

// ¿QUÉ HACE useMemo?
// Memoriza (cachea) el RESULTADO de una función. Solo recalcula
// cuando sus dependencias cambian. Si las dependencias son iguales,
// retorna el valor cacheado sin ejecutar la función.
//
// ¿CÓMO FUNCIONA internamente?
// React guarda: [resultado, [dep1, dep2]]
// En el re-render, compara las dependencias con las anteriores:
// - Si son iguales (===) → retorna el resultado cacheado
// - Si cambiaron → ejecuta la función y cachea el nuevo resultado
//
// ¿POR QUÉ existe?
// Porque en React, cada re-render ejecuta TODO el cuerpo del componente.
// Si tienes un cálculo costoso (filtrar 10,000 items), se ejecuta
// en cada render aunque los datos no hayan cambiado. useMemo evita eso.

function ListaFiltrada() {
  const [busqueda, setBusqueda] = useState('');
  const [tema, setTema] = useState('claro');
  const items = generarMilItems(); // lista grande

  // ❌ Sin useMemo: filtra en CADA render
  // Cambiar el tema → re-render → filtra 10,000 items innecesariamente
  // const filtrados = items.filter(i => i.nombre.includes(busqueda));

  // ✅ Con useMemo: solo filtra cuando 'busqueda' o 'items' cambian
  const filtrados = useMemo(() => {
    console.log('Filtrando...'); // Solo aparece cuando busqueda cambia
    return items.filter(i => i.nombre.includes(busqueda));
  }, [busqueda, items]);
  // ↑ Dependencias: React compara con === del render anterior
  // Si busqueda y items no cambiaron → retorna filtrados anterior

  // Cambiar tema → re-render → useMemo ve que busqueda no cambió →
  // retorna los filtrados cacheados SIN filtrar otra vez ✅
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

// ¿QUÉ HACE useCallback?
// Memoriza una FUNCIÓN para que mantenga la misma referencia entre renders.
// Es useMemo pero para funciones: useCallback(fn, deps) === useMemo(() => fn, deps)
//
// ¿POR QUÉ importa la referencia de una función?
// En JavaScript: () => {} !== () => {} (dos funciones "iguales" ≠ misma referencia)
// En cada render, una función definida inline es un NUEVO objeto en memoria.
// Si pasas esa función como prop a un componente con memo(), React ve que
// la prop cambió (nueva referencia) y re-renderiza el hijo innecesariamente.
//
// useCallback mantiene la MISMA referencia → memo() ve que no cambió → no re-renderiza

// Componente hijo envuelto en memo()
// memo = "solo re-renderízame si mis props REALMENTE cambiaron"
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

  // ❌ Sin useCallback: nueva función en CADA render
  // const incrementarA = () => setCountA(c => c + 1);
  // memo() en BotonContador ve onClick como "nueva prop" → re-renderiza

  // ✅ Con useCallback: MISMA referencia entre renders
  const incrementarA = useCallback(() => {
    setCountA(c => c + 1); // updater function: no necesita countA como dep
  }, []); // [] = la función nunca se recrea

  const incrementarB = useCallback(() => {
    setCountB(c => c + 1);
  }, []);

  // Click en A: countA cambia → Padre re-renderiza →
  // incrementarA misma ref → BotonContador A: label="Incrementar A" (no cambió),
  //   onClick=misma ref (no cambió) → memo() dice "no re-renderizar" ✅
  // Pero countA sí cambió → React re-renderiza Padre → <p> se actualiza
  return (
    <div>
      <p>A: {countA} | B: {countB}</p>
      <BotonContador onClick={incrementarA} label="Incrementar A" />
      <BotonContador onClick={incrementarB} label="Incrementar B" />
    </div>
  );
}`;

const memoComponent = `import { memo } from 'react';

// ¿QUÉ HACE React.memo?
// Envuelve un componente para que React compare sus props antes de
// re-renderizar. Si las props no cambiaron → salta el re-render.
//
// ¿CÓMO compara las props?
// Usa SHALLOW COMPARISON (===) para cada prop:
// - Primitivos (string, number, boolean): compara valor
// - Objetos/arrays/funciones: compara REFERENCIA (no contenido)
//
// ¿POR QUÉ es necesario?
// Por defecto en React, cuando un padre re-renderiza, TODOS sus
// hijos re-renderizan también, aunque sus props no hayan cambiado.
// memo() es el opt-in para decir "no me re-renderices si mis props
// son iguales". Es similar a OnPush en Angular.

interface CardProps {
  titulo: string;
  descripcion: string;
}

// Sin memo: se re-renderiza CADA VEZ que el padre re-renderiza
function Card({ titulo, descripcion }: CardProps) {
  console.log('Card renderizada');
  return <div><h3>{titulo}</h3><p>{descripcion}</p></div>;
}

// Con memo: React compara props antes de re-renderizar
const CardMemo = memo(function Card({ titulo, descripcion }: CardProps) {
  console.log('CardMemo renderizada');
  return <div><h3>{titulo}</h3><p>{descripcion}</p></div>;
});

// ─── El TRÍO de optimización ───
// memo() en el componente hijo → "no re-renderices si props iguales"
// useCallback en el padre → "la función-prop mantiene misma referencia"
// useMemo en el padre → "el objeto/array-prop mantiene misma referencia"
//
// Sin los tres juntos, memo() es inútil:
// Si pasas un objeto nuevo cada render como prop, memo() SIEMPRE ve
// que la prop cambió (nueva referencia) → re-renderiza de todas formas.
// memo + useCallback/useMemo = optimización completa.`;

const cuandoUsar = `// ¿CUÁNDO usar useMemo / useCallback / memo?
//
// La memorización NO es gratis. Tiene costos:
// - Memoria: React guarda el resultado anterior
// - CPU: React compara dependencias en cada render
// - Complejidad: más código, más difícil de leer
//
// Solo vale la pena si el AHORRO > el COSTO.

// ✅ USA useMemo cuando:
// - Cálculos costosos: filtrar/ordenar arrays grandes (1000+ items)
// - Crear objetos/arrays estables para pasar como props a memo()
// - Evitar cálculos pesados que no dependen de datos que cambiaron

// ✅ USA useCallback cuando:
// - Pasas funciones como props a componentes con memo()
// - Pasas funciones como dependencias de useEffect
// - Funciones en contextos (Context value) para evitar re-renders

// ✅ USA memo() cuando:
// - El componente es costoso de renderizar (listas largas, charts)
// - El componente re-renderiza frecuentemente con las mismas props
// - El padre re-renderiza mucho pero las props del hijo son estables

// ❌ NO uses ninguno cuando:
// - El cálculo es trivial (2 + 2, concatenar strings)
// - El componente es simple (pocos elementos DOM)
// - No hay problema de rendimiento medible
// - El componente SIEMPRE recibe props nuevas de todas formas

// ─── REGLA DE ORO ───
// 1. Escribe tu código SIN memorización
// 2. ¿Se siente lento? Mide con React DevTools Profiler
// 3. Identifica qué componente/cálculo causa el problema
// 4. Aplica memo/useMemo/useCallback SOLO donde sea necesario
// 5. Mide de nuevo para confirmar que ayudó

// Nota: React 19 introduce el React Compiler que podría hacer
// useMemo/useCallback automáticamente en el futuro. Por ahora,
// sigue siendo manual.`;

const ejemploGithub = `// ============================================
// 📁 src/components/FilterableTable.tsx
// Ejemplo COMPLETO: useMemo, useCallback, React.memo
// ============================================
import { useState, useMemo, useCallback, memo } from 'react';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

// Componente hijo envuelto en memo: solo re-renderiza si props cambian
const ProductRow = memo(function ProductRow({ producto, onSelect }: {
  producto: Product;
  onSelect: (id: number) => void;
}) {
  console.log('Render:', producto.nombre); // para verificar re-renders
  return (
    <tr className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(producto.id)}>
      <td className="p-2">{producto.nombre}</td>
      <td className="p-2">{producto.categoria}</td>
      <td className="p-2 text-right">\${producto.precio.toFixed(2)}</td>
    </tr>
  );
});

const PRODUCTOS: Product[] = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  nombre: \`Producto \${i + 1}\`,
  precio: Math.round(Math.random() * 10000) / 100,
  categoria: ['Tech', 'Ropa', 'Hogar', 'Deporte'][i % 4],
}));

export default function FilterableTable() {
  const [filtro, setFiltro] = useState('');
  const [categoria, setCategoria] = useState('');
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  // useMemo: cachea el resultado del filtrado (cálculo costoso con 500+ items)
  const productosFiltrados = useMemo(() => {
    console.log('Recalculando filtrado...');
    return PRODUCTOS.filter(p => {
      const matchNombre = p.nombre.toLowerCase().includes(filtro.toLowerCase());
      const matchCategoria = !categoria || p.categoria === categoria;
      return matchNombre && matchCategoria;
    });
  }, [filtro, categoria]); // solo recalcula cuando filtro o categoria cambian

  // useMemo: cachea stats derivados
  const stats = useMemo(() => ({
    total: productosFiltrados.length,
    precioPromedio: productosFiltrados.reduce((s, p) => s + p.precio, 0) / productosFiltrados.length || 0,
  }), [productosFiltrados]);

  // useCallback: estabiliza la referencia de la función para que memo() funcione
  const handleSelect = useCallback((id: number) => {
    setSeleccionado(id);
  }, []); // sin deps: la función no depende de nada externo

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <input value={filtro} onChange={e => setFiltro(e.target.value)}
          placeholder="Buscar..." className="flex-1 px-3 py-2 border rounded" />
        <select value={categoria} onChange={e => setCategoria(e.target.value)}
          className="px-3 py-2 border rounded">
          <option value="">Todas</option>
          <option value="Tech">Tech</option>
          <option value="Ropa">Ropa</option>
          <option value="Hogar">Hogar</option>
          <option value="Deporte">Deporte</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        {stats.total} resultados · Precio promedio: \${stats.precioPromedio.toFixed(2)}
        {seleccionado !== null && \` · Seleccionado: #\${seleccionado}\`}
      </p>

      <table className="w-full text-sm">
        <thead><tr className="border-b font-bold">
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Categoría</th>
          <th className="p-2 text-right">Precio</th>
        </tr></thead>
        <tbody>
          {productosFiltrados.slice(0, 50).map(p => (
            <ProductRow key={p.id} producto={p} onSelect={handleSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}`;

export default function UseMemoCallbackPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useMemo y useCallback</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Hooks de <strong>optimización de rendimiento</strong>. <code>useMemo</code> memoriza
        el resultado de un cálculo. <code>useCallback</code> memoriza la referencia de una
        función. <code>memo()</code> memoriza un componente entero. Los tres trabajan juntos
        para evitar trabajo innecesario en re-renders — pero solo valen la pena cuando hay
        un problema de rendimiento real.
      </p>

      <InfoBox type="angular" title="Angular OnPush vs React memo + useMemo + useCallback">
        <p>
          Angular usa <code>ChangeDetectionStrategy.OnPush</code> para que un componente solo
          se actualice cuando sus inputs cambian (por referencia). En React, el equivalente es
          <code> memo()</code> en el componente + <code>useMemo</code>/<code>useCallback</code>
          en el padre para estabilizar las props. Angular también usa <strong>pipes puros</strong>
          para cachear transformaciones; el equivalente React es <code>useMemo</code>.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">useMemo — Cachear resultados de cálculos</h2>
      <p className="text-text-muted mb-4">
        Memoriza el <strong>resultado</strong> de una función costosa. Solo recalcula cuando
        las dependencias cambian. Si las dependencias son iguales, retorna el valor cacheado
        sin ejecutar la función.
      </p>
      <CodeBlock code={useMemoCode} language="tsx" filename="useMemo.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useCallback — Estabilizar referencias de funciones</h2>
      <p className="text-text-muted mb-4">
        Memoriza la <strong>referencia</strong> de una función. En JavaScript, dos funciones
        idénticas son objetos diferentes (<code>{'() => {} !== () => {}'}</code>). Sin useCallback,
        cada render crea una función nueva que rompe la optimización de <code>memo()</code>.
      </p>
      <CodeBlock code={useCallbackCode} language="tsx" filename="useCallback.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">React.memo — Evitar re-renders de componentes</h2>
      <p className="text-text-muted mb-4">
        Envuelve un componente para que React compare las props antes de re-renderizar.
        Si las props no cambiaron (shallow comparison), salta el re-render. Funciona con
        <code> useMemo</code> y <code>useCallback</code> para estabilizar las props.
      </p>
      <CodeBlock code={memoComponent} language="tsx" filename="react-memo.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cuándo usar cada uno? — Regla de oro</h2>
      <p className="text-text-muted mb-4">
        La memorización tiene un costo. Solo vale la pena cuando el ahorro supera el costo.
        La regla: <strong>primero escribe sin memorización, después mide, y solo entonces optimiza</strong>.
      </p>
      <CodeBlock code={cuandoUsar} language="tsx" filename="cuando-usar.tsx" />

      <InfoBox type="warning" title="No optimices prematuramente">
        La mayoría de componentes NO necesitan memorización. Agregar <code>useMemo</code> y
        <code> useCallback</code> en todas partes es un anti-patrón: aumenta complejidad sin
        beneficio medible. Usa <strong>React DevTools Profiler</strong> para identificar qué
        componentes realmente causan problemas de rendimiento.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — useMemo, useCallback, memo">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>useMemo(fn, deps)</strong> — cachea el resultado de fn</li>
          <li><strong>useCallback(fn, deps)</strong> — cachea la referencia de fn</li>
          <li><strong>memo(Component)</strong> — solo re-renderiza si props cambiaron</li>
          <li><strong>Los tres juntos</strong>: memo en hijo + useCallback/useMemo en padre</li>
          <li><strong>Shallow comparison</strong>: compara por referencia (===), no por contenido</li>
          <li><strong>Regla de oro</strong>: medir antes de optimizar</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Tabla filtrable con 500 productos: useMemo para filtrado y stats, useCallback para
        estabilizar handlers, y React.memo en filas para evitar re-renders innecesarios.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/FilterableTable.tsx" />
    </div>
  );
}
