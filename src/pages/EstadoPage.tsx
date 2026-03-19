import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useStateBasico = `import { useState } from 'react';

// useState es el hook para manejar estado en React.
// Retorna un array con [valorActual, funciónParaCambiarlo]

function Contador() {
  // Declaramos una variable de estado llamada "count"
  // 0 es el valor inicial
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(0)}>
        Reiniciar
      </button>
    </div>
  );
}`;

const multipleEstados = `function Formulario() {
  // Puedes tener MÚLTIPLES useState en un componente
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(0);
  const [activo, setActivo] = useState(true);
  const [hobbies, setHobbies] = useState<string[]>([]);

  // Cada useState es independiente
  return (
    <div>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={() => setEdad(e => e + 1)}>
        Edad: {edad}
      </button>
      <button onClick={() => setActivo(!activo)}>
        {activo ? 'Activo' : 'Inactivo'}
      </button>
      <button onClick={() => setHobbies([...hobbies, 'Nuevo'])}>
        Agregar hobby ({hobbies.length})
      </button>
    </div>
  );
}`;

const estadoObjetos = `// ⚠️ REGLA CRÍTICA: Nunca mutes el estado directamente.
// Siempre crea un NUEVO objeto/array.

interface Usuario {
  nombre: string;
  email: string;
  direccion: {
    ciudad: string;
    pais: string;
  };
}

function PerfilUsuario() {
  const [usuario, setUsuario] = useState<Usuario>({
    nombre: 'María',
    email: 'maria@test.com',
    direccion: { ciudad: 'CDMX', pais: 'México' },
  });

  // ❌ NUNCA hagas esto — mutar directamente
  // usuario.nombre = 'Carlos';
  // setUsuario(usuario);

  // ✅ Crea un nuevo objeto con spread
  const cambiarNombre = (nuevoNombre: string) => {
    setUsuario({ ...usuario, nombre: nuevoNombre });
  };

  // ✅ Para objetos anidados, spread en cada nivel
  const cambiarCiudad = (nuevaCiudad: string) => {
    setUsuario({
      ...usuario,
      direccion: { ...usuario.direccion, ciudad: nuevaCiudad },
    });
  };

  return (
    <div>
      <p>{usuario.nombre} - {usuario.direccion.ciudad}</p>
      <button onClick={() => cambiarNombre('Carlos')}>
        Cambiar nombre
      </button>
      <button onClick={() => cambiarCiudad('Guadalajara')}>
        Cambiar ciudad
      </button>
    </div>
  );
}`;

const estadoArrays = `function ListaTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Aprender React', hecho: false },
    { id: 2, texto: 'Crear proyecto', hecho: false },
  ]);

  // ✅ AGREGAR — spread + nuevo elemento
  const agregar = (texto: string) => {
    setTareas([...tareas, { id: Date.now(), texto, hecho: false }]);
  };

  // ✅ ELIMINAR — filter crea un nuevo array
  const eliminar = (id: number) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  // ✅ ACTUALIZAR — map crea un nuevo array
  const toggleHecho = (id: number) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, hecho: !t.hecho } : t
    ));
  };

  // ✅ ORDENAR — copia el array primero
  const ordenar = () => {
    setTareas([...tareas].sort((a, b) => a.texto.localeCompare(b.texto)));
  };

  return (
    <ul>
      {tareas.map(t => (
        <li key={t.id}>
          <span style={{ textDecoration: t.hecho ? 'line-through' : 'none' }}>
            {t.texto}
          </span>
          <button onClick={() => toggleHecho(t.id)}>✓</button>
          <button onClick={() => eliminar(t.id)}>✕</button>
        </li>
      ))}
    </ul>
  );
}`;

const updaterFunction = `// Cuando el nuevo estado depende del anterior,
// usa la FUNCIÓN ACTUALIZADORA

function ContadorSeguro() {
  const [count, setCount] = useState(0);

  // ❌ Problema: si llamas esto 3 veces seguidas,
  // count sigue siendo el mismo valor en las 3 llamadas
  const incrementarMal = () => {
    setCount(count + 1); // count = 0 → 1
    setCount(count + 1); // count = 0 → 1 (¡NO 2!)
    setCount(count + 1); // count = 0 → 1 (¡NO 3!)
  };

  // ✅ Solución: función actualizadora recibe el valor ANTERIOR
  const incrementarBien = () => {
    setCount(prev => prev + 1); // 0 → 1
    setCount(prev => prev + 1); // 1 → 2
    setCount(prev => prev + 1); // 2 → 3
  };

  // ✅ SIEMPRE usa la función actualizadora cuando
  // el nuevo valor depende del anterior
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementarBien}>+3</button>
    </div>
  );
}`;

const lazyInit = `// INICIALIZACIÓN LAZY: para cálculos costosos en el valor inicial

// ❌ Sin lazy init: parsea localStorage en CADA render
const [items, setItems] = useState(
  JSON.parse(localStorage.getItem('items') || '[]')
);

// ✅ Con lazy init: la función SOLO se ejecuta una vez (al montar)
// Pasa una función (sin llamarla) como valor inicial
const [items2, setItems2] = useState(() => {
  const guardado = localStorage.getItem('items');
  return guardado ? JSON.parse(guardado) : [];
});

// Otro ejemplo: calcular el estado inicial con lógica compleja
const [config, setConfig] = useState(() => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    tema: urlParams.get('tema') || 'oscuro',
    idioma: urlParams.get('lang') || 'es',
    debug: urlParams.has('debug'),
  };
});

// La función de inicialización lazy:
// - Solo se llama UNA vez (al primer render)
// - Es perfecta para operaciones costosas: leer localStorage,
//   parsear JSON, calcular algo complejo
// - Se ignora en todos los re-renders siguientes`;

const estadoDerivado = `// ESTADO DERIVADO: NO guardes en state lo que puedes CALCULAR
// Este es uno de los errores más comunes viniendo de Angular.

interface Producto { id: number; nombre: string; precio: number; }

// ❌ MAL: estado redundante que hay que mantener sincronizado
function CarritoMalo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);          // ❌ derivado
  const [cantidad, setCantidad] = useState(0);    // ❌ derivado

  const agregar = (p: Producto) => {
    const nuevos = [...productos, p];
    setProductos(nuevos);
    setTotal(nuevos.reduce((s, p) => s + p.precio, 0)); // hay que recordar actualizar esto
    setCantidad(nuevos.length);                          // y esto también
    // Si te olvidas de uno → estado inconsistente → bug
  };
}

// ✅ BIEN: calcula en tiempo de render (es gratis)
function CarritoBien() {
  const [productos, setProductos] = useState<Producto[]>([]);

  // Estas son variables normales, calculadas del estado
  const total = productos.reduce((s, p) => s + p.precio, 0);
  const cantidad = productos.length;
  const hayProductos = productos.length > 0;
  const masCaroMenos500 = productos.filter(p => p.precio < 500);

  // Solo necesitas actualizar UNA cosa: productos
  const agregar = (p: Producto) => setProductos(prev => [...prev, p]);

  return (
    <div>
      <p>{cantidad} productos - Total: \${total}</p>
      {hayProductos && <button>Pagar</button>}
    </div>
  );
}

// REGLA:
// Si un valor se puede calcular a partir de props o estado existente,
// NO lo pongas en useState. Calcula directamente en el render.
// Para cálculos COSTOSOS, usa useMemo.`;

const liftingState = `// LIFTING STATE UP — Elevar el estado al padre común
//
// Cuando dos componentes HERMANOS necesitan compartir datos,
// el estado debe vivir en su PADRE COMÚN más cercano.
// El padre pasa los datos hacia abajo via props.

// PROBLEMA: dos hermanos que necesitan el mismo dato
function PanelBusqueda() {
  const [query, setQuery] = useState('');
  // ¿Cómo le paso 'query' a ListaResultados? Son hermanos...
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

function ListaResultados() {
  // ¿Cómo accedo al query de PanelBusqueda? No puedo...
  return <ul>...</ul>;
}

// ❌ MAL: cada uno tiene su propio estado — están desincronizados
function PaginaBusquedaMala() {
  return (
    <div>
      <PanelBusqueda />
      <ListaResultados />  {/* No tiene acceso al query */}
    </div>
  );
}

// ✅ SOLUCIÓN: LEVANTAR el estado al padre común
// El padre lo tiene y lo pasa hacia abajo a ambos hijos.

function InputBusqueda({ query, onChange }: {
  query: string;
  onChange: (q: string) => void;
}) {
  return (
    <input value={query} onChange={e => onChange(e.target.value)} />
  );
}

function Resultados({ query }: { query: string }) {
  const resultados = usarDatosConQuery(query); // usa el query del padre
  return <ul>{resultados.map(r => <li key={r}>{r}</li>)}</ul>;
}

function PaginaBusqueda() {
  // El estado VIVE en el padre común
  const [query, setQuery] = useState('');

  return (
    <div>
      <InputBusqueda query={query} onChange={setQuery} />
      <Resultados query={query} />  {/* ambos en sincronía */}
    </div>
  );
}

// Este es el FLUJO DE DATOS UNIDIRECCIONAL de React:
// Estado vive en el padre → baja via props → hijo notifica cambios con funciones`;

export default function EstadoPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Estado — useState</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        El estado es <strong>datos que cambian con el tiempo</strong> y que al cambiar,
        hacen que el componente se vuelva a renderizar. <code>useState</code> es el hook
        principal para manejar estado en React.
      </p>

      <InfoBox type="angular" title="Estado en Angular vs React">
        En Angular, el estado es simplemente una propiedad de clase: <code>count = 0</code> y
        cambias con <code>this.count++</code>. Angular detecta cambios via Zone.js o Signals.
        En React, DEBES usar <code>useState</code> para que React sepa que algo cambió y
        re-renderice el componente.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">useState básico</h2>
      <CodeBlock code={useStateBasico} language="tsx" filename="useState-basico.tsx" />

      <InfoBox type="warning" title="¿Por qué no una variable normal?">
        Si usas <code>let count = 0</code> en vez de <code>useState</code>, al cambiar
        el valor React NO se enterará y NO actualizará la pantalla. <code>useState</code>
        le dice a React: "cuando este valor cambie, re-renderiza el componente".
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Múltiples estados</h2>
      <CodeBlock code={multipleEstados} language="tsx" filename="multiples-estados.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Estado con objetos</h2>
      <p className="text-text-muted mb-4">
        Cuando el estado es un objeto, <strong>nunca lo mutes directamente</strong>.
        Siempre crea un nuevo objeto con el operador spread.
      </p>
      <CodeBlock code={estadoObjetos} language="tsx" filename="estado-objetos.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Estado con arrays</h2>
      <p className="text-text-muted mb-4">
        Los arrays siguen la misma regla: <strong>nunca uses push, splice, sort directo</strong>.
        Usa métodos que retornan un nuevo array: map, filter, spread, slice.
      </p>
      <CodeBlock code={estadoArrays} language="tsx" filename="estado-arrays.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Función actualizadora</h2>
      <p className="text-text-muted mb-4">
        Cuando el nuevo estado depende del estado anterior, usa la forma funcional
        del setter. Esto evita bugs sutiles con actualizaciones en batch.
      </p>
      <CodeBlock code={updaterFunction} language="tsx" filename="updater-function.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Inicialización lazy</h2>
      <p className="text-text-muted mb-4">
        Si el valor inicial requiere un cálculo costoso (leer localStorage, parsear JSON),
        pasa una <strong>función</strong> a useState en lugar del valor directo.
        Esa función solo se ejecuta <strong>una vez</strong>, en el primer render.
      </p>
      <CodeBlock code={lazyInit} language="tsx" filename="lazy-init.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Estado derivado — no guardes lo que puedes calcular</h2>
      <p className="text-text-muted mb-4">
        Uno de los errores más comunes viniendo de Angular: guardar en estado
        valores que se pueden <strong>calcular directamente</strong> de otros
        datos ya existentes. Esto crea redundancia y bugs de sincronización.
      </p>
      <CodeBlock code={estadoDerivado} language="tsx" filename="estado-derivado.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Lifting State Up — Elevar el estado</h2>
      <p className="text-text-muted mb-4">
        Cuando dos componentes hermanos necesitan compartir el mismo dato,
        el estado debe <strong>subir al padre común</strong>. Es el patrón
        central del flujo de datos en React.
      </p>
      <CodeBlock code={liftingState} language="tsx" filename="lifting-state.tsx" />

      <InfoBox type="angular" title="Lifting State Up vs Angular">
        En Angular resuelves esto con un <strong>servicio compartido</strong> vía DI o con Signals.
        En React el enfoque preferido es subir el estado al padre y pasarlo hacia abajo via props.
        Para datos que cruzan muchos niveles, se usa Context. Para datos globales complejos,
        useReducer + Context o una librería como Zustand.
      </InfoBox>

      <InfoBox type="tip" title="Reglas del estado">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Inmutabilidad</strong>: nunca mutes, siempre crea copias nuevas</li>
          <li><strong>Función actualizadora</strong>: usa <code>prev =&gt;</code> cuando dependes del valor anterior</li>
          <li><strong>Lazy init</strong>: pasa función a useState para cálculos costosos</li>
          <li><strong>Sin estado derivado</strong>: calcula en el render en vez de guardar</li>
          <li><strong>Lifting up</strong>: eleva el estado al padre cuando dos hijos lo comparten</li>
          <li><strong>Batching</strong>: React agrupa múltiples setters en un solo re-render</li>
        </ul>
      </InfoBox>
    </div>
  );
}
