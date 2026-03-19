import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const componenteBasico = `// Un componente en React es simplemente una FUNCIÓN
// que retorna JSX. Así de simple.

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

const reglas = `// ⚠️ REGLA OBLIGATORIA: Los componentes SIEMPRE empiezan con MAYÚSCULA

// ✅ Correcto — React lo trata como componente
function MiComponente() {
  return <p>Soy un componente</p>;
}

// ❌ Incorrecto — React lo trata como etiqueta HTML normal
function miComponente() {
  return <p>No soy un componente</p>;
}

// En el JSX:
<MiComponente />   // ✅ React busca la función MiComponente
<miComponente />   // ❌ React busca la etiqueta HTML <micomponente>
<div />            // ✅ Etiqueta HTML normal (minúscula)`;

const composicion = `// Los componentes se COMPONEN unos dentro de otros.
// Este es el patrón fundamental de React.

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

export default function ComponentesPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Componentes</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los componentes son el <strong>bloque fundamental</strong> de React. Todo en React
        es un componente: un botón, un formulario, una página completa, la app entera.
        Son funciones de JavaScript que retornan JSX.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Tu primer componente</h2>
      <p className="text-text-muted mb-4">
        Un componente es una función que retorna JSX. Así de simple. No necesitas
        decoradores, no necesitas clases, no necesitas registrar nada en un módulo.
      </p>
      <CodeBlock code={componenteBasico} language="tsx" filename="componente-basico.tsx" />

      <InfoBox type="angular" title="Comparación directa con Angular">
        <p>
          En Angular un componente requiere: <code>@Component</code> decorator, una clase,
          un selector, un template (o templateUrl), y registrarlo en un módulo con{' '}
          <code>declarations</code>. En React es <strong>solo una función</strong> que retorna
          JSX. No hay módulos, no hay decoradores, no hay selectores. La función ES el componente.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Regla de nomenclatura</h2>
      <p className="text-text-muted mb-4">
        React distingue entre componentes y elementos HTML por la primera letra.
        Esta regla es <strong>obligatoria</strong>.
      </p>
      <CodeBlock code={reglas} language="tsx" filename="regla-mayuscula.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Composición de componentes</h2>
      <p className="text-text-muted mb-4">
        El poder de React está en la composición: construyes componentes pequeños y
        los combinas para crear interfaces complejas. Es como armar con LEGO.
      </p>
      <CodeBlock code={composicion} language="tsx" filename="composicion.tsx" />

      <InfoBox type="tip" title="Piensa en componentes pequeños">
        Un buen componente hace <strong>una sola cosa</strong> y la hace bien. Si un
        componente crece mucho, probablemente debas dividirlo en componentes más pequeños.
        Pregúntate: ¿puedo reutilizar esta parte en otro lugar?
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Organización de archivos</h2>
      <p className="text-text-muted mb-4">
        React no impone una estructura de carpetas (a diferencia de Angular que es
        muy opinionado). La convención más usada es un componente por archivo.
      </p>
      <CodeBlock code={archivoOrganizacion} language="tsx" filename="organizacion.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Componentes con TypeScript</h2>
      <p className="text-text-muted mb-4">
        TypeScript es opcional en React pero <strong>altamente recomendado</strong>.
        Las interfaces definen el contrato de las props que un componente acepta.
      </p>
      <CodeBlock code={componenteConTypeScript} language="tsx" filename="componente-typescript.tsx" />

      <InfoBox type="info" title="¿Componentes de clase?">
        React antes usaba componentes de clase (<code>class MyComponent extends React.Component</code>).
        En 2026 esto es <strong>código legacy</strong>. Los componentes funcionales con hooks
        reemplazaron completamente a los de clase. No necesitas aprenderlos a menos que
        mantengas código antiguo.
      </InfoBox>
    </div>
  );
}
