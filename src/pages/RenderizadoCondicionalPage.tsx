import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const ternario = `function Saludo({ logueado }: { logueado: boolean }) {
  return (
    <div>
      {logueado ? <h1>Bienvenido</h1> : <h1>Inicia sesión</h1>}
    </div>
  );
}`;

const andLogico = `function Panel({ mensajes }: { mensajes: string[] }) {
  return (
    <div>
      {/* ✅ Muestra solo si hay mensajes */}
      {mensajes.length > 0 && <span>{mensajes.length} nuevos</span>}

      {/* ❌ Si length es 0, renderiza "0" en pantalla */}
      {mensajes.length && <p>Hay mensajes</p>}

      {/* ✅ Siempre compara explícitamente */}
      {mensajes.length > 0 && <p>Hay mensajes</p>}
    </div>
  );
}`;

const earlyReturn = `function ListaDatos({ cargando, error, datos }: {
  cargando: boolean;
  error: string | null;
  datos: string[] | null;
}) {
  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!datos || datos.length === 0) return <p>Sin datos.</p>;

  return (
    <ul>
      {datos.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}`;

const switchJsx = `function Panel({ rol }: { rol: 'admin' | 'editor' | 'viewer' }) {
  let contenido: React.ReactNode;
  switch (rol) {
    case 'admin':
      contenido = <div><h2>Admin</h2><button>Gestionar</button></div>;
      break;
    case 'editor':
      contenido = <div><h2>Editor</h2><button>Crear</button></div>;
      break;
    default:
      contenido = <p>Solo lectura</p>;
  }
  return <div>{contenido}</div>;
}`;

export default function RenderizadoCondicionalPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Renderizado Condicional</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        En React no hay <code>*ngIf</code>. Usas <strong>JavaScript puro</strong>:
        ternarios, &&, early returns y variables.
      </p>

      <InfoBox type="angular">
        Angular: <code>*ngIf="cond"</code> o <code>@if (cond)</code>.
        React: operadores JS directamente en JSX.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Ternario (? :)</h2>
      <p className="text-text-muted mb-4">La forma más común. Si/entonces/sino.</p>
      <CodeBlock code={ternario} language="tsx" filename="ternario.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">AND lógico (&&)</h2>
      <p className="text-text-muted mb-4">Renderiza solo si la condición es true.</p>
      <CodeBlock code={andLogico} language="tsx" filename="and-logico.tsx" />

      <InfoBox type="warning" title="Cuidado con && y 0">
        <code>0 && &lt;X /&gt;</code> renderiza "0". Usa <code>n &gt; 0 && ...</code>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Early return</h2>
      <p className="text-text-muted mb-4">Ideal para carga, errores o datos vacíos.</p>
      <CodeBlock code={earlyReturn} language="tsx" filename="early-return.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Switch con variables JSX</h2>
      <p className="text-text-muted mb-4">Para lógica compleja, guarda JSX en variables.</p>
      <CodeBlock code={switchJsx} language="tsx" filename="switch-jsx.tsx" />
    </div>
  );
}
