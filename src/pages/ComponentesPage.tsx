import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const componenteBasico = `// ¿QUÉ ES un componente en React?
// Una FUNCIÓN de JavaScript que retorna JSX. Eso es todo.
// No hay decoradores, no hay clases, no hay módulos donde registrar.
//
// ¿CÓMO funciona?
// React llama a tu función → recibe el JSX retornado → lo convierte
// en objetos (Virtual DOM) → actualiza el DOM real donde sea necesario.
// Cada vez que el estado cambia, React VUELVE a llamar tu función.
//
// ¿POR QUÉ funciones?
// - Son simples y predecibles (mismos inputs → mismo output)
// - Se componen fácilmente (función dentro de función)
// - Los hooks les dan todo el poder que antes solo tenían las clases

// ✅ Componente funcional (la forma moderna y recomendada)
function Saludo() {
  return <h1>¡Hola Mundo!</h1>;
}

// ✅ También puedes usar arrow functions
const SaludoArrow = () => {
  return <h1>¡Hola Mundo!</h1>;
};

// ✅ Con return implícito (cuando es una sola expresión)
const SaludoCorto = () => <h1>¡Hola Mundo!</h1>;

// Para usarlo, lo invocas como si fuera una etiqueta HTML:
function App() {
  return (
    <div>
      <Saludo />
      <SaludoArrow />
      <SaludoCorto />
    </div>
  );
}`;

const reglas = `// ⚠️ REGLA OBLIGATORIA: Componentes empiezan con MAYÚSCULA
//
// ¿POR QUÉ esta regla?
// El compilador JSX necesita distinguir entre:
// - Elementos HTML nativos: <div>, <p>, <span> → strings en createElement
// - Componentes custom: <MiComponente /> → referencia a función
//
// La convención: minúscula = HTML, Mayúscula = componente.
// Si usas minúscula para un componente, React lo ignora silenciosamente
// y busca un tag HTML que no existe.

// ✅ Correcto — React lo trata como componente (llama la función)
function MiComponente() {
  return <p>Soy un componente</p>;
}

// ❌ Incorrecto — React busca el tag HTML <micomponente> (no existe)
function miComponente() {
  return <p>Nunca se renderiza</p>;
}

// En el JSX:
<MiComponente />   // ✅ createElement(MiComponente) → llama la función
<miComponente />   // ❌ createElement('micomponente') → tag HTML inválido
<div />            // ✅ createElement('div') → tag HTML normal`;

const composicion = `// COMPOSICIÓN: el patrón fundamental de React
//
// ¿CÓMO funciona?
// Componentes pequeños se ANIDAN dentro de otros para crear UIs complejas.
// Cada componente tiene UNA responsabilidad (Boton, Encabezado, Footer).
// El componente App los COMPONE como piezas de LEGO.
//
// ¿POR QUÉ composición?
// - Reutilización: Boton se usa en múltiples lugares
// - Mantenimiento: cambiar Boton lo cambia en TODAS partes
// - Testing: cada pieza se prueba por separado
// - Lectura: App muestra la ESTRUCTURA, no los detalles

function Boton({ texto }: { texto: string }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      {texto}
    </button>
  );
}

function Encabezado() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>Mi App</h1>
      <nav>
        <Boton texto="Inicio" />
        <Boton texto="Acerca de" />
        <Boton texto="Contacto" />
      </nav>
    </header>
  );
}

function ContenidoPrincipal() {
  return (
    <main className="p-8">
      <h2>Bienvenido</h2>
      <p>Este es el contenido principal.</p>
    </main>
  );
}

function PieDePagina() {
  return (
    <footer className="p-4 text-center text-gray-500">
      <p>© 2026 Mi App</p>
    </footer>
  );
}

// El componente principal COMPONE todos los demás
function App() {
  return (
    <div>
      <Encabezado />
      <ContenidoPrincipal />
      <PieDePagina />
    </div>
  );
}`;

const archivoOrganizacion = `// 📁 Estructura de archivos recomendada:
//
// src/
// ├── components/          ← Componentes reutilizables
// │   ├── Button.tsx
// │   ├── Card.tsx
// │   └── Header.tsx
// ├── pages/               ← Páginas/vistas completas
// │   ├── HomePage.tsx
// │   └── AboutPage.tsx
// ├── hooks/               ← Custom hooks
// │   └── useAuth.ts
// ├── App.tsx              ← Componente raíz
// └── main.tsx             ← Punto de entrada

// ─── Un componente por archivo (convención estándar) ───

// Button.tsx
export default function Button({ texto }: { texto: string }) {
  return <button>{texto}</button>;
}

// Header.tsx
import Button from './Button';

export default function Header() {
  return (
    <header>
      <Button texto="Click" />
    </header>
  );
}

// Importas y usas donde lo necesites:
import Header from './components/Header';`;

const componenteConTypeScript = `// TypeScript con componentes React — Tipado completo
//
// ¿POR QUÉ TypeScript en React?
// - Props tipadas: si olvidas una prop obligatoria → error de compilación
// - Autocompletado: el IDE te muestra qué props acepta cada componente
// - Refactoring seguro: cambiar una interfaz muestra TODOS los usos afectados
// - Documentación viva: la interfaz ES la documentación de las props

// Definir la interfaz de props (recomendado)
interface TarjetaUsuarioProps {
  nombre: string;
  email: string;
  edad: number;
  avatar?: string;        // ? = prop opcional
  esAdmin?: boolean;      // ? = prop opcional
  onClickPerfil: () => void;  // función como prop
}

// El componente recibe las props tipadas
function TarjetaUsuario({
  nombre,
  email,
  edad,
  avatar = '/default-avatar.png',  // valor por defecto
  esAdmin = false,                  // valor por defecto
  onClickPerfil,
}: TarjetaUsuarioProps) {
  return (
    <div className="card" onClick={onClickPerfil}>
      <img src={avatar} alt={nombre} />
      <h2>{nombre} {esAdmin && '⭐'}</h2>
      <p>{email}</p>
      <p>Edad: {edad}</p>
    </div>
  );
}

// Uso del componente (TypeScript valida las props)
function App() {
  return (
    <TarjetaUsuario
      nombre="María"
      email="maria@example.com"
      edad={28}
      esAdmin={true}
      onClickPerfil={() => console.log('Ver perfil')}
    />
    // Si olvidas una prop obligatoria, TypeScript da error ✅
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/ProductCard.tsx
// Ejemplo COMPLETO: composición de componentes
// ============================================
import { useState } from 'react';

interface ProductCardProps {
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  enStock: boolean;
  onAgregar: (nombre: string) => void;
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={\`px-2 py-1 text-xs font-bold rounded \${color}\`}>
      {children}
    </span>
  );
}

function PrecioDisplay({ precio }: { precio: number }) {
  const formateado = new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN',
  }).format(precio);
  return <p className="text-2xl font-bold text-green-600">{formateado}</p>;
}

export default function ProductCard({
  nombre, precio, imagen, descripcion, enStock, onAgregar,
}: ProductCardProps) {
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="border rounded-xl overflow-hidden shadow-md">
      <img src={imagen} alt={nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{nombre}</h3>
          <Badge color={enStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
            {enStock ? 'En stock' : 'Agotado'}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm mt-1">{descripcion}</p>
        <PrecioDisplay precio={precio * cantidad} />
        <div className="flex items-center gap-3 mt-3">
          <button onClick={() => setCantidad(c => Math.max(1, c - 1))}
            className="px-3 py-1 border rounded">−</button>
          <span className="font-bold">{cantidad}</span>
          <button onClick={() => setCantidad(c => c + 1)}
            className="px-3 py-1 border rounded">+</button>
          <button onClick={() => onAgregar(nombre)} disabled={!enStock}
            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

// 📁 src/App.tsx
// import ProductCard from './components/ProductCard';
// function App() {
//   return (
//     <ProductCard
//       nombre="MacBook Pro" precio={29999} enStock={true}
//       imagen="/macbook.jpg" descripcion="Laptop Apple M3"
//       onAgregar={(name) => alert(\`Agregado: \${name}\`)}
//     />
//   );
// }`;

export default function ComponentesPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Componentes</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los componentes son el <strong>bloque fundamental</strong> de React. Todo en React
        es un componente: un botón, un formulario, una página completa, la app entera.
        Son funciones de JavaScript que retornan JSX. React las llama, recibe el JSX,
        y actualiza el DOM. Cada vez que el estado cambia, React vuelve a llamar la función.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Tu primer componente — Solo una función</h2>
      <p className="text-text-muted mb-4">
        Un componente es una función que retorna JSX. No necesitas decoradores, clases,
        ni registrar nada en un módulo. La función <strong>es</strong> el componente.
      </p>
      <CodeBlock code={componenteBasico} language="tsx" filename="componente-basico.tsx" />

      <InfoBox type="angular" title="Angular @Component vs React función">
        <p>
          En Angular un componente requiere: <code>@Component</code> decorator, una clase,
          un selector, un template, estilos, y registrarlo en un módulo o hacerlo standalone.
          En React es <strong>solo una función</strong> que retorna JSX. No hay módulos, no
          hay decoradores, no hay selectores, no hay ngOnInit. La simplicidad es intencional:
          menos boilerplate = más tiempo construyendo features.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Regla de nomenclatura — Por qué Mayúscula</h2>
      <p className="text-text-muted mb-4">
        El compilador JSX distingue componentes de HTML por la primera letra: minúscula =
        tag HTML, Mayúscula = componente. Esta regla es <strong>obligatoria</strong> — si
        usas minúscula, React busca un tag HTML que no existe.
      </p>
      <CodeBlock code={reglas} language="tsx" filename="regla-mayuscula.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Composición — Construir con piezas</h2>
      <p className="text-text-muted mb-4">
        El poder de React: componentes pequeños (una responsabilidad) que se combinan
        para crear UIs complejas. Cada pieza es reutilizable, testeable, y mantenible.
      </p>
      <CodeBlock code={composicion} language="tsx" filename="composicion.tsx" />

      <InfoBox type="tip" title="¿Cuándo dividir un componente?">
        Un buen componente hace <strong>una sola cosa</strong>. Señales de que debes dividir:
        el archivo tiene más de ~150 líneas, el componente acepta muchas props, o puedes
        identificar partes que se reutilizarían en otro lugar.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Organización de archivos</h2>
      <p className="text-text-muted mb-4">
        React no impone estructura de carpetas (Angular es muy opinionado con su CLI).
        La convención: un componente por archivo, <code>components/</code> para reutilizables,
        <code> pages/</code> para vistas, <code>hooks/</code> para custom hooks.
      </p>
      <CodeBlock code={archivoOrganizacion} language="tsx" filename="organizacion.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Componentes con TypeScript — Props tipadas</h2>
      <p className="text-text-muted mb-4">
        TypeScript es opcional pero <strong>altamente recomendado</strong>. Las interfaces
        definen el contrato de props: si olvidas una obligatoria, TypeScript da error en
        compilación. El IDE te da autocompletado de todas las props disponibles.
      </p>
      <CodeBlock code={componenteConTypeScript} language="tsx" filename="componente-typescript.tsx" />

      <InfoBox type="info" title="¿Componentes de clase? → Legacy">
        React antes usaba <code>class MyComponent extends React.Component</code>. En 2026
        es <strong>código legacy</strong>. Los componentes funcionales con hooks los
        reemplazaron completamente. Solo necesitas aprenderlos si mantienes código antiguo.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Componentes">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Función → JSX</strong>: un componente es solo una función</li>
          <li><strong>Mayúscula obligatoria</strong>: React distingue componentes de HTML</li>
          <li><strong>Composición</strong>: piezas pequeñas combinadas en UIs complejas</li>
          <li><strong>Un archivo por componente</strong>: convención estándar</li>
          <li><strong>TypeScript</strong>: interfaces para props = documentación + seguridad</li>
          <li><strong>No clases</strong>: funciones + hooks es el estándar moderno</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        ProductCard con composición: sub-componentes Badge y PrecioDisplay, props tipadas,
        estado local, y comunicación hijo → padre con <code>onAgregar</code>.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/ProductCard.tsx" />
    </div>
  );
}
