import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const refDom = `import { useRef, useEffect } from 'react';

// ¿QUÉ ES useRef?
// Crea un objeto { current: valorInicial } que:
// 1. PERSISTE entre renders (no se recrea cada vez)
// 2. Es MUTABLE (puedes cambiar .current libremente)
// 3. NO causa re-render al cambiar (a diferencia de useState)
//
// ¿CÓMO FUNCIONA internamente?
// React crea el objeto { current: null } en el primer render.
// En renders siguientes, React retorna el MISMO objeto (misma referencia).
// Como es el mismo objeto, puedes mutar .current sin que React se entere.
// React NO trackea cambios en refs — es tu "espacio privado".

// USO 1: Referencia al DOM
// Cuando pasas ref={miRef} a un elemento JSX, React automáticamente
// asigna el nodo DOM real a miRef.current después del render.
// Es el equivalente de @ViewChild en Angular.

function InputConFoco() {
  // Tipo HTMLInputElement porque la ref apuntará a un <input>
  const inputRef = useRef<HTMLInputElement>(null);

  const enfocar = () => {
    // .current es el elemento DOM real — puedes llamar cualquier API del DOM
    inputRef.current?.focus();
    // También podrías: .blur(), .select(), .scrollIntoView(), etc.
  };

  useEffect(() => {
    // Auto-focus al montar el componente
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {/* React asigna el <input> DOM real a inputRef.current */}
      <input ref={inputRef} placeholder="Escribe aquí..." />
      <button onClick={enfocar}>Enfocar input</button>
    </div>
  );
  // FLUJO:
  // 1. Primer render: inputRef.current = null (DOM aún no existe)
  // 2. React crea el DOM y asigna inputRef.current = <input> real
  // 3. useEffect se ejecuta → focus() funciona porque el DOM ya existe
  // 4. Click en botón → enfocar() → inputRef.current.focus()
}`;

const refValor = `// USO 2: Guardar valores mutables que NO causan re-render
//
// ¿POR QUÉ necesitarías un valor que no cause re-render?
// Porque hay datos que tu componente necesita recordar entre renders
// pero que NO afectan la UI directamente. Ejemplos:
// - IDs de setInterval/setTimeout (para poder cancelarlos)
// - Valores anteriores de un estado
// - Flags de control (¿ya se montó? ¿ya se hizo fetch?)
// - Instancias de librerías externas (charts, maps)
//
// Si usaras useState para estos, cada cambio causaría un re-render
// innecesario porque React no sabe que no afectan la UI.

function Cronometro() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  // El ID del interval se guarda en una ref, no en estado
  const intervalRef = useRef<number | null>(null);

  const iniciar = () => {
    setCorriendo(true);
    intervalRef.current = window.setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);
    // intervalRef.current ahora tiene el ID del interval
    // Cambiar .current NO causa re-render — exactamente lo que queremos
  };

  const detener = () => {
    setCorriendo(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current); // Usamos el ID guardado
      intervalRef.current = null;
    }
  };

  // ¿POR QUÉ useRef y no useState para el interval ID?
  // useState:  setIntervalId(id) → re-render innecesario (el ID no se muestra)
  // useRef:    intervalRef.current = id → sin re-render ✅
  // El ID del interval es un dato "interno" que no afecta la UI.

  // ¿POR QUÉ no una variable local (let id)?
  // Porque las variables locales se RECREAN en cada render.
  // Si el componente re-renderiza, 'id' vuelve a undefined y pierdes
  // la referencia al interval → no puedes cancelarlo. Memory leak.
  // useRef PERSISTE el valor entre renders.

  return (
    <div>
      <p>Tiempo: {tiempo}s</p>
      <button onClick={corriendo ? detener : iniciar}>
        {corriendo ? 'Detener' : 'Iniciar'}
      </button>
    </div>
  );
}`;

const refVsState = `// useRef vs useState vs variable local — ¿Cuándo usar cada uno?
//
// La pregunta clave: ¿este valor AFECTA la UI?
// SÍ → useState (React necesita saber para re-renderizar)
// NO → useRef   (cambiar sin molestar a React)
//
// Segunda pregunta: ¿necesita PERSISTIR entre renders?
// SÍ → useState o useRef
// NO → variable local (let/const dentro del componente)

function Comparacion() {
  // useState: cambiar esto → React re-renderiza → UI se actualiza
  const [nombre, setNombre] = useState('');

  // useRef: cambiar esto → React NO se entera → sin re-render
  const renderCount = useRef(0);

  // variable local: se RECREA en cada render (no persiste)
  let temporal = 'se pierde en el próximo render';

  // Cada vez que el componente se renderiza:
  renderCount.current += 1;
  // ↑ Esto NO causa otro render (a diferencia de setState)
  // ↑ El valor se actualiza silenciosamente

  return (
    <div>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <p>Renders: {renderCount.current}</p>
      {/* Nota: renderCount.current se muestra actualizado porque el
          re-render lo causa setNombre, no el cambio de la ref */}
    </div>
  );
}

// TABLA COMPARATIVA COMPLETA:
// ┌──────────────────┬──────────────┬──────────────┬──────────────┐
// │                  │ useState     │ useRef       │ let/const    │
// ├──────────────────┼──────────────┼──────────────┼──────────────┤
// │ Causa re-render  │ SÍ           │ NO           │ NO           │
// │ Persiste renders │ SÍ           │ SÍ           │ NO           │
// │ Mutable          │ No (setter)  │ SÍ (.current)│ SÍ           │
// │ Uso típico       │ UI, datos    │ DOM, timers  │ cálculos     │
// │ Ejemplo          │ input value  │ interval ID  │ variable temp│
// └──────────────────┴──────────────┴──────────────┴──────────────┘

// ─── Patrón útil: guardar el valor ANTERIOR de un estado ───
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
    // Se ejecuta DESPUÉS del render, así ref.current
    // siempre tiene el valor del render anterior
  });

  return ref.current;
}

// Uso:
function Precio({ precio }: { precio: number }) {
  const precioAnterior = usePrevious(precio);
  const subio = precioAnterior !== undefined && precio > precioAnterior;

  return (
    <p style={{ color: subio ? 'green' : 'red' }}>
      Precio: \${precio} {subio ? '↑' : '↓'}
    </p>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/Stopwatch.tsx
// Ejemplo COMPLETO: useRef para DOM + valores mutables
// ============================================
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const intervalRef = useRef<number | null>(null); // ref mutable: timer ID
  const inputRef = useRef<HTMLInputElement>(null);  // ref DOM: input element
  const inicioRef = useRef<number>(0);              // ref mutable: timestamp inicio

  const iniciar = () => {
    if (corriendo) return;
    setCorriendo(true);
    inicioRef.current = Date.now() - tiempo;
    // Guardar el intervalID en ref (no en estado — no necesita re-render)
    intervalRef.current = window.setInterval(() => {
      setTiempo(Date.now() - inicioRef.current);
    }, 10);
  };

  const pausar = () => {
    if (!corriendo) return;
    setCorriendo(false);
    // Limpiar usando el ID guardado en ref
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reiniciar = () => {
    pausar();
    setTiempo(0);
    inicioRef.current = 0;
    // Ref DOM: enfocar el input después de reiniciar
    inputRef.current?.focus();
  };

  // Formatear milisegundos
  const minutos = Math.floor(tiempo / 60000);
  const segundos = Math.floor((tiempo % 60000) / 1000);
  const centesimas = Math.floor((tiempo % 1000) / 10);
  const formato = \`\${String(minutos).padStart(2, '0')}:\${String(segundos).padStart(2, '0')}.\${String(centesimas).padStart(2, '0')}\`;

  return (
    <div className="max-w-xs mx-auto text-center p-6 border rounded-xl">
      <p className="text-5xl font-mono font-bold mb-6">{formato}</p>
      <div className="flex gap-2 justify-center mb-4">
        {!corriendo ? (
          <button onClick={iniciar}
            className="px-6 py-2 bg-green-500 text-white rounded-lg">Iniciar</button>
        ) : (
          <button onClick={pausar}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg">Pausar</button>
        )}
        <button onClick={reiniciar}
          className="px-6 py-2 bg-red-500 text-white rounded-lg">Reset</button>
      </div>
      <input ref={inputRef} type="text" placeholder="Nota del tiempo..."
        className="w-full px-3 py-2 border rounded text-sm" />
    </div>
  );
}`;

export default function UseRefPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useRef</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>useRef</code> crea un objeto <code>{'{current: valor}'}</code> que persiste
        entre renders y es mutable sin causar re-renders. Es tu "espacio privado" dentro
        de un componente: React no lo trackea, no lo compara, y no re-renderiza cuando cambia.
        Tiene dos usos fundamentales: acceder al DOM directamente y guardar valores internos.
      </p>

      <InfoBox type="angular" title="Angular @ViewChild vs React useRef">
        <p>
          En Angular usas <code>@ViewChild('miRef')</code> para acceder a elementos del DOM,
          disponible en <code>ngAfterViewInit</code>. En React usas <code>useRef</code> + el
          atributo <code>ref</code> en JSX, disponible después del primer render (en <code>useEffect</code>).
          Mismo concepto, diferente ciclo de vida.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Referencia al DOM — Acceso directo a elementos</h2>
      <p className="text-text-muted mb-4">
        Cuando pasas <code>ref={'{miRef}'}</code> a un elemento JSX, React asigna el nodo DOM
        real a <code>miRef.current</code> después del render. Desde ahí puedes llamar cualquier
        API del DOM: <code>focus()</code>, <code>scrollIntoView()</code>, <code>getBoundingClientRect()</code>, etc.
      </p>
      <CodeBlock code={refDom} language="tsx" filename="ref-dom.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Guardar valores mutables — Sin re-render</h2>
      <p className="text-text-muted mb-4">
        No todo dato necesita causar un re-render. IDs de timers, flags internos, instancias
        de librerías — estos son datos que el componente necesita <strong>recordar</strong> pero
        que no afectan la UI. <code>useRef</code> es perfecto para esto porque persiste entre
        renders sin notificar a React.
      </p>
      <CodeBlock code={refValor} language="tsx" filename="ref-valor.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useRef vs useState vs variable local</h2>
      <p className="text-text-muted mb-4">
        La decisión se reduce a dos preguntas: <strong>¿afecta la UI?</strong> (→ useState)
        y <strong>¿necesita persistir entre renders?</strong> (→ useRef). Si no necesita
        persistir, una variable local es suficiente. Incluye el patrón <code>usePrevious</code>
        para guardar el valor anterior de cualquier estado.
      </p>
      <CodeBlock code={refVsState} language="tsx" filename="ref-vs-state.tsx" />

      <InfoBox type="warning" title="No leas ni escribas refs durante el render">
        Mutar <code>ref.current</code> durante el render puede causar comportamiento
        impredecible. Hazlo en <strong>event handlers</strong> o <strong>useEffect</strong>.
        La excepción: inicialización lazy (<code>if (!ref.current) ref.current = algo</code>)
        donde solo asignas una vez.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — useRef">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Objeto persistente</strong> — <code>{'{current: valor}'}</code> que sobrevive entre renders</li>
          <li><strong>No causa re-render</strong> — cambiar .current es invisible para React</li>
          <li><strong>DOM refs</strong> — acceder a elementos para focus, scroll, medir, animar</li>
          <li><strong>Valores mutables</strong> — timer IDs, flags, instancias externas</li>
          <li><strong>usePrevious</strong> — patrón común para guardar valor anterior</li>
          <li><strong>Decisión</strong>: ¿afecta UI? → useState. ¿No afecta? → useRef</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Cronómetro: useRef para timer ID (valor mutable), ref DOM para autofocus,
        ref para timestamp de inicio, y useState solo para lo que afecta la UI.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/Stopwatch.tsx" />
    </div>
  );
}
