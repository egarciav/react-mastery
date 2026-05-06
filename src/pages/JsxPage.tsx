import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const jsxBasico = `// ¿QUÉ ES JSX?
// JSX = JavaScript XML. Parece HTML, pero es JavaScript.
// Un compilador (Babel/SWC) lo transforma en llamadas a funciones.
//
// ¿POR QUÉ existe JSX?
// Antes de JSX, escribías: React.createElement('h1', null, 'Hola')
// Para cada elemento. Imagina un formulario con 20 elementos...
// JSX hace que escribir UI sea tan natural como escribir HTML,
// pero con TODO el poder de JavaScript disponible via {llaves}.
//
// ¿CÓMO funciona la transformación?
// Tu código JSX → compilador (Babel/SWC) → createElement calls → objetos JS

// Esto que escribes:
const elemento = <h1 className="titulo">Hola Mundo</h1>;

// El compilador lo transforma en:
const elemento2 = React.createElement(
  'h1',                        // tipo de elemento
  { className: 'titulo' },    // props (atributos)
  'Hola Mundo'                 // children (contenido)
);

// Ambos producen el mismo objeto:
// { type: 'h1', props: { className: 'titulo', children: 'Hola Mundo' } }
// React usa este objeto para actualizar el DOM real.

// Por eso JSX necesita un compilador: Vite, Next.js, CRA.
// Sin compilador, JSX es sintaxis inválida de JavaScript.`;

const jsxExpresiones = `// EXPRESIONES en JSX: las llaves {} son tu puerta a JavaScript
//
// ¿CÓMO funcionan las llaves?
// Todo lo que va dentro de {} se evalúa como JavaScript.
// El RESULTADO se inserta en el JSX. Debe ser una EXPRESIÓN
// (produce un valor), no un statement (if, for, switch).
//
// ¿QUÉ puede ir dentro de {}?
// ✅ Variables, operaciones, ternarios, llamadas a funciones, .map()
// ❌ if/else, for, while, switch (son statements, no producen valor)
//    Workaround: usa ternarios, &&, o IIFEs para lógica compleja.

function Perfil() {
  const nombre = 'María';
  const edad = 28;
  const esAdmin = true;
  const hobbies = ['React', 'TypeScript', 'Música'];

  return (
    <div>
      {/* Las llaves {} evalúan CUALQUIER expresión JS */}
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

// ¿POR QUÉ un solo elemento raíz?
// Una función JS solo puede retornar UN valor. JSX se compila a
// createElement() → un solo objeto. Dos elementos raíz = dos retornos
// = error de sintaxis. Fragment resuelve esto: agrupa SIN agregar DOM.

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

const jsxVsAngular = `// ANGULAR TEMPLATES vs REACT JSX — comparación directa
//
// ¿CUÁL es la diferencia fundamental?
// Angular: inventa una sintaxis propia para el template (*ngIf, *ngFor,
//   pipes, [binding], (event)). Debes aprender esta sintaxis especial.
// React: usa JavaScript puro (if/ternario, .map(), variables, funciones).
//   Si sabes JS, sabes JSX. No hay sintaxis extra que aprender.
//
// Angular 17+ ahora tiene @if/@for que se acercan más a JSX,
// pero siguen siendo sintaxis del template, no JavaScript.

// ─── Angular: directivas especiales en el template ───
// <h1 *ngIf="usuario">Hola {{ usuario.nombre }}</h1>
// <div *ngFor="let item of items">{{ item }}</div>
// <p [ngClass]="{'activo': esActivo}">Texto</p>
// <button (click)="manejarClick()">Click</button>

// ─── React: JavaScript puro dentro de JSX ───
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

const ejemploGithub = `// ============================================
// 📁 Archivo: src/components/UserProfile.tsx
// Ejemplo COMPLETO para copiar a tu proyecto
// ============================================
import { useState } from 'react';

interface User {
  nombre: string;
  edad: number;
  email: string;
  esAdmin: boolean;
  hobbies: string[];
  avatar?: string;
}

export default function UserProfile({ user }: { user: User }) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Estado derivado (no necesita useState)
  const esAdulto = user.edad >= 18;
  const hobbiesTexto = user.hobbies.join(', ');

  return (
    <>
      {/*Fragment: agrupa sin nodo DOM extra */}
      <div
        className={\`p-6 rounded-xl border \${
          user.esAdmin ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
        }\`}
      >
        {/* Expresiones en JSX */}
        <div className="flex items-center gap-4">
          <img
            src={user.avatar ?? '/default-avatar.png'}
            alt={\`Avatar de \${user.nombre}\`}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">
              {user.nombre} {user.esAdmin && '⭐'}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Condicional con ternario */}
        <p className="mt-3">
          {esAdulto ? '✅ Mayor de edad' : '⚠️ Menor de edad'} — {user.edad} años
        </p>

        {/* Renderizado condicional con && */}
        {user.hobbies.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold">Hobbies:</p>
            <ul className="list-disc list-inside">
              {user.hobbies.map((hobby) => (
                <li key={hobby}>{hobby}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Evento + estado */}
        <button
          onClick={() => setMostrarDetalles(!mostrarDetalles)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {mostrarDetalles ? 'Ocultar' : 'Ver'} detalles
        </button>

        {mostrarDetalles && (
          <pre className="mt-3 p-3 bg-gray-100 rounded text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}
      </div>
    </>
  );
}

// ============================================
// 📁 Archivo: src/App.tsx (uso del componente)
// ============================================
// import UserProfile from './components/UserProfile';
//
// function App() {
//   return (
//     <UserProfile
//       user={{
//         nombre: 'María',
//         edad: 28,
//         email: 'maria@example.com',
//         esAdmin: true,
//         hobbies: ['React', 'TypeScript', 'Música'],
//       }}
//     />
//   );
// }`;

export default function JsxPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">JSX — JavaScript XML</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        JSX es la sintaxis que permite escribir HTML dentro de JavaScript. Parece un
        template engine, pero <strong>es JavaScript puro</strong> con azúcar sintáctica.
        Un compilador (Babel/SWC) transforma cada tag JSX en una llamada a función.
        Si sabes JavaScript, ya sabes JSX — no hay sintaxis nueva que aprender.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué es JSX realmente? — La transformación</h2>
      <p className="text-text-muted mb-4">
        JSX no es HTML ni un template. Es una extensión de sintaxis que el compilador
        transforma en objetos JavaScript. <code>{'<h1>Hola</h1>'}</code> se convierte en
        <code> React.createElement('h1', null, 'Hola')</code>, que produce un objeto plano
        que React usa para actualizar el DOM.
      </p>
      <CodeBlock code={jsxBasico} language="tsx" filename="jsx-basico.tsx" />

      <InfoBox type="angular" title="Angular templates separados vs React JSX integrado">
        <p>
          En Angular, template HTML y lógica TypeScript están <strong>separados</strong>
          (archivo .html + .ts, o template en @Component). En React, <strong>todo está
          junto</strong> en un solo archivo .tsx. El JSX ES tu template, rodeado de JS puro.
          Ventaja: el IDE da autocompletado completo porque no es un string — es código.
          Angular 17+ se acerca con inline templates, pero siguen siendo strings.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Expresiones en JSX — Las llaves {'{}'}</h2>
      <p className="text-text-muted mb-4">
        Las llaves <code>{'{}'}</code> son tu puerta de JavaScript dentro del JSX.
        Cualquier <strong>expresión</strong> (produce un valor) puede ir dentro: variables,
        operaciones, ternarios, .map(). Lo que NO puede ir son <strong>statements</strong>
        (if/else, for, switch) porque no producen un valor.
      </p>
      <CodeBlock code={jsxExpresiones} language="tsx" filename="expresiones-jsx.tsx" />

      <InfoBox type="info" title="Expresión vs Statement — ¿Por qué importa?">
        Una <strong>expresión</strong> produce un valor: <code>2 + 2</code>, <code>nombre.toUpperCase()</code>, <code>x ? 'a' : 'b'</code>.
        Un <strong>statement</strong> realiza una acción: <code>if/else</code>, <code>for</code>, <code>switch</code>.
        JSX necesita un <strong>valor</strong> para insertar en el DOM, por eso solo acepta expresiones.
        Workaround: usa ternarios para if/else, .map() para for, o IIFEs para lógica compleja.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Atributos JSX — Diferencias con HTML</h2>
      <p className="text-text-muted mb-4">
        JSX es JavaScript, así que las palabras reservadas de JS (<code>class</code>,
        <code> for</code>) se renombran. Los estilos inline son objetos JS, no strings.
        Las propiedades CSS usan camelCase. Todo esto es porque JSX se compila a objetos JS.
      </p>
      <CodeBlock code={jsxAtributos} language="tsx" filename="atributos-jsx.tsx" />

      <InfoBox type="warning" title="Diferencias clave JSX vs HTML">
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><code>class</code> → <code>className</code> (class es keyword de JS)</li>
          <li><code>for</code> → <code>htmlFor</code> (for es keyword de JS)</li>
          <li><code>style</code> acepta un <strong>objeto</strong>, no un string</li>
          <li>CSS en <strong>camelCase</strong>: <code>font-size</code> → <code>fontSize</code></li>
          <li>Eventos en <strong>camelCase</strong>: <code>onclick</code> → <code>onClick</code></li>
          <li>Todas las etiquetas <strong>deben cerrarse</strong>: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code></li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Fragments — Un solo elemento raíz</h2>
      <p className="text-text-muted mb-4">
        Una función JS solo retorna UN valor → JSX debe tener UN elemento raíz.
        Los Fragments (<code>{'<>...</>'}</code>) agrupan elementos sin agregar nodos al DOM.
        Usa <code>{'<Fragment key={id}>'}</code> cuando necesites key (ej: en .map()).
      </p>
      <CodeBlock code={jsxFragments} language="tsx" filename="fragments.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Renderizado condicional — JS puro</h2>
      <p className="text-text-muted mb-4">
        En Angular usas <code>*ngIf</code> o <code>@if</code>. En React usas JavaScript puro:
        ternarios (<code>a ? b : c</code>), AND lógico (<code>{'a && <B />'}</code>), o IIFEs
        para lógica compleja. Cuidado: <code>0 {'&&'} {'<p>...'}</code> renderiza "0".
      </p>
      <CodeBlock code={jsxCondicionales} language="tsx" filename="condicionales-jsx.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">JSX vs Templates Angular — Comparación directa</h2>
      <p className="text-text-muted mb-4">
        Mismos conceptos, diferente filosofía: Angular inventa directivas especiales;
        React usa JavaScript que ya conoces.
      </p>
      <CodeBlock code={jsxVsAngular} language="tsx" filename="jsx-vs-angular.tsx" />

      <InfoBox type="tip" title="Resumen — JSX">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>JSX = JS + XML</strong>: se compila a createElement → objetos</li>
          <li><strong>{'{}'} llaves</strong>: insertan expresiones JS (no statements)</li>
          <li><strong>className, htmlFor</strong>: evitan conflicto con keywords de JS</li>
          <li><strong>style = objeto</strong>: propiedades CSS en camelCase</li>
          <li><strong>{'<>Fragment</>'}</strong>: agrupa sin nodo DOM extra</li>
          <li><strong>Condicionales</strong>: ternarios y && (cuidado con 0 &&)</li>
          <li><strong>vs Angular</strong>: JS puro en vez de directivas especiales</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Copia este componente completo a tu proyecto. Usa todos los conceptos de JSX
        vistos arriba: expresiones, condicionales, Fragments, map, estilos dinámicos y eventos.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/UserProfile.tsx" />
    </div>
  );
}
