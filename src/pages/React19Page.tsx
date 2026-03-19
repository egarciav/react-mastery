import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useHook = `import { use } from 'react';

// use() es un nuevo hook de React 19 que puede:
// 1. Leer el valor de una Promise (suspende hasta que resuelve)
// 2. Leer el valor de un Context (reemplaza useContext)

// ─── Leer Promises ───
async function fetchUsuario(id: number) {
  const res = await fetch(\`/api/usuarios/\${id}\`);
  return res.json();
}

function DetalleUsuario({ userPromise }: { userPromise: Promise<User> }) {
  // use() suspende el componente hasta que la promise resuelve
  const usuario = use(userPromise);
  return <h1>{usuario.nombre}</h1>;
}

// Uso con Suspense:
function Pagina({ userId }: { userId: number }) {
  const promise = fetchUsuario(userId);
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <DetalleUsuario userPromise={promise} />
    </Suspense>
  );
}

// ─── Leer Context ───
function Boton() {
  // Antes: const tema = useContext(TemaContext);
  // Ahora: también puedes usar use()
  const tema = use(TemaContext);
  return <button className={tema}>Click</button>;
}

// VENTAJA de use() sobre useContext():
// use() puede llamarse DENTRO de condicionales y loops
function ComponenteCondicional({ mostrar }: { mostrar: boolean }) {
  if (mostrar) {
    const tema = use(TemaContext); // ✅ Válido con use()
    return <p className={tema}>Visible</p>;
  }
  return null;
}`;

const actions = `// ACTIONS en React 19: simplifican formularios y mutaciones

import { useActionState, useOptimistic } from 'react';

// ─── useActionState ───
// Maneja el estado de una acción async (loading, error, resultado)

async function guardarNombre(estadoPrevio: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  // Simular llamada al servidor
  await new Promise(r => setTimeout(r, 1000));
  if (!nombre.trim()) throw new Error('Nombre vacío');
  return nombre;
}

function FormNombre() {
  const [nombre, action, isPending] = useActionState(guardarNombre, '');

  return (
    <form action={action}>
      <input name="nombre" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
      {nombre && <p>Guardado: {nombre}</p>}
    </form>
  );
}

// ─── useOptimistic ───
// Actualiza la UI inmediatamente mientras espera al servidor

function ListaMensajes({ mensajes }: { mensajes: string[] }) {
  const [optimisticMsgs, addOptimistic] = useOptimistic(
    mensajes,
    (state: string[], newMsg: string) => [...state, newMsg]
  );

  async function enviar(formData: FormData) {
    const msg = formData.get('mensaje') as string;
    addOptimistic(msg); // UI se actualiza YA
    await fetch('/api/mensajes', {
      method: 'POST',
      body: JSON.stringify({ msg }),
    });
    // Cuando el servidor responde, React reconcilia
  }

  return (
    <div>
      {optimisticMsgs.map((m, i) => <p key={i}>{m}</p>)}
      <form action={enviar}>
        <input name="mensaje" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}`;

const useFormStatus = `// useFormStatus: saber el estado del form padre
import { useFormStatus } from 'react-dom';

function BotonSubmit() {
  // Lee el estado del <form> padre más cercano
  const { pending, data, method } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar'}
    </button>
  );
}

// Uso: el botón automáticamente sabe si el form está enviando
function MiForm() {
  async function handleAction(formData: FormData) {
    await fetch('/api/submit', { method: 'POST', body: formData });
  }

  return (
    <form action={handleAction}>
      <input name="email" type="email" />
      <BotonSubmit /> {/* Se deshabilita automáticamente */}
    </form>
  );
}`;

const refCallback = `// React 19: ref como prop normal (sin forwardRef)

// ANTES (React 18): necesitabas forwardRef
const InputAntes = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />;
  }
);

// AHORA (React 19): ref es una prop como cualquier otra
function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}

// Uso: exactamente igual
function Formulario() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <Input ref={inputRef} placeholder="Escribe..." />;
}

// ¡forwardRef ya no es necesario! Mucho más simple.`;

const metadataDoc = `// React 19: Metadata del documento directamente en componentes

function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      {/* React 19 mueve estos al <head> automáticamente */}
      <title>{post.titulo} - Mi Blog</title>
      <meta name="description" content={post.resumen} />
      <link rel="canonical" href={\`/blog/\${post.slug}\`} />

      <h1>{post.titulo}</h1>
      <p>{post.contenido}</p>
    </article>
  );
}
// Ya no necesitas react-helmet ni next/head para metadata básica`;

export default function React19Page() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Novedades de React 19</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React 19 es la versión más grande desde los hooks. Trae <strong>Actions</strong>,
        el hook <code>use()</code>, optimistic updates nativos, y simplificaciones
        importantes como eliminar <code>forwardRef</code>.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">use() — El nuevo hook universal</h2>
      <p className="text-text-muted mb-4">
        <code>use()</code> puede leer Promises y Contexts. A diferencia de otros hooks,
        puede usarse dentro de condicionales.
      </p>
      <CodeBlock code={useHook} language="tsx" filename="use-hook.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Actions: useActionState y useOptimistic</h2>
      <p className="text-text-muted mb-4">
        Las Actions simplifican el manejo de formularios y mutaciones de datos con
        soporte nativo para estados pending, errores y actualizaciones optimistas.
      </p>
      <CodeBlock code={actions} language="tsx" filename="actions.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useFormStatus</h2>
      <p className="text-text-muted mb-4">
        Permite a componentes hijos leer el estado del formulario padre.
      </p>
      <CodeBlock code={useFormStatus} language="tsx" filename="use-form-status.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">ref como prop (adiós forwardRef)</h2>
      <CodeBlock code={refCallback} language="tsx" filename="ref-como-prop.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Metadata del documento</h2>
      <CodeBlock code={metadataDoc} language="tsx" filename="metadata.tsx" />

      <InfoBox type="info" title="Resumen React 19">
        <ul className="list-disc list-inside space-y-1">
          <li><code>use()</code> — leer Promises y Context, incluso en condicionales</li>
          <li><code>useActionState</code> — estado de acciones async en forms</li>
          <li><code>useOptimistic</code> — UI optimista nativa</li>
          <li><code>useFormStatus</code> — estado del form en componentes hijos</li>
          <li><strong>ref como prop</strong> — no más forwardRef</li>
          <li><strong>Metadata</strong> — title, meta, link directamente en JSX</li>
          <li><strong>Mejor Suspense</strong> — integración con data fetching</li>
        </ul>
      </InfoBox>
    </div>
  );
}
