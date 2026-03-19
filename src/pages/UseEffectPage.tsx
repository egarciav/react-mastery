import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const efectoBasico = `import { useState, useEffect } from 'react';

// useEffect ejecuta código DESPUÉS de que el componente se renderiza.
// Es el equivalente a ngOnInit + ngOnChanges + ngOnDestroy de Angular.

function Ejemplo() {
  const [count, setCount] = useState(0);

  // Se ejecuta DESPUÉS de cada render
  useEffect(() => {
    document.title = \`Clicks: \${count}\`;
    console.log('Efecto ejecutado. Count:', count);
  });

  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`;

const dependencias = `// El ARRAY DE DEPENDENCIAS controla CUÁNDO se ejecuta el efecto

function EjemploDependencias() {
  const [count, setCount] = useState(0);
  const [nombre, setNombre] = useState('');

  // 1️⃣ Sin array → se ejecuta en CADA render
  useEffect(() => {
    console.log('Cada render');
  });

  // 2️⃣ Array vacío [] → se ejecuta SOLO una vez (al montar)
  // Equivalente a ngOnInit en Angular
  useEffect(() => {
    console.log('Solo al montar (como ngOnInit)');
    // Ideal para: fetch de datos, suscripciones, setup inicial
  }, []);

  // 3️⃣ Con dependencias → se ejecuta cuando cambian esas variables
  // Equivalente a ngOnChanges para esas variables específicas
  useEffect(() => {
    console.log('Count cambió a:', count);
  }, [count]);

  // 4️⃣ Múltiples dependencias
  useEffect(() => {
    console.log('Count o nombre cambiaron');
  }, [count, nombre]);

  return <div>...</div>;
}`;

const cleanup = `// CLEANUP: la función que retornas se ejecuta al desmontar
// Equivalente a ngOnDestroy en Angular

function Reloj() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    // Setup: crear el intervalo
    const timer = setInterval(() => {
      setHora(new Date());
    }, 1000);

    // Cleanup: limpiar el intervalo al desmontar
    // ⚠️ Si no limpias, tienes un MEMORY LEAK
    return () => {
      clearInterval(timer);
      console.log('Timer limpiado');
    };
  }, []); // [] = solo al montar/desmontar

  return <p>{hora.toLocaleTimeString()}</p>;
}

// Otro ejemplo: event listeners
function TamañoVentana() {
  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setAncho(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup: remover el listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>Ancho: {ancho}px</p>;
}`;

const fetchDatos = `// Patrón más común: fetch de datos con useEffect

interface Usuario {
  id: number;
  name: string;
  email: string;
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función async dentro del efecto (useEffect NO puede ser async)
    const fetchUsuarios = async () => {
      try {
        setCargando(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error('Error en la petición');
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setCargando(false);
      }
    };

    fetchUsuarios();
  }, []); // [] = solo al montar

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {usuarios.map(u => (
        <li key={u.id}>{u.name} - {u.email}</li>
      ))}
    </ul>
  );
}`;

const reglas = `// ⚠️ REGLAS de useEffect que DEBES seguir

// 1. NUNCA hagas el efecto async directamente
// ❌ MAL
useEffect(async () => {
  const data = await fetch('/api');
}, []);

// ✅ BIEN: define una función async adentro
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch('/api');
  };
  fetchData();
}, []);

// 2. SIEMPRE incluye TODAS las dependencias que usas
const [userId, setUserId] = useState(1);

// ❌ MAL: usa userId pero no está en las dependencias
useEffect(() => {
  fetch(\`/api/users/\${userId}\`);
}, []); // ESLint te avisará

// ✅ BIEN: userId está en las dependencias
useEffect(() => {
  fetch(\`/api/users/\${userId}\`);
}, [userId]);

// 3. SIEMPRE limpia suscripciones, timers y listeners
useEffect(() => {
  const sub = api.subscribe(data => setData(data));
  return () => sub.unsubscribe(); // ✅ Cleanup
}, []);`;

const raceCondition = `// RACE CONDITION en fetch — bug muy común en React
//
// Si el usuario cambia de ID rápidamente (1 → 2 → 3),
// pueden llegar respuestas en orden incorrecto:
// respuesta de id=1 llega DESPUÉS de id=3 → datos incorrectos en pantalla

// ❌ Versión con race condition:
function PerfilMalo({ userId }: { userId: number }) {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(data => setPerfil(data)); // ⚠️ puede llegar tarde y sobreescribir
    // No hay cleanup → si userId cambia, la respuesta anterior puede llegar
  }, [userId]);

  return <div>{perfil?.nombre}</div>;
}

// ✅ Solución 1: flag de "ignorar" (simple y efectiva)
function PerfilConFlag({ userId }: { userId: number }) {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let ignorar = false; // flag local al efecto

    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(data => {
        if (!ignorar) setPerfil(data); // solo actualiza si es el efecto más reciente
      });

    return () => {
      ignorar = true; // cuando el efecto se limpie, ignora la respuesta pendiente
    };
  }, [userId]);

  return <div>{perfil?.nombre}</div>;
}

// ✅ Solución 2: AbortController (cancela la petición directamente)
function PerfilConAbort({ userId }: { userId: number }) {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPerfil = async () => {
      try {
        const res = await fetch(\`/api/users/\${userId}\`, {
          signal: controller.signal, // pasa la señal al fetch
        });
        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // fetch cancelado — ignorar silenciosamente
        }
        console.error(err);
      }
    };

    fetchPerfil();

    return () => controller.abort(); // cancela el fetch en vuelo al limpiar
  }, [userId]);

  return <div>{perfil?.nombre}</div>;
}

// StrictMode ejecuta efectos dos veces → la primera llamada se cancela/ignora.
// Esto es intencional: StrictMode te obliga a manejar el cleanup correctamente.`;

export default function UseEffectPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">useEffect</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        <code>useEffect</code> permite ejecutar <strong>efectos secundarios</strong> en
        tus componentes: fetch de datos, suscripciones, manipulación del DOM, timers.
        Es el equivalente al ciclo de vida de Angular (ngOnInit, ngOnChanges, ngOnDestroy)
        unificado en un solo hook.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Efecto básico</h2>
      <CodeBlock code={efectoBasico} language="tsx" filename="efecto-basico.tsx" />

      <InfoBox type="angular">
        En Angular tienes métodos de ciclo de vida separados: <code>ngOnInit()</code>,{' '}
        <code>ngOnChanges()</code>, <code>ngOnDestroy()</code>. En React, <code>useEffect</code>{' '}
        unifica todo esto en un solo hook. El array de dependencias controla cuándo se ejecuta.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Array de dependencias</h2>
      <p className="text-text-muted mb-4">
        El segundo argumento de useEffect es clave. Controla <strong>cuándo</strong> se
        re-ejecuta el efecto.
      </p>
      <CodeBlock code={dependencias} language="tsx" filename="dependencias.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Cleanup (limpieza)</h2>
      <p className="text-text-muted mb-4">
        La función que retornas del efecto se ejecuta al desmontar el componente
        o antes de re-ejecutar el efecto. Es tu <strong>ngOnDestroy</strong>.
      </p>
      <CodeBlock code={cleanup} language="tsx" filename="cleanup.tsx" />

      <InfoBox type="warning" title="Memory leaks">
        Si no limpias timers, listeners o suscripciones, tienes un memory leak.
        React te avisará en desarrollo (StrictMode ejecuta efectos dos veces para detectar esto).
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Fetch de datos</h2>
      <p className="text-text-muted mb-4">El patrón más común con useEffect.</p>
      <CodeBlock code={fetchDatos} language="tsx" filename="fetch-datos.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Reglas importantes</h2>
      <CodeBlock code={reglas} language="tsx" filename="reglas-useeffect.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Race conditions y AbortController</h2>
      <p className="text-text-muted mb-4">
        Cuando una dependencia cambia rápidamente (ej: el usuario navega entre IDs),
        pueden llegar respuestas HTTP en orden incorrecto. Este es un bug sutil pero
        muy común que debes saber solucionar.
      </p>
      <CodeBlock code={raceCondition} language="tsx" filename="race-condition.tsx" />

      <InfoBox type="tip" title="Resumen de useEffect">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Sin deps</strong>: cada render</li>
          <li><strong>[]</strong>: solo al montar (ngOnInit)</li>
          <li><strong>[x, y]</strong>: cuando x o y cambian (ngOnChanges)</li>
          <li><strong>return () =&gt; ...</strong>: cleanup (ngOnDestroy)</li>
          <li>Nunca hagas el efecto async directamente</li>
        </ul>
      </InfoBox>
    </div>
  );
}
