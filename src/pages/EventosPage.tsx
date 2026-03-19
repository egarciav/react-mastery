import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const eventosBasicos = `// Los eventos en React usan camelCase y reciben funciones, no strings.

function Botones() {
  // Función manejadora definida aparte
  const handleClick = () => {
    console.log('¡Botón clickeado!');
  };

  // Función con el evento como parámetro
  const handleClickConEvento = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Tipo:', e.type);           // "click"
    console.log('Target:', e.currentTarget); // el botón
    e.preventDefault();  // prevenir comportamiento por defecto
    e.stopPropagation(); // evitar propagación (bubbling)
  };

  return (
    <div>
      {/* ✅ Pasar la REFERENCIA a la función (sin paréntesis) */}
      <button onClick={handleClick}>Click me</button>

      {/* ✅ Función inline (arrow function) */}
      <button onClick={() => console.log('inline click')}>
        Inline
      </button>

      {/* ❌ ERROR COMÚN: esto EJECUTA la función inmediatamente */}
      {/* <button onClick={handleClick()}>No hagas esto</button> */}

      {/* ✅ Si necesitas pasar argumentos, usa arrow function */}
      <button onClick={() => handleClickConEvento}>Con evento</button>
    </div>
  );
}`;

const tiposEventos = `// Tipos de eventos más comunes en React

function FormularioEventos() {
  // onChange — cada vez que cambia el valor
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Nuevo valor:', e.target.value);
  };

  // onSubmit — al enviar el formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ⚠️ SIEMPRE prevenir el submit por defecto
    console.log('Formulario enviado');
  };

  // onKeyDown — al presionar una tecla
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter presionado');
    }
  };

  // onFocus / onBlur — foco entra/sale
  const handleFocus = () => console.log('Input enfocado');
  const handleBlur = () => console.log('Input perdió foco');

  // onMouseEnter / onMouseLeave — hover
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
}`;

const eventosConParametros = `// Pasar parámetros adicionales a un manejador de eventos

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

  // Función que recibe datos ADEMÁS del evento
  const handleComprar = (producto: Producto) => {
    console.log(\`Comprando: \${producto.nombre} - $\${producto.precio}\`);
  };

  const handleEliminar = (id: number, nombre: string) => {
    console.log(\`Eliminando \${nombre} (id: \${id})\`);
  };

  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>
          {p.nombre} - \${p.precio}
          {/* Arrow function para pasar argumentos */}
          <button onClick={() => handleComprar(p)}>Comprar</button>
          <button onClick={() => handleEliminar(p.id, p.nombre)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}`;

export default function EventosPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Eventos</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React maneja eventos de forma similar al DOM nativo pero con diferencias
        importantes: nombres en <strong>camelCase</strong>, se pasan <strong>funciones</strong> (no
        strings), y los eventos son <strong>SyntheticEvents</strong> (wrappers cross-browser).
      </p>

      <InfoBox type="angular" title="Eventos: Angular vs React">
        Angular: <code>(click)="handleClick()"</code> con paréntesis y string.
        React: <code>onClick=&#123;handleClick&#125;</code> con camelCase y referencia a función.
        Angular usa <code>$event</code> para acceder al evento. React lo pasa como primer argumento automáticamente.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Eventos básicos</h2>
      <CodeBlock code={eventosBasicos} language="tsx" filename="eventos-basicos.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tipos de eventos comunes</h2>
      <p className="text-text-muted mb-4">
        React provee tipos TypeScript para cada tipo de evento. Los más usados:
      </p>
      <CodeBlock code={tiposEventos} language="tsx" filename="tipos-eventos.tsx" />

      <InfoBox type="info" title="Synthetic Events">
        React envuelve los eventos nativos del DOM en <code>SyntheticEvent</code>.
        Esto normaliza el comportamiento entre navegadores. Tienen la misma interfaz
        que los eventos nativos (<code>preventDefault</code>, <code>stopPropagation</code>, etc.)
        pero funcionan idénticos en todos los navegadores.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Eventos con parámetros</h2>
      <p className="text-text-muted mb-4">
        Para pasar argumentos extra a un manejador, envuelve la llamada en una
        arrow function.
      </p>
      <CodeBlock code={eventosConParametros} language="tsx" filename="eventos-parametros.tsx" />

      <InfoBox type="tip" title="Resumen de eventos">
        <ul className="list-disc list-inside space-y-1">
          <li>Nombres en <strong>camelCase</strong>: onClick, onChange, onSubmit</li>
          <li>Pasa <strong>referencia</strong> a función, no la ejecutes: <code>onClick=&#123;fn&#125;</code></li>
          <li>Para argumentos: <code>onClick=&#123;() =&gt; fn(arg)&#125;</code></li>
          <li>Usa <code>e.preventDefault()</code> en formularios</li>
          <li>TypeScript: <code>React.MouseEvent</code>, <code>React.ChangeEvent</code>, etc.</li>
        </ul>
      </InfoBox>
    </div>
  );
}
