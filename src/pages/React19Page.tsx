import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const useHook = `import { use } from 'react';

// ¿QUÉ ES use()?
// Un hook "especial" de React 19 que puede leer DOS cosas:
// 1. Promises → suspende el componente hasta que resuelve
// 2. Context → reemplaza useContext con más flexibilidad
//
// ¿POR QUÉ es especial?
// A diferencia de TODOS los demás hooks, use() PUEDE llamarse
// dentro de condicionales y loops. Esto es porque no mantiene
// estado propio — solo "lee" un valor externo.
//
// ¿CÓMO funciona con Promises?
// Cuando use(promise) encuentra una Promise no resuelta:
// 1. "Lanza" la promise (como throw, pero para Suspense)
// 2. React suspende el componente → muestra el fallback de Suspense
// 3. Cuando la Promise resuelve → React re-renderiza con el valor

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

const actions = `// ACTIONS en React 19: el mayor cambio para formularios
//
// ¿QUÉ PROBLEMA RESUELVEN?
// Antes de React 19, un form típico necesitaba:
// - useState para loading, error, resultado (3 estados)
// - handleSubmit con try/catch/finally
// - e.preventDefault() manual
// Con Actions, React maneja todo esto por ti.
//
// ¿CÓMO funciona <form action={fn}>?
// En HTML nativo, action es una URL. En React 19, action puede ser
// una FUNCIÓN. React intercepta el submit, llama la función con
// FormData, y maneja pending/error/success automáticamente.

import { useActionState, useOptimistic } from 'react';

// ─── useActionState ───
// Maneja estado + acción async en UN solo hook
// Retorna: [estado actual, función action para el form, isPending]

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

const useFormStatus = `// useFormStatus: leer el estado del form padre desde un hijo
//
// ¿QUÉ PROBLEMA RESUELVE?
// Antes: para deshabilitar un botón durante submit, tenías que pasar
// isPending como prop desde el componente del form hasta el botón.
// Con useFormStatus, el botón LEE el estado del form por sí solo.
//
// ¿CÓMO funciona?
// useFormStatus busca el <form> padre más cercano que use action={fn}
// y retorna: { pending, data, method, action }
// pending = true mientras la action está ejecutándose

import { useFormStatus } from 'react-dom';

function BotonSubmit() {
  // Lee automáticamente el estado del <form> padre
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
//
// ¿QUÉ PROBLEMA RESUELVE?
// forwardRef era necesario para pasar refs a componentes custom.
// Era verboso, confuso para principiantes, y complicaba los tipos.
// React 19 lo elimina: ref ahora es una prop normal como cualquier otra.
//
// ¿POR QUÉ existía forwardRef?
// React trataba ref de forma "especial" — no la pasaba como prop normal.
// forwardRef era el workaround. Ahora React simplemente la pasa.

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
//
// ¿QUÉ PROBLEMA RESUELVE?
// Antes necesitabas react-helmet o next/head para poner <title>,
// <meta>, <link> en el <head>. Ahora React 19 lo hace nativo:
// pones estos tags en CUALQUIER componente y React los mueve
// al <head> automáticamente (hoisting).
//
// ¿POR QUÉ es útil?
// Cada página puede definir su propio título y meta tags sin
// importar una librería extra. Ideal para SEO y accesibilidad.

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

const ejemploGithub = `// ============================================
// 📁 src/components/AddToCartForm.tsx
// Ejemplo COMPLETO: React 19 — useActionState + useOptimistic
// ============================================
import { useActionState, useOptimistic } from 'react';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
}

// Simula llamada al servidor
async function addToCartAction(
  prevItems: CartItem[],
  formData: FormData
): Promise<CartItem[]> {
  const nombre = formData.get('nombre') as string;
  const precio = Number(formData.get('precio'));

  // Simula latencia de red
  await new Promise(r => setTimeout(r, 1000));

  // Simula error aleatorio (10% de probabilidad)
  if (Math.random() < 0.1) throw new Error('Error de servidor');

  const nuevo: CartItem = { id: Date.now(), nombre, precio };
  return [...prevItems, nuevo];
}

export default function AddToCartForm() {
  // useActionState: maneja estado + acción async en uno
  const [items, formAction, isPending] = useActionState(addToCartAction, []);

  // useOptimistic: muestra resultado antes de que el servidor responda
  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (current: CartItem[], newItem: CartItem) => [...current, newItem]
  );

  const total = optimisticItems.reduce((s, i) => s + i.precio, 0);

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl">
      <h2 className="text-lg font-bold mb-4">🛒 Carrito (React 19)</h2>

      <form action={(formData) => {
        // Optimistic update: se muestra ANTES de que el servidor responda
        addOptimistic({
          id: Date.now(),
          nombre: formData.get('nombre') as string,
          precio: Number(formData.get('precio')),
        });
        formAction(formData);
      }} className="flex gap-2 mb-4">
        <input name="nombre" placeholder="Producto" required
          className="flex-1 px-3 py-2 border rounded" />
        <input name="precio" type="number" placeholder="$" required
          className="w-20 px-3 py-2 border rounded" />
        <button type="submit" disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
          {isPending ? '...' : '+'}
        </button>
      </form>

      <ul className="divide-y">
        {optimisticItems.map(item => (
          <li key={item.id} className="py-2 flex justify-between">
            <span>{item.nombre}</span>
            <span className="font-mono">\${item.precio}</span>
          </li>
        ))}
      </ul>

      {optimisticItems.length > 0 && (
        <div className="pt-3 mt-3 border-t flex justify-between font-bold">
          <span>Total:</span>
          <span>\${total}</span>
        </div>
      )}
    </div>
  );
}`;

export default function React19Page() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Novedades de React 19</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React 19 es la versión más grande desde los hooks. Trae <strong>Actions</strong> para
        simplificar formularios, el hook <code>use()</code> para leer Promises y Context,
        optimistic updates nativos, y simplificaciones como eliminar <code>forwardRef</code>.
        El tema central: React maneja más cosas por ti (pending states, errores, metadata).
      </p>

      <InfoBox type="angular" title="Angular vs React 19">
        <p>
          Angular ha evolucionado en paralelo: <strong>Signals</strong> (reactividad granular),
          <strong> control flow</strong> (@if, @for), <strong>deferrable views</strong> (@defer).
          React 19 se enfoca en otro eje: simplificar data mutations (Actions), eliminar
          boilerplate (forwardRef), y dar APIs más ergonómicas (use()). Ambos frameworks
          convergen en hacer más con menos código.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">use() — El hook que rompe las reglas</h2>
      <p className="text-text-muted mb-4">
        <code>use()</code> lee Promises (suspende hasta que resuelven) y Contexts. A diferencia
        de todos los demás hooks, <strong>puede usarse dentro de condicionales</strong> porque
        no mantiene estado propio — solo lee valores externos.
      </p>
      <CodeBlock code={useHook} language="tsx" filename="use-hook.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Actions — Formularios sin boilerplate</h2>
      <p className="text-text-muted mb-4">
        <code>useActionState</code> reemplaza el patrón de useState + try/catch + loading.
        <code> useOptimistic</code> actualiza la UI inmediatamente mientras espera al servidor.
        Juntos eliminan la mayoría del código repetitivo en formularios.
      </p>
      <CodeBlock code={actions} language="tsx" filename="actions.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">useFormStatus — Estado del form sin prop drilling</h2>
      <p className="text-text-muted mb-4">
        Un botón submit que se deshabilita automáticamente durante el envío, sin necesidad
        de recibir <code>isPending</code> como prop. Lee el estado del <code>{'<form>'}</code> padre.
      </p>
      <CodeBlock code={useFormStatus} language="tsx" filename="use-form-status.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">ref como prop — Adiós forwardRef</h2>
      <p className="text-text-muted mb-4">
        <code>forwardRef</code> era verboso y confuso. React 19 lo elimina: <code>ref</code>
        ahora es una prop normal que se pasa como cualquier otra.
      </p>
      <CodeBlock code={refCallback} language="tsx" filename="ref-como-prop.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Metadata del documento — Sin librerías extras</h2>
      <p className="text-text-muted mb-4">
        <code>{'<title>'}</code>, <code>{'<meta>'}</code>, <code>{'<link>'}</code> en cualquier componente.
        React los mueve al <code>{'<head>'}</code> automáticamente. Adiós react-helmet.
      </p>
      <CodeBlock code={metadataDoc} language="tsx" filename="metadata.tsx" />

      <InfoBox type="tip" title="Resumen — React 19">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>use()</strong> — leer Promises y Context, incluso en condicionales</li>
          <li><strong>useActionState</strong> — estado + acción async en UN solo hook</li>
          <li><strong>useOptimistic</strong> — UI optimista nativa (actualiza antes del servidor)</li>
          <li><strong>useFormStatus</strong> — estado del form sin prop drilling</li>
          <li><strong>ref como prop</strong> — no más forwardRef</li>
          <li><strong>Metadata nativa</strong> — title/meta/link directamente en JSX</li>
          <li><strong>Tema central</strong> — React maneja más por ti, menos boilerplate</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Carrito con React 19: useActionState para manejar el form + servidor simulado,
        useOptimistic para actualizar la UI antes de que el servidor responda.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/AddToCartForm.tsx" />
    </div>
  );
}
