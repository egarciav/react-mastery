import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const jsxBasico = `// JSX parece HTML, pero en realidad es JavaScript.
// Babel/SWC lo transforma en llamadas a funciones.

// Esto que escribes:
const elemento = <h1 className="titulo">Hola Mundo</h1>;

// Se transforma internamente en:
const elemento2 = React.createElement(
  'h1',
  { className: 'titulo' },
  'Hola Mundo'
);

// Por eso JSX necesita estar dentro de un entorno
// que lo compile (como Vite, Next.js, etc.)`;

const jsxExpresiones = `function Perfil() {
  const nombre = 'María';
  const edad = 28;
  const esAdmin = true;
  const hobbies = ['React', 'TypeScript', 'Música'];

  return (
    <div>
      {/* Las llaves {} permiten insertar CUALQUIER expresión JS */}
      <h1>Hola, {nombre}</h1>
      
      {/* Expresiones matemáticas */}
      <p>Edad en meses: {edad * 12}</p>
      
      {/* Ternarios (muy usados en React) */}
      <p>Rol: {esAdmin ? 'Administrador' : 'Usuario'}</p>
      
      {/* Llamadas a métodos */}
      <p>Nombre en mayúsculas: {nombre.toUpperCase()}</p>
      
      {/* Template literals */}
      <p>{\`Bienvenida, \${nombre}. Tienes \${edad} años.\`}</p>
      
      {/* Mapear arrays (muy común en React) */}
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}`;

const jsxAtributos = `function MiComponente() {
  const urlImagen = 'https://example.com/foto.jpg';
  const estilos = { color: 'blue', fontSize: '20px', fontWeight: 'bold' };
  const claseCSS = 'contenedor principal';
  
  return (
    <div>
      {/* ⚠️ className en vez de class (porque class es palabra reservada en JS) */}
      <div className={claseCSS}>

        {/* ⚠️ htmlFor en vez de for (porque for es palabra reservada en JS) */}
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" />

        {/* Los estilos inline son objetos JS, no strings */}
        <p style={{ color: 'red', fontSize: '14px' }}>Texto rojo</p>
        
        {/* También puedes pasar una variable con estilos */}
        <p style={estilos}>Texto azul grande</p>

        {/* Atributos dinámicos */}
        <img src={urlImagen} alt="Foto de perfil" />

        {/* Atributos booleanos: si el valor es true, basta con poner el nombre */}
        <input type="text" disabled />
        <input type="text" disabled={true} />  {/* equivalente */}
        <input type="text" disabled={false} /> {/* NO disabled */}

        {/* data-* y aria-* se escriben igual que en HTML */}
        <div data-testid="mi-elemento" aria-label="Sección principal" />
      </div>
    </div>
  );
}`;

const jsxFragments = `import { Fragment } from 'react';

// ❌ ERROR: JSX debe tener UN solo elemento raíz
function Malo() {
  return (
    <h1>Título</h1>
    <p>Párrafo</p>  // Error: Adjacent JSX elements
  );
}

// ✅ Solución 1: Envolver en un div (pero agrega un nodo extra al DOM)
function ConDiv() {
  return (
    <div>
      <h1>Título</h1>
      <p>Párrafo</p>
    </div>
  );
}

// ✅ Solución 2: Fragment — NO agrega nodo extra al DOM
function ConFragment() {
  return (
    <Fragment>
      <h1>Título</h1>
      <p>Párrafo</p>
    </Fragment>
  );
}

// ✅ Solución 3: Shorthand de Fragment (la más usada)
function ConShorthand() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  );
}`;

const jsxCondicionales = `function Panel({ usuario, notificaciones }: {
  usuario: { nombre: string; esAdmin: boolean } | null;
  notificaciones: string[];
}) {
  return (
    <div>
      {/* Ternario: si/entonces/sino */}
      {usuario ? (
        <h1>Bienvenido, {usuario.nombre}</h1>
      ) : (
        <h1>Por favor inicia sesión</h1>
      )}

      {/* && (AND lógico): renderiza SOLO si la condición es true */}
      {usuario?.esAdmin && (
        <button>Panel de Administración</button>
      )}

      {/* ⚠️ CUIDADO con && y números: */}
      {/* Si notificaciones.length es 0, React renderiza "0" */}
      {notificaciones.length && <p>Tienes mensajes</p>}  {/* ❌ Puede mostrar "0" */}
      {notificaciones.length > 0 && <p>Tienes mensajes</p>}  {/* ✅ Correcto */}

      {/* Renderizado con función para lógica compleja */}
      {(() => {
        if (!usuario) return <p>Sin sesión</p>;
        if (usuario.esAdmin) return <p>Eres admin</p>;
        return <p>Eres usuario regular</p>;
      })()}
    </div>
  );
}`;

const jsxVsAngular = `// ─── Angular: usa directivas en el template ───
// <h1 *ngIf="usuario">Hola {{ usuario.nombre }}</h1>
// <div *ngFor="let item of items">{{ item }}</div>
// <p [ngClass]="{'activo': esActivo}">Texto</p>
// <button (click)="manejarClick()">Click</button>

// ─── React: usa JavaScript puro dentro de JSX ───
function Ejemplo({ usuario, items, esActivo }: Props) {
  return (
    <>
      {/* En vez de *ngIf → operador ternario o && */}
      {usuario && <h1>Hola {usuario.nombre}</h1>}

      {/* En vez de *ngFor → .map() de JavaScript */}
      {items.map(item => <div key={item}>{item}</div>)}

      {/* En vez de [ngClass] → template literal o classnames */}
      <p className={\`texto \${esActivo ? 'activo' : ''}\`}>Texto</p>

      {/* En vez de (click) → onClick (camelCase) */}
      <button onClick={() => console.log('click')}>Click</button>
    </>
  );
}`;

export default function JsxPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">JSX — JavaScript XML</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        JSX es la sintaxis que permite escribir HTML dentro de JavaScript. Es la
        base de todo en React y lo que hace que los componentes sean tan expresivos.
        No es un template engine como el de Angular — es <strong>JavaScript puro</strong> con
        azúcar sintáctica.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué es JSX realmente?</h2>
      <p className="text-text-muted mb-4">
        JSX no es HTML. Es una extensión de sintaxis de JavaScript que se ve
        como HTML pero se compila a llamadas de funciones. Cuando escribes{' '}
        <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">&lt;h1&gt;Hola&lt;/h1&gt;</code>,
        el compilador (Babel/SWC) lo transforma en{' '}
        <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">React.createElement('h1', null, 'Hola')</code>.
      </p>
      <CodeBlock code={jsxBasico} language="tsx" filename="jsx-basico.tsx" />

      <InfoBox type="angular" title="En Angular usas templates HTML separados">
        En Angular, el template HTML y la lógica TypeScript están en archivos separados
        (o en el decorador @Component). En React, <strong>todo está junto</strong> en un
        solo archivo. El JSX es tu template, y está rodeado de JavaScript puro. Esto
        permite una flexibilidad enorme porque puedes usar cualquier expresión de JS
        directamente.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Expresiones en JSX</h2>
      <p className="text-text-muted mb-4">
        Las llaves <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">{'{}'}</code> son
        la puerta de JavaScript dentro del JSX. Cualquier <strong>expresión</strong> válida
        de JavaScript puede ir dentro de llaves: variables, operaciones, llamadas a
        funciones, ternarios, etc. Lo que <strong>NO</strong> puede ir son statements
        (if/else, for, switch como declaraciones).
      </p>
      <CodeBlock code={jsxExpresiones} language="tsx" filename="expresiones-jsx.tsx" />

      <InfoBox type="info" title="Expresión vs Statement">
        Una <strong>expresión</strong> produce un valor: <code>2 + 2</code>, <code>nombre.toUpperCase()</code>, <code>x ? 'a' : 'b'</code>.
        Un <strong>statement</strong> realiza una acción: <code>if/else</code>, <code>for</code>, <code>switch</code>.
        JSX solo acepta expresiones dentro de las llaves porque necesita un valor para renderizar.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Atributos en JSX</h2>
      <p className="text-text-muted mb-4">
        Los atributos de JSX se parecen a HTML pero con algunas diferencias
        importantes. Recuerda: JSX es JavaScript, así que las palabras reservadas
        de JS (<code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">class</code>,{' '}
        <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">for</code>) se renombran.
      </p>
      <CodeBlock code={jsxAtributos} language="tsx" filename="atributos-jsx.tsx" />

      <InfoBox type="warning" title="Diferencias clave con HTML">
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><code>class</code> → <code>className</code> (porque <code>class</code> es keyword de JS)</li>
          <li><code>for</code> → <code>htmlFor</code> (porque <code>for</code> es keyword de JS)</li>
          <li><code>style</code> acepta un <strong>objeto</strong>, no un string</li>
          <li>Propiedades CSS en <strong>camelCase</strong>: <code>font-size</code> → <code>fontSize</code></li>
          <li>Eventos en <strong>camelCase</strong>: <code>onclick</code> → <code>onClick</code></li>
          <li>Todas las etiquetas deben cerrarse: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code></li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Fragments — Un solo elemento raíz</h2>
      <p className="text-text-muted mb-4">
        Cada componente de React debe retornar <strong>un solo elemento raíz</strong>.
        Los Fragments (<code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">&lt;&gt;...&lt;/&gt;</code>)
        te permiten agrupar elementos sin añadir nodos extra al DOM.
      </p>
      <CodeBlock code={jsxFragments} language="tsx" filename="fragments.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Renderizado condicional en JSX</h2>
      <p className="text-text-muted mb-4">
        En Angular usas <code className="bg-surface-lighter px-2 py-0.5 rounded text-sm">*ngIf</code>.
        En React usas JavaScript puro: operadores ternarios y lógicos.
      </p>
      <CodeBlock code={jsxCondicionales} language="tsx" filename="condicionales-jsx.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">JSX vs Templates de Angular</h2>
      <p className="text-text-muted mb-4">
        Esta es la comparación directa de cómo se expresan los mismos conceptos:
      </p>
      <CodeBlock code={jsxVsAngular} language="tsx" filename="jsx-vs-angular.tsx" />

      <InfoBox type="tip" title="¿Por qué JSX en vez de templates?">
        La ventaja principal de JSX es que <strong>es JavaScript</strong>. No necesitas
        aprender una sintaxis especial de template (*ngIf, *ngFor, pipes). Todo lo que
        sabes de JavaScript (map, filter, ternarios, destructuring) lo usas directamente.
        El autocompletado del IDE funciona perfectamente porque no es un string, es código.
      </InfoBox>
    </div>
  );
}
