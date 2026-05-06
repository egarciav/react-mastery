import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const ternario = `// El operador ternario es la forma más directa de decir:
// "si esta condición es verdadera, renderiza ESTO; si no, renderiza AQUELLO"
//
// ¿CÓMO FUNCIONA?
// condición ? valorSiTrue : valorSiFalse
// React evalúa la condición, y el resultado (JSX) se inserta en el árbol.
// Es una EXPRESIÓN (produce un valor), por eso funciona dentro de llaves {}.

function Saludo({ logueado }: { logueado: boolean }) {
  return (
    <div>
      {/* React evalúa 'logueado':
          - si es true  → renderiza <h1>Bienvenido</h1>
          - si es false → renderiza <h1>Inicia sesión</h1> */}
      {logueado ? <h1>Bienvenido</h1> : <h1>Inicia sesión</h1>}
    </div>
  );
}

// ¿POR QUÉ ternarios y no if/else?
// Porque if/else es un STATEMENT (ejecuta una acción, no produce un valor).
// JSX necesita EXPRESIONES dentro de las llaves {} porque necesita
// algo que produzca un valor para renderizar.

// ❌ Esto NO funciona — if/else no produce un valor
function SaludoMalo({ logueado }: { logueado: boolean }) {
  return (
    <div>
      {/* Error: if es un statement, no una expresión */}
      {/* if (logueado) { <h1>Hola</h1> } else { <h1>Login</h1> } */}
    </div>
  );
}

// ✅ Puedes usar ternarios anidados (pero no abuses — es difícil de leer)
function Mensaje({ tipo }: { tipo: 'exito' | 'error' | 'info' }) {
  return (
    <p>
      {tipo === 'exito'
        ? '✅ Operación exitosa'
        : tipo === 'error'
          ? '❌ Ocurrió un error'
          : 'ℹ️ Información'}
    </p>
  );
  // Si tienes más de 2 niveles de ternarios, usa switch o un objeto map
}`;

const andLogico = `// El operador && (AND lógico) renderiza algo SOLO si la condición es true.
// Si es false, React no renderiza nada.
//
// ¿CÓMO FUNCIONA INTERNAMENTE?
// JavaScript evalúa && de izquierda a derecha:
// - Si el lado izquierdo es FALSY → retorna el lado izquierdo (no evalúa el derecho)
// - Si el lado izquierdo es TRUTHY → retorna el lado derecho
//
// React sabe qué hacer con cada valor:
// - false, null, undefined, true → React NO renderiza nada
// - 0, NaN → React SÍ renderiza "0" o "NaN" (¡cuidado!)
// - JSX, strings, números → React los renderiza normalmente

function Panel({ mensajes, esAdmin }: {
  mensajes: string[];
  esAdmin: boolean;
}) {
  return (
    <div>
      {/* ✅ esAdmin es boolean → si es false, React ignora el false */}
      {esAdmin && <button>Panel de Admin</button>}

      {/* ✅ Comparación explícita → resultado es true/false */}
      {mensajes.length > 0 && <span>{mensajes.length} nuevos</span>}

      {/* ❌ PELIGRO: mensajes.length es un NÚMERO.
          Si es 0, && retorna 0, y React renderiza "0" en pantalla */}
      {mensajes.length && <p>Hay mensajes</p>}
      {/* ↑ Cuando mensajes = [] → mensajes.length = 0 → renderiza "0" */}

      {/* ✅ SOLUCIÓN: convierte a boolean con comparación o doble negación */}
      {mensajes.length > 0 && <p>Hay mensajes</p>}
      {!!mensajes.length && <p>Hay mensajes</p>}  {/* !! convierte a boolean */}
    </div>
  );
}

// ¿POR QUÉ React renderiza 0 pero no false?
// React tiene una lista de valores "falsy especiales" que ignora:
// false, null, undefined, true → NO se renderizan (invisibles)
// 0, NaN, "" → SÍ se renderizan (son valores válidos para mostrar)
// Esto es por diseño: 0 y "" pueden ser texto legítimo que quieres mostrar.`;

const earlyReturn = `// EARLY RETURN: retorna temprano antes de llegar al JSX principal.
// Es el patrón más limpio para manejar estados de carga, error, o datos vacíos.
//
// ¿CÓMO FUNCIONA?
// Un componente React es una función. Si haces return antes del JSX principal,
// React renderiza lo que retornaste y NUNCA ejecuta el código de abajo.
//
// ¿POR QUÉ es mejor que ternarios anidados?
// Porque cada condición se maneja de forma aislada y se lee de arriba a abajo.
// No hay indentación profunda ni ternarios encadenados difíciles de seguir.

function ListaDatos({ cargando, error, datos }: {
  cargando: boolean;
  error: string | null;
  datos: string[] | null;
}) {
  // Primero: estado de carga → retorna spinner
  if (cargando) return <div className="spinner">Cargando...</div>;

  // Segundo: si hubo error → retorna mensaje de error
  if (error) return <div className="error">Error: {error}</div>;

  // Tercero: si no hay datos → retorna estado vacío
  if (!datos || datos.length === 0) return <p>No hay datos disponibles.</p>;

  // Si llegamos aquí, SABEMOS que:
  // - No está cargando ✅
  // - No hay error ✅
  // - datos existe y tiene elementos ✅
  // TypeScript también lo sabe: 'datos' aquí es string[] (no null)
  return (
    <ul>
      {datos.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

// ¿POR QUÉ este patrón es tan popular en React?
// 1. Es LEGIBLE: cada caso se lee como una regla independiente
// 2. Es SEGURO: TypeScript infiere tipos más precisos después de cada check
// 3. Es ESCALABLE: agregar un nuevo caso es solo agregar un if más
// 4. No hay anidación: el "happy path" (caso normal) está al final, limpio`;

const switchJsx = `// SWITCH o OBJETO MAP: para cuando tienes más de 2-3 casos.
// Guardar JSX en una variable y luego renderizarla.
//
// ¿CÓMO FUNCIONA?
// Declaras una variable FUERA del return, le asignas JSX con un switch,
// y luego la usas dentro del JSX. Recuerda: JSX es un valor que puedes
// guardar en variables como cualquier otro dato de JavaScript.

// ─── Opción 1: switch ───
function PanelConSwitch({ rol }: { rol: 'admin' | 'editor' | 'viewer' }) {
  let contenido: React.ReactNode;

  switch (rol) {
    case 'admin':
      contenido = (
        <div>
          <h2>Panel de Administración</h2>
          <button>Gestionar usuarios</button>
          <button>Ver métricas</button>
        </div>
      );
      break;
    case 'editor':
      contenido = (
        <div>
          <h2>Editor de Contenido</h2>
          <button>Crear artículo</button>
        </div>
      );
      break;
    default:
      contenido = <p>Solo tienes acceso de lectura.</p>;
  }

  return <div className="panel">{contenido}</div>;
}

// ─── Opción 2: objeto map (más elegante para casos simples) ───
// ¿POR QUÉ un objeto map? Porque es más declarativo y escalable.
// Agregar un nuevo caso es agregar una línea, no un bloque switch completo.

function PanelConMap({ rol }: { rol: 'admin' | 'editor' | 'viewer' }) {
  const paneles: Record<string, React.ReactNode> = {
    admin: <div><h2>Admin</h2><button>Gestionar</button></div>,
    editor: <div><h2>Editor</h2><button>Crear</button></div>,
    viewer: <p>Solo lectura</p>,
  };

  return <div className="panel">{paneles[rol]}</div>;
}

// ─── Opción 3: componentes separados (mejor para lógica compleja) ───
// ¿POR QUÉ? Porque cada componente puede tener su propio estado y lógica.
const componentesPorRol: Record<string, React.ComponentType> = {
  admin: AdminPanel,
  editor: EditorPanel,
  viewer: ViewerPanel,
};

function PanelDinamico({ rol }: { rol: 'admin' | 'editor' | 'viewer' }) {
  const Componente = componentesPorRol[rol];
  return <Componente />;
  // React instancia el componente que corresponde al rol
}`;

const nullYUndefined = `// ¿QUÉ pasa cuando un componente retorna null?
// React NO renderiza nada. El componente "existe" en el árbol de React
// pero no produce ningún nodo DOM. Esto es diferente a no renderizar
// el componente en absoluto.

// ¿CÓMO lo usa React internamente?
// Cuando un componente retorna null, React:
// 1. Ejecuta la función del componente (el render SÍ ocurre)
// 2. Los hooks SÍ se ejecutan (useState, useEffect, etc.)
// 3. Pero no inserta ningún nodo en el DOM
// Esto significa que un componente que retorna null SIGUE VIVO
// y puede tener efectos activos.

function NotificacionCondicional({ mensaje, visible }: {
  mensaje: string;
  visible: boolean;
}) {
  // useEffect corre aunque visible sea false
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {/* ocultar */}, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Retorna null = no se ve en pantalla, pero el componente está "montado"
  if (!visible) return null;

  return <div className="notificacion">{mensaje}</div>;
}

// ¿POR QUÉ importa esta distinción?
// Si necesitas que los hooks NO se ejecuten cuando no es visible,
// la solución es NO renderizar el componente desde el padre:
function Padre() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {/* Opción A: el componente siempre está montado (hooks activos) */}
      <NotificacionCondicional mensaje="Hola" visible={visible} />

      {/* Opción B: el componente se monta/desmonta (hooks se limpian) */}
      {visible && <Notificacion mensaje="Hola" />}
    </div>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/UserDashboard.tsx
// Ejemplo COMPLETO: todos los patrones de renderizado condicional
// ============================================
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'error' | 'success';
type Role = 'admin' | 'editor' | 'viewer';

interface User {
  nombre: string;
  role: Role;
  avatar?: string;
  notificaciones: number;
}

// Early return para estados de carga/error
function DataLoader({ status, error, children }: {
  status: Status;
  error: string | null;
  children: React.ReactNode;
}) {
  if (status === 'loading') return <div className="p-8 text-center animate-pulse">Cargando...</div>;
  if (status === 'error') return <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>;
  if (status === 'idle') return null;
  return <>{children}</>;
}

// Objeto map para múltiples variantes (en vez de switch)
const roleConfig: Record<Role, { label: string; color: string; permisos: string[] }> = {
  admin: { label: 'Administrador', color: 'bg-red-100 text-red-700', permisos: ['crear', 'editar', 'eliminar', 'gestionar usuarios'] },
  editor: { label: 'Editor', color: 'bg-blue-100 text-blue-700', permisos: ['crear', 'editar'] },
  viewer: { label: 'Lector', color: 'bg-gray-100 text-gray-700', permisos: ['ver'] },
};

function RoleBadge({ role }: { role: Role }) {
  const config = roleConfig[role];
  return <span className={\`px-2 py-1 rounded text-xs font-bold \${config.color}\`}>{config.label}</span>;
}

export default function UserDashboard() {
  const [status, setStatus] = useState<Status>('success');
  const [user] = useState<User>({
    nombre: 'María García', role: 'admin', notificaciones: 5,
  });

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl">
      <div className="flex gap-2 mb-4">
        {(['idle', 'loading', 'error', 'success'] as Status[]).map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={\`px-3 py-1 rounded text-sm \${status === s ? 'bg-blue-500 text-white' : 'bg-gray-100'}\`}>
            {s}
          </button>
        ))}
      </div>

      <DataLoader status={status} error="No se pudo cargar el usuario">
        {/* Ternario: si/entonces/sino */}
        <div className="flex items-center gap-3 mb-4">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold">
              {user.nombre[0]}
            </div>
          )}
          <div>
            <p className="font-bold">{user.nombre}</p>
            <RoleBadge role={user.role} />
          </div>
        </div>

        {/* AND lógico: mostrar solo si es true */}
        {user.notificaciones > 0 && (
          <div className="p-3 bg-yellow-50 rounded mb-4">
            Tienes {user.notificaciones} notificaciones pendientes
          </div>
        )}

        {/* Objeto map para permisos según rol */}
        <div>
          <p className="font-semibold mb-2">Permisos:</p>
          <div className="flex gap-2 flex-wrap">
            {roleConfig[user.role].permisos.map(p => (
              <span key={p} className="px-2 py-1 bg-gray-100 rounded text-sm">{p}</span>
            ))}
          </div>
        </div>
      </DataLoader>
    </div>
  );
}`;

export default function RenderizadoCondicionalPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Renderizado Condicional</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        En React no existe una directiva especial como <code>*ngIf</code> de Angular.
        En su lugar, usas <strong>JavaScript puro</strong> directamente en el JSX:
        operadores ternarios, AND lógico (&&), early returns y variables. Esto es
        así porque JSX <strong>es JavaScript</strong> — no hay un lenguaje de template
        separado. Todo lo que sabes de JS funciona directamente.
      </p>

      <InfoBox type="angular" title="Angular vs React — Renderizado condicional">
        <p>
          Angular tiene directivas de template: <code>*ngIf="cond"</code> (v16-) o
          el nuevo <code>@if (cond) {'{'}...{'}'}</code> (v17+). Estas son parte del
          lenguaje de template de Angular. En React no hay lenguaje de template — usas
          operadores de JavaScript directamente. La ventaja es que no necesitas aprender
          sintaxis especial; la desventaja es que requiere entender bien cómo JavaScript
          evalúa expresiones.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Ternario (? :) — Si / entonces / sino</h2>
      <p className="text-text-muted mb-4">
        El operador ternario es la forma más directa de renderizado condicional en JSX.
        Funciona porque es una <strong>expresión</strong> (produce un valor), a diferencia
        de <code>if/else</code> que es un <strong>statement</strong> (ejecuta una acción).
        JSX solo acepta expresiones dentro de las llaves <code>{'{}'}</code>.
      </p>
      <CodeBlock code={ternario} language="tsx" filename="ternario.tsx" />

      <InfoBox type="info" title="¿Por qué no puedo usar if/else dentro de JSX?">
        Recuerda: lo que escribes entre llaves en JSX debe ser una <strong>expresión</strong> que
        produzca un valor. <code>if/else</code> es un statement que ejecuta código pero no produce
        un valor que React pueda insertar en el DOM. El ternario <code>a ? b : c</code> sí produce
        un valor. Esta es la razón fundamental — no es una limitación de React, es cómo funciona
        JavaScript.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">AND lógico (&&) — Mostrar solo si...</h2>
      <p className="text-text-muted mb-4">
        Cuando quieres renderizar algo <strong>solo si una condición es verdadera</strong> (sin
        caso "else"), el operador <code>&&</code> es ideal. Pero tiene una trampa sutil con
        valores numéricos que debes entender para evitar bugs.
      </p>
      <CodeBlock code={andLogico} language="tsx" filename="and-logico.tsx" />

      <InfoBox type="warning" title="La trampa del 0 con && — ¿Por qué ocurre?">
        <p>
          JavaScript evalúa <code>0 && &lt;Componente /&gt;</code> y como <code>0</code> es
          falsy, retorna <code>0</code> (el lado izquierdo). Pero React renderiza <code>0</code>
          porque es un número válido que podrías querer mostrar. En cambio, <code>false</code>,
          <code>null</code> y <code>undefined</code> son valores que React ignora intencionalmente.
          <strong> Solución: siempre convierte a boolean</strong> con una comparación explícita
          (<code>n &gt; 0</code>) o doble negación (<code>!!n</code>).
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Early return — El patrón más limpio</h2>
      <p className="text-text-muted mb-4">
        El early return aprovecha que un componente es una <strong>función normal de JavaScript</strong>.
        Puedes hacer <code>return</code> en cualquier punto. Esto es especialmente útil para manejar
        estados de carga, errores y datos vacíos de forma clara y legible, sin anidar ternarios.
      </p>
      <CodeBlock code={earlyReturn} language="tsx" filename="early-return.tsx" />

      <InfoBox type="tip" title="¿Por qué early return es mejor que ternarios anidados?">
        <p>
          Cada <code>if</code> se lee como una regla independiente, de arriba a abajo. No hay
          indentación profunda. Además, TypeScript <strong>infiere tipos más precisos</strong>
          después de cada check: si verificaste que <code>error</code> es null y <code>datos</code>
          no es null, después de esos ifs TypeScript sabe que <code>datos</code> es <code>string[]</code>.
          Con ternarios pierdes esa inferencia.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Switch y objetos map — Para múltiples casos</h2>
      <p className="text-text-muted mb-4">
        Cuando tienes más de 2-3 variantes, los ternarios se vuelven ilegibles. Puedes usar
        <code> switch</code>, un <strong>objeto map</strong> (más declarativo), o incluso un
        map de componentes para lógica compleja. El JSX se puede guardar en variables porque
        es solo un valor de JavaScript.
      </p>
      <CodeBlock code={switchJsx} language="tsx" filename="switch-y-map.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Retornar null — Componentes invisibles</h2>
      <p className="text-text-muted mb-4">
        Entender qué pasa cuando un componente retorna <code>null</code> es crucial. El
        componente <strong>sigue montado</strong> (sus hooks se ejecutan), simplemente no
        produce nodo DOM. Esto es diferente a no renderizar el componente desde el padre.
      </p>
      <CodeBlock code={nullYUndefined} language="tsx" filename="retornar-null.tsx" />

      <InfoBox type="tip" title="Resumen — ¿Cuándo usar cada patrón?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Ternario <code>? :</code></strong> — Cuando tienes caso verdadero Y falso (2 opciones)</li>
          <li><strong>AND lógico <code>&&</code></strong> — Cuando solo quieres mostrar algo si es true (sin else)</li>
          <li><strong>Early return</strong> — Para estados de carga/error/vacío antes del JSX principal</li>
          <li><strong>Switch / objeto map</strong> — Para 3+ variantes (roles, estados, tabs)</li>
          <li><strong>Retornar null</strong> — Componente montado pero invisible (hooks siguen activos)</li>
          <li><strong>No renderizar desde padre</strong> — Componente completamente desmontado</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Dashboard de usuario: early return (DataLoader), ternario (avatar), && (notificaciones),
        objeto map (roles/permisos), y estado para simular carga/error.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/UserDashboard.tsx" />
    </div>
  );
}
