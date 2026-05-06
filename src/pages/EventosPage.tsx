import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const eventosBasicos = `// ¿CÓMO maneja React los eventos?
// React NO agrega un addEventListener a cada elemento del DOM.
// En su lugar, usa EVENT DELEGATION: registra UN solo listener
// en el nodo raíz (#root) y desde ahí despacha a los handlers.
//
// ¿POR QUÉ event delegation?
// 1. Rendimiento: 1 listener vs miles (uno por cada botón/input)
// 2. Memoria: menos listeners = menos consumo
// 3. Consistencia: React controla todo el flujo de eventos
//
// Los eventos en React usan camelCase y reciben FUNCIONES, no strings.
// onClick={fn} NO onClick="fn()" — esto es JavaScript, no HTML.

function Botones() {
  // Función manejadora definida aparte (patrón recomendado)
  const handleClick = () => {
    console.log('¡Botón clickeado!');
  };

  // Función con el evento tipado como parámetro
  // React.MouseEvent<HTMLButtonElement> = evento de mouse sobre un button
  const handleClickConEvento = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Tipo:', e.type);            // "click"
    console.log('Target:', e.currentTarget);  // el botón (tipado)
    e.preventDefault();   // prevenir comportamiento por defecto
    e.stopPropagation();  // evitar propagación (bubbling)
  };

  return (
    <div>
      {/* ✅ Pasar la REFERENCIA a la función (sin paréntesis) */}
      {/* onClick recibe una función para ejecutar CUANDO ocurra el click */}
      <button onClick={handleClick}>Click me</button>

      {/* ✅ Función inline (arrow function) — OK para handlers simples */}
      <button onClick={() => console.log('inline click')}>
        Inline
      </button>

      {/* ❌ ERROR MUY COMÚN: esto EJECUTA la función AHORA, en el render */}
      {/* <button onClick={handleClick()}>No hagas esto</button> */}
      {/* handleClick() retorna undefined → onClick recibe undefined */}
      {/* handleClick se ejecuta en cada render, no cuando el user hace click */}

      {/* ✅ Para pasar el evento, pasa la referencia directamente */}
      <button onClick={handleClickConEvento}>Con evento</button>
      {/* React llama handleClickConEvento(syntheticEvent) automáticamente */}
    </div>
  );
}`;

const tiposEventos = `// Tipos de eventos comunes y sus tipos TypeScript
//
// ¿CÓMO se determina el tipo correcto?
// El tipo tiene dos partes: React.[TipoEvento]<[ElementoHTML]>
// TipoEvento = qué pasó (click, change, submit, key, focus...)
// ElementoHTML = en qué elemento ocurrió (input, button, form...)
//
// ¿POR QUÉ tipar los eventos?
// Porque TypeScript te da autocompletado y validación:
// - e.target.value solo existe si el tipo incluye un input/textarea
// - e.key solo existe en KeyboardEvent
// - e.clientX/Y solo existe en MouseEvent

function FormularioEventos() {
  // onChange — se dispara cada vez que el valor cambia
  // ChangeEvent<HTMLInputElement> → e.target.value es string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Nuevo valor:', e.target.value);
  };

  // onSubmit — al enviar el formulario (click en submit o Enter)
  // FormEvent<HTMLFormElement> → se usa e.preventDefault() SIEMPRE
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Sin esto, el navegador recarga la página
    console.log('Formulario enviado');
  };

  // onKeyDown — al presionar una tecla (antes de que aparezca)
  // KeyboardEvent → e.key es el nombre de la tecla ('Enter', 'Escape', 'a')
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter presionado');
    }
    // e.key vs e.code:
    // e.key = valor lógico ('a', 'Enter') — depende del layout del teclado
    // e.code = tecla física ('KeyA', 'Enter') — siempre la misma tecla
  };

  // onFocus / onBlur — el foco entra o sale del elemento
  // FocusEvent<HTMLInputElement> → útil para validación
  const handleFocus = () => console.log('Input enfocado');
  const handleBlur = () => console.log('Input perdió foco → validar aquí');

  // onMouseEnter / onMouseLeave — hover (sin bubbling)
  // vs onMouseOver / onMouseOut — hover (con bubbling a hijos)
  const handleMouseEnter = () => console.log('Mouse entró');

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div onMouseEnter={handleMouseEnter}>
        Pasa el mouse aquí
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}

// REFERENCIA RÁPIDA de tipos:
// React.MouseEvent<HTMLButtonElement>    → onClick, onDoubleClick
// React.ChangeEvent<HTMLInputElement>    → onChange (input, select, textarea)
// React.FormEvent<HTMLFormElement>       → onSubmit
// React.KeyboardEvent<HTMLInputElement>  → onKeyDown, onKeyUp
// React.FocusEvent<HTMLInputElement>     → onFocus, onBlur
// React.DragEvent<HTMLDivElement>        → onDrag, onDrop
// React.ClipboardEvent<HTMLInputElement> → onCopy, onPaste`;

const eventosConParametros = `// Pasar parámetros adicionales a un manejador de eventos
//
// ¿POR QUÉ necesitas una arrow function para pasar argumentos?
// onClick espera una FUNCIÓN. Si escribes onClick={handleComprar(p)},
// estás EJECUTANDO handleComprar(p) durante el render, no cuando
// el usuario hace click. La arrow function crea una nueva función
// que se ejecutará cuando ocurra el click.
//
// onClick={handleComprar(p)}      → ejecuta AHORA (error)
// onClick={() => handleComprar(p)} → ejecuta al hacer CLICK (correcto)

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

function ListaProductos() {
  const productos: Producto[] = [
    { id: 1, nombre: 'React Book', precio: 29.99 },
    { id: 2, nombre: 'TS Course', precio: 49.99 },
  ];

  // Handler que recibe datos del producto
  const handleComprar = (producto: Producto) => {
    console.log(\`Comprando: \${producto.nombre} - $\${producto.precio}\`);
  };

  // Handler que recibe múltiples argumentos
  const handleEliminar = (id: number, nombre: string) => {
    console.log(\`Eliminando \${nombre} (id: \${id})\`);
  };

  // Handler que necesita TANTO el dato como el evento
  const handleClickConEvento = (
    producto: Producto,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // evitar que el click llegue al padre
    console.log(\`Comprando \${producto.nombre}\`);
  };

  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>
          {p.nombre} - \${p.precio}
          {/* Arrow function: crea una función que llama a handleComprar con p */}
          <button onClick={() => handleComprar(p)}>Comprar</button>
          <button onClick={() => handleEliminar(p.id, p.nombre)}>
            Eliminar
          </button>
          {/* Si necesitas el evento, pásalo explícitamente */}
          <button onClick={(e) => handleClickConEvento(p, e)}>
            Comprar (con evento)
          </button>
        </li>
      ))}
    </ul>
  );
}

// ¿Crea arrow functions en cada render un problema de rendimiento?
// En la GRAN mayoría de apps, NO. Las arrow functions inline son
// extremadamente baratas de crear. Solo optimiza con useCallback
// si tienes MILES de elementos y lo has medido con React DevTools.`;

const ejemploGithub = `// ============================================
// 📁 src/components/SearchBar.tsx
// Ejemplo COMPLETO: eventos, tipos TS, estado controlado
// ============================================
import { useState } from 'react';

interface SearchResult {
  id: number;
  titulo: string;
  categoria: string;
}

const DATOS: SearchResult[] = [
  { id: 1, titulo: 'Introducción a React', categoria: 'react' },
  { id: 2, titulo: 'TypeScript Básico', categoria: 'typescript' },
  { id: 3, titulo: 'Hooks Avanzados', categoria: 'react' },
  { id: 4, titulo: 'Vite Config', categoria: 'tooling' },
  { id: 5, titulo: 'Testing con Vitest', categoria: 'testing' },
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [historial, setHistorial] = useState<string[]>([]);

  // onChange tipado: React.ChangeEvent<HTMLInputElement>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // onSubmit: preventDefault para evitar recarga
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setHistorial(prev => [query, ...prev.slice(0, 4)]);
      setQuery('');
    }
  };

  // onKeyDown: Escape para limpiar
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') setQuery('');
  };

  // Filtrado (estado derivado)
  const resultados = DATOS.filter(d =>
    d.titulo.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text" value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Buscar... (Esc para limpiar)"
          className="flex-1 px-3 py-2 border rounded"
          autoFocus
        />
        <button type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded">
          Buscar
        </button>
      </form>

      {query && (
        <ul className="mt-3 border rounded divide-y">
          {resultados.length === 0 ? (
            <li className="p-3 text-gray-400">Sin resultados</li>
          ) : (
            resultados.map(r => (
              <li key={r.id} className="p-3 flex justify-between"
                onClick={() => alert(\`Seleccionaste: \${r.titulo}\`)}>
                <span>{r.titulo}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.categoria}</span>
              </li>
            ))
          )}
        </ul>
      )}

      {historial.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Búsquedas recientes:</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {historial.map((h, i) => (
              <button key={i} onClick={() => setQuery(h)}
                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`;

export default function EventosPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Eventos</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React maneja eventos usando <strong>event delegation</strong>: registra un solo listener
        en el nodo raíz y despacha desde ahí. Los nombres son <strong>camelCase</strong>, se pasan
        <strong> funciones</strong> (no strings), y los eventos son <strong>SyntheticEvents</strong> que
        normalizan el comportamiento entre navegadores.
      </p>

      <InfoBox type="angular" title="Eventos: Angular vs React">
        <p>
          Angular: <code>(click)="handleClick()"</code> — syntax de template con string y paréntesis.
          React: <code>onClick={'{handleClick}'}</code> — camelCase y referencia a función JavaScript.
          Angular usa <code>$event</code> para el evento; React lo pasa como primer argumento
          automáticamente. Internamente, Angular usa zone.js para detectar eventos; React usa
          event delegation nativa en el nodo raíz.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Eventos básicos — Cómo funciona el sistema de eventos</h2>
      <p className="text-text-muted mb-4">
        React usa event delegation: un solo listener en <code>#root</code> para todos los
        eventos. Cuando haces click en un botón, el evento burbujea hasta root, React
        identifica qué componente lo disparó, y ejecuta tu handler.
      </p>
      <CodeBlock code={eventosBasicos} language="tsx" filename="eventos-basicos.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tipos de eventos y TypeScript</h2>
      <p className="text-text-muted mb-4">
        React provee tipos TypeScript para cada evento. El patrón es
        <code> React.[TipoEvento]&lt;[ElementoHTML]&gt;</code>. Tipar correctamente te da
        autocompletado y validación en compile time.
      </p>
      <CodeBlock code={tiposEventos} language="tsx" filename="tipos-eventos.tsx" />

      <InfoBox type="info" title="¿Cómo funcionan los SyntheticEvents?">
        React envuelve los eventos nativos en <code>SyntheticEvent</code>, un wrapper cross-browser.
        Tienen la misma interfaz que los nativos (<code>preventDefault</code>, <code>stopPropagation</code>)
        pero garantizan comportamiento idéntico en todos los navegadores. Puedes acceder al evento
        nativo con <code>e.nativeEvent</code> si lo necesitas, aunque casi nunca es necesario.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Eventos con parámetros — Por qué necesitas arrow functions</h2>
      <p className="text-text-muted mb-4">
        <code>onClick</code> espera una <strong>función</strong>. Para pasar argumentos, envuelve
        la llamada en una arrow function. Sin ella, la función se ejecuta durante el render,
        no cuando el usuario hace click.
      </p>
      <CodeBlock code={eventosConParametros} language="tsx" filename="eventos-parametros.tsx" />

      <InfoBox type="tip" title="Resumen — Eventos en React">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Event delegation</strong> — React registra 1 listener en root, no en cada elemento</li>
          <li><strong>camelCase</strong>: onClick, onChange, onSubmit, onKeyDown</li>
          <li><strong>Referencia a función</strong>: <code>onClick={'{fn}'}</code> no <code>onClick={'{fn()}'}</code></li>
          <li><strong>Con argumentos</strong>: <code>onClick={'() => fn(arg)'}</code> — arrow function wrapper</li>
          <li><strong>preventDefault()</strong> en formularios para evitar recarga de página</li>
          <li><strong>Tipos TS</strong>: <code>React.MouseEvent</code>, <code>React.ChangeEvent</code>, etc.</li>
          <li><strong>SyntheticEvent</strong> normaliza comportamiento cross-browser</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Buscador interactivo: onChange, onSubmit, onKeyDown, preventDefault, parámetros en
        handlers, tipos TypeScript, y estado controlado.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/SearchBar.tsx" />
    </div>
  );
}
