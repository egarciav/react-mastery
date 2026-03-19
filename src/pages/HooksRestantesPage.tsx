import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useLayoutEffectCode = `import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// useLayoutEffect es IGUAL que useEffect pero se ejecuta
// SINCRÓNICAMENTE después del commit, ANTES de que el navegador pinte.

// ORDEN DE EJECUCIÓN:
// 1. React renderiza (fase render)
// 2. React aplica cambios al DOM (fase commit)
// 3. useLayoutEffect corre ← síncrono, bloquea el pintado
// 4. El navegador pinta la pantalla
// 5. useEffect corre ← asíncrono, después del pintado

function Tooltip({ children, texto }: {
  children: React.ReactNode;
  texto: string;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  // ✅ useLayoutEffect: medir el DOM ANTES de que el usuario lo vea
  // Evita el "flash" de posición incorrecta
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      // Calcular posición y ajustar si sale de la pantalla
      const top = rect.bottom > window.innerHeight
        ? rect.top - 30  // aparece arriba
        : rect.bottom;    // aparece abajo
      setPosicion({ top, left: rect.left });
    }
  });

  // ❌ Con useEffect: el tooltip aparecería un frame en posición
  // incorrecta y luego "saltaría" a la correcta (parpadeo visible)

  return (
    <div ref={tooltipRef} style={{ position: 'relative' }}>
      {children}
      <div style={{ position: 'fixed', top: posicion.top, left: posicion.left }}>
        {texto}
      </div>
    </div>
  );
}

// REGLA: Usa useLayoutEffect SOLO cuando necesitas
// leer/modificar el DOM ANTES de que el usuario lo vea.
// En todos los demás casos, usa useEffect.`;

const useIdCode = `import { useId } from 'react';

// useId genera un ID único y estable para accesibilidad.
// Resuelve el problema de IDs duplicados cuando un componente
// se renderiza múltiples veces en la misma página.

function CampoFormulario({ label, tipo = 'text' }: {
  label: string;
  tipo?: string;
}) {
  // Genera un ID único: ":r0:", ":r1:", etc.
  const id = useId();

  return (
    <div>
      {/* htmlFor y id SIEMPRE coinciden, sin importar cuántas
          instancias de este componente existan en la página */}
      <label htmlFor={id}>{label}</label>
      <input id={id} type={tipo} />
    </div>
  );
}

// Uso: múltiples instancias con IDs únicos automáticos
function Formulario() {
  return (
    <form>
      <CampoFormulario label="Nombre" />          {/* id=":r0:" */}
      <CampoFormulario label="Email" tipo="email" />  {/* id=":r1:" */}
      <CampoFormulario label="Teléfono" tipo="tel" /> {/* id=":r2:" */}
    </form>
  );
}

// ❌ El problema SIN useId:
function CampoMalo({ label }: { label: string }) {
  return (
    <>
      <label htmlFor="mi-input">{label}</label>
      <input id="mi-input" />
      {/* Si este componente se usa 2 veces, hay 2 elementos con id="mi-input"
          Eso viola HTML y rompe accesibilidad */}
    </>
  );
}`;

const useImperativeHandleCode = `import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// useImperativeHandle expone métodos del hijo al padre via ref.
// Permite una API imperativa en componentes declarativos.
// Usado junto con forwardRef (React 18) o ref-como-prop (React 19).

interface InputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
}

// ─── React 19: ref como prop (sin forwardRef) ───
function InputPersonalizado({
  ref,
  placeholder,
}: {
  ref?: React.Ref<InputHandle>;
  placeholder?: string;
}) {
  const [valor, setValor] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Expone solo los métodos que quieres dar al padre
  // El padre NO puede acceder al DOM interno directamente
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => setValor(''),
    getValue: () => valor,
  }));

  return (
    <input
      ref={inputRef}
      value={valor}
      onChange={e => setValor(e.target.value)}
      placeholder={placeholder}
    />
  );
}

// El padre usa los métodos expuestos
function Formulario() {
  const inputRef = useRef<InputHandle>(null);

  const handleSubmit = () => {
    const valor = inputRef.current?.getValue();
    console.log('Valor:', valor);
    inputRef.current?.clear();   // limpia el input
  };

  return (
    <div>
      <InputPersonalizado ref={inputRef} placeholder="Escribe..." />
      <button onClick={() => inputRef.current?.focus()}>Enfocar</button>
      <button onClick={handleSubmit}>Enviar y limpiar</button>
    </div>
  );
}

// ¿Cuándo usar useImperativeHandle?
// Cuando un componente necesita exponer una API imperativa:
// - Reproductores de video/audio (play, pause, seek)
// - Modales (open, close)
// - Listas virtuales (scrollToIndex)
// - Formularios complejos (reset, validate)`;

const useSyncExternalStore = `import { useSyncExternalStore } from 'react';

// useSyncExternalStore: suscribirse a stores externos
// (librerías de estado como Zustand, Redux, o stores propios)
// Es el hook correcto para integrar React con cualquier store externo.

// Ejemplo: suscribirse al estado de una librería externa
function useOnlineStatus() {
  return useSyncExternalStore(
    // subscribe: función para suscribirse a cambios
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    // getSnapshot: función que retorna el valor actual
    () => navigator.onLine,
    // getServerSnapshot: para SSR (opcional)
    () => true,
  );
}

function EstadoConexion() {
  const estaOnline = useOnlineStatus();
  return (
    <p>{estaOnline ? '🟢 Conectado' : '🔴 Sin conexión'}</p>
  );
}`;

export default function HooksRestantesPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Hooks Restantes</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Hooks menos frecuentes pero importantes: <code>useLayoutEffect</code>,{' '}
        <code>useId</code>, <code>useImperativeHandle</code> y{' '}
        <code>useSyncExternalStore</code>. Cada uno resuelve un caso específico.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">useLayoutEffect</h2>
      <p className="text-text-muted mb-4">
        Igual que <code>useEffect</code> pero corre <strong>síncronamente antes</strong>{' '}
        de que el navegador pinte. Úsalo solo para medir o modificar el DOM antes de
        que el usuario lo vea.
      </p>
      <CodeBlock code={useLayoutEffectCode} language="tsx" filename="useLayoutEffect.tsx" />

      <InfoBox type="warning" title="useLayoutEffect en SSR">
        <code>useLayoutEffect</code> no corre en el servidor (SSR). Si tu app usa SSR
        y necesitas leer el DOM, asegúrate de que el código solo corra en el cliente, o
        usa <code>useEffect</code> con algún estado para diferir la medición.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">useId</h2>
      <p className="text-text-muted mb-4">
        Genera IDs únicos y estables para vincular elementos de accesibilidad
        (<code>htmlFor</code>/<code>id</code>, <code>aria-describedby</code>).
      </p>
      <CodeBlock code={useIdCode} language="tsx" filename="useId.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useImperativeHandle</h2>
      <p className="text-text-muted mb-4">
        Expone métodos específicos de un hijo al padre via <code>ref</code>, manteniendo
        la encapsulación del componente.
      </p>
      <CodeBlock code={useImperativeHandleCode} language="tsx" filename="useImperativeHandle.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useSyncExternalStore</h2>
      <p className="text-text-muted mb-4">
        El hook oficial para suscribirse a <strong>stores externos</strong> (Zustand,
        Redux, o cualquier store propio).
      </p>
      <CodeBlock code={useSyncExternalStore} language="tsx" filename="useSyncExternalStore.tsx" />

      <InfoBox type="tip" title="Mapa completo de todos los hooks de React">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs">
          <span><strong>Estado:</strong> useState, useReducer</span>
          <span><strong>Contexto:</strong> useContext, use</span>
          <span><strong>Efectos:</strong> useEffect, useLayoutEffect</span>
          <span><strong>Refs:</strong> useRef, useImperativeHandle</span>
          <span><strong>Memos:</strong> useMemo, useCallback</span>
          <span><strong>IDs:</strong> useId</span>
          <span><strong>Concurrente:</strong> useTransition, useDeferredValue</span>
          <span><strong>Stores:</strong> useSyncExternalStore</span>
          <span><strong>Forms (R19):</strong> useActionState, useOptimistic</span>
          <span><strong>Forms (R19):</strong> useFormStatus</span>
        </div>
      </InfoBox>
    </div>
  );
}
