import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const mapBasico = `// .map() es el equivalente de *ngFor en React.
//
// ¿CÓMO FUNCIONA?
// Array.map() es un método de JavaScript que recorre un array y
// TRANSFORMA cada elemento en algo nuevo. En React, lo usamos para
// transformar datos en JSX (elementos de UI).
//
// datos = ['Manzana', 'Banana', 'Cereza']
// ↓ .map() transforma cada string en un <li>
// resultado = [<li>Manzana</li>, <li>Banana</li>, <li>Cereza</li>]
// ↓ React renderiza el array de JSX como hijos del <ul>

const frutas = ['Manzana', 'Banana', 'Cereza'];

function ListaFrutas() {
  return (
    <ul>
      {frutas.map((fruta, index) => (
        <li key={index}>{fruta}</li>
      ))}
    </ul>
  );
}

// ¿POR QUÉ .map() y no un for loop?
// Porque .map() es una EXPRESIÓN que retorna un array — funciona dentro
// de las llaves {} de JSX. Un for loop es un STATEMENT que no retorna nada.
// (La misma razón por la que usamos ternarios en vez de if/else en JSX)

// ❌ No funciona: for es un statement
function ListaMala() {
  return (
    <ul>
      {/* for (const f of frutas) { <li>{f}</li> } // Error */}
    </ul>
  );
}

// También puedes usar .filter() + .map() para filtrar Y renderizar:
function FrutasFiltradas({ busqueda }: { busqueda: string }) {
  return (
    <ul>
      {frutas
        .filter(f => f.toLowerCase().includes(busqueda.toLowerCase()))
        .map(f => <li key={f}>{f}</li>)
      }
    </ul>
  );
}`;

const keysImportancia = `// ⚠️ KEY es OBLIGATORIA y debe ser ÚNICA y ESTABLE
//
// ¿CÓMO USA React las keys internamente?
// Cuando React re-renderiza una lista, necesita saber:
// 1. ¿Qué elementos son NUEVOS? → crearlos
// 2. ¿Qué elementos DESAPARECIERON? → eliminarlos
// 3. ¿Qué elementos CAMBIARON de posición? → moverlos
// 4. ¿Qué elementos son los MISMOS? → reutilizarlos (preservar estado)
//
// Las keys son el IDENTIFICADOR que React usa para matchear elementos
// del render anterior con el render nuevo. Sin keys, React no puede
// distinguir un elemento de otro y tiene que destruir/recrear todo.

interface Usuario { id: number; nombre: string; }
const usuarios: Usuario[] = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Bob' },
  { id: 3, nombre: 'Carlos' },
];

function Lista() {
  return (
    <ul>
      {/* ✅ ID único de tus datos — React puede identificar cada elemento */}
      {usuarios.map(u => <li key={u.id}>{u.nombre}</li>)}
    </ul>
  );
}

// ─── ¿POR QUÉ index como key es problemático? ───
// Imagina esta lista: [Ana(key=0), Bob(key=1), Carlos(key=2)]
// Si ELIMINAS a Ana:  [Bob(key=0), Carlos(key=1)]
//
// React ve: key=0 era "Ana" → ahora es "Bob" → ACTUALIZA el contenido
//           key=1 era "Bob" → ahora es "Carlos" → ACTUALIZA el contenido
//           key=2 era "Carlos" → ya no existe → ELIMINA
//
// React actualizó 2 elementos y eliminó 1 = 3 operaciones DOM
// Con IDs reales: React simplemente elimina key=1 (Ana) = 1 operación
//
// Peor aún: si los <li> tienen inputs con estado (valor escrito),
// el estado se mezcla entre elementos porque React reutiliza el
// componente de key=0 pero ahora tiene datos diferentes.

// ❌ index como key: problemas al reordenar/eliminar
// usuarios.map((u, i) => <li key={i}>{u.nombre}</li>)

// ❌ Sin key: React da warning y no puede optimizar
// usuarios.map(u => <li>{u.nombre}</li>)

// ❌ Key aleatoria: React destruye y recrea TODO en cada render
// usuarios.map(u => <li key={Math.random()}>{u.nombre}</li>)`;

const keysVisualizacion = `// VISUALIZACIÓN: ¿Qué hace React con y sin keys correctas?

// ─── Ejemplo: reordenar una lista ───
// Estado anterior:           Estado nuevo (Carlos movido arriba):
// key="ana"   → <li>Ana</li>      key="carlos" → <li>Carlos</li>
// key="bob"   → <li>Bob</li>      key="ana"    → <li>Ana</li>
// key="carlos"→ <li>Carlos</li>   key="bob"    → <li>Bob</li>

// CON keys de ID:
// React ve que key="carlos" se movió de posición 2 a posición 0.
// MUEVE el nodo DOM existente. No destruye ni recrea. ✅
// El estado interno del componente (inputs, animaciones) se PRESERVA.

// CON index como key:
// React ve que key=0 cambió de "Ana" a "Carlos" → ACTUALIZA contenido
// React ve que key=1 cambió de "Bob" a "Ana" → ACTUALIZA contenido
// React ve que key=2 cambió de "Carlos" a "Bob" → ACTUALIZA contenido
// 3 actualizaciones innecesarias. El estado se MEZCLA. ❌

// ─── Regla de oro: ¿cuándo SÍ puedes usar index? ───
// Solo si se cumplen TODAS estas condiciones:
// 1. La lista es ESTÁTICA (no se agrega/elimina/reordena)
// 2. Los items NO tienen estado propio (inputs, checkboxes)
// 3. No hay filtros ni sorts
// Ejemplo válido: una lista de links de navegación fija`;

const listaComponentes = `// Lo más común en apps reales: mapear datos a COMPONENTES
//
// ¿CÓMO se estructura?
// 1. Tienes un array de datos (del servidor, estado, props)
// 2. .map() transforma cada dato en un componente
// 3. La key va en el componente MÁS EXTERNO dentro del map
// 4. Los datos se pasan como props al componente hijo

interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

function ProductoCard({ producto, onEliminar }: {
  producto: Producto;
  onEliminar: (id: string) => void;
}) {
  return (
    <div className="card">
      <h3>{producto.nombre}</h3>
      <p>\${producto.precio}</p>
      <button onClick={() => onEliminar(producto.id)}>Eliminar</button>
    </div>
  );
}

function ListaProductos() {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 'a1', nombre: 'Laptop', precio: 999 },
    { id: 'b2', nombre: 'Mouse', precio: 29 },
    { id: 'c3', nombre: 'Teclado', precio: 79 },
  ]);

  const eliminar = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      {productos.map(p => (
        <ProductoCard
          key={p.id}       // ⚠️ key va AQUÍ, en el elemento raíz del map
          producto={p}     // NO dentro de ProductoCard
          onEliminar={eliminar}
        />
      ))}
    </div>
  );
}

// ¿POR QUÉ la key va en el elemento externo y no dentro del componente?
// Porque React necesita la key ANTES de renderizar el componente,
// para decidir si debe reutilizarlo o recrearlo.
// La key no es una prop — React la consume internamente y NO la pasa
// al componente hijo. Si necesitas el id dentro, pásalo como prop separada:
// <ProductoCard key={p.id} id={p.id} producto={p} />`;

const listasConEstado = `// LISTAS CON ESTADO: el patrón completo CRUD
//
// ¿POR QUÉ este patrón es tan importante?
// Porque la mayoría de apps son CRUD: Create, Read, Update, Delete.
// Saber manipular arrays de estado de forma inmutable es fundamental.

interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

function ListaTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: 1, texto: 'Aprender React', completada: false },
    { id: 2, texto: 'Crear proyecto', completada: false },
  ]);
  const [nuevoTexto, setNuevoTexto] = useState('');

  // CREATE: spread + nuevo elemento al final
  const agregar = () => {
    if (!nuevoTexto.trim()) return;
    setTareas(prev => [
      ...prev,
      { id: Date.now(), texto: nuevoTexto, completada: false }
    ]);
    setNuevoTexto('');
  };

  // UPDATE: .map() crea un nuevo array con el elemento modificado
  const toggleCompletada = (id: number) => {
    setTareas(prev => prev.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
      // ↑ Si es el que buscamos, crea copia con completada invertida
      // ↑ Si no, devuelve el original (sin tocar)
    ));
  };

  // DELETE: .filter() crea un nuevo array sin el elemento
  const eliminar = (id: number) => {
    setTareas(prev => prev.filter(t => t.id !== id));
    // filter retorna un array con solo los que cumplen la condición
    // t.id !== id → incluye todo EXCEPTO el que queremos eliminar
  };

  return (
    <div>
      <div>
        <input value={nuevoTexto} onChange={e => setNuevoTexto(e.target.value)} />
        <button onClick={agregar}>Agregar</button>
      </div>
      <ul>
        {tareas.map(t => (
          <li key={t.id}>
            <span
              style={{ textDecoration: t.completada ? 'line-through' : 'none' }}
              onClick={() => toggleCompletada(t.id)}
            >
              {t.texto}
            </span>
            <button onClick={() => eliminar(t.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p>{tareas.filter(t => !t.completada).length} tareas pendientes</p>
    </div>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/ContactList.tsx
// Ejemplo COMPLETO: listas, keys, CRUD inmutable, filtrado
// ============================================
import { useState } from 'react';

interface Contact {
  id: number;
  nombre: string;
  email: string;
  favorito: boolean;
}

function ContactItem({ contacto, onToggleFav, onEliminar }: {
  contacto: Contact;
  onToggleFav: (id: number) => void;
  onEliminar: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border-b hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold">
          {contacto.nombre[0]}
        </div>
        <div>
          <p className="font-medium">{contacto.nombre}</p>
          <p className="text-sm text-gray-500">{contacto.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onToggleFav(contacto.id)}
          className={\`text-lg \${contacto.favorito ? 'text-yellow-500' : 'text-gray-300'}\`}>
          ★
        </button>
        <button onClick={() => onEliminar(contacto.id)}
          className="text-red-400 hover:text-red-600 text-sm">✕</button>
      </div>
    </div>
  );
}

export default function ContactList() {
  const [contactos, setContactos] = useState<Contact[]>([
    { id: 1, nombre: 'María García', email: 'maria@test.com', favorito: true },
    { id: 2, nombre: 'Carlos López', email: 'carlos@test.com', favorito: false },
    { id: 3, nombre: 'Ana Martínez', email: 'ana@test.com', favorito: false },
  ]);
  const [filtro, setFiltro] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');

  // CRUD inmutable
  const agregar = () => {
    if (!nuevoNombre.trim()) return;
    const nuevo: Contact = {
      id: Date.now(), // key estable basada en timestamp
      nombre: nuevoNombre,
      email: nuevoNombre.toLowerCase().replace(' ', '.') + '@test.com',
      favorito: false,
    };
    setContactos(prev => [...prev, nuevo]); // spread + nuevo
    setNuevoNombre('');
  };

  const toggleFavorito = (id: number) => {
    setContactos(prev =>
      prev.map(c => c.id === id ? { ...c, favorito: !c.favorito } : c) // map inmutable
    );
  };

  const eliminar = (id: number) => {
    setContactos(prev => prev.filter(c => c.id !== id)); // filter inmutable
  };

  // Estado derivado: filtrado + ordenado (favoritos primero)
  const contactosFiltrados = contactos
    .filter(c => c.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => Number(b.favorito) - Number(a.favorito));

  return (
    <div className="max-w-md mx-auto border rounded-xl overflow-hidden">
      <div className="p-4 bg-gray-50">
        <input value={filtro} onChange={e => setFiltro(e.target.value)}
          placeholder="Filtrar contactos..."
          className="w-full px-3 py-2 border rounded mb-2" />
        <div className="flex gap-2">
          <input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)}
            placeholder="Nuevo contacto" className="flex-1 px-3 py-2 border rounded"
            onKeyDown={e => e.key === 'Enter' && agregar()} />
          <button onClick={agregar}
            className="px-4 py-2 bg-blue-500 text-white rounded">+</button>
        </div>
      </div>
      <div>
        {contactosFiltrados.length === 0 ? (
          <p className="p-6 text-center text-gray-400">No hay contactos</p>
        ) : (
          contactosFiltrados.map(c => (
            <ContactItem key={c.id} contacto={c}
              onToggleFav={toggleFavorito} onEliminar={eliminar} />
          ))
        )}
      </div>
      <div className="p-3 bg-gray-50 text-sm text-gray-500 text-center">
        {contactos.length} contactos · {contactos.filter(c => c.favorito).length} favoritos
      </div>
    </div>
  );
}`;

export default function ListasKeysPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Listas y Keys</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Para renderizar listas en React usas <code>.map()</code> de JavaScript, que
        transforma un array de datos en un array de JSX. Cada elemento necesita
        una <strong>key</strong> única que React usa internamente para identificar qué
        cambió entre renders. Las keys son la piedra angular del algoritmo de
        reconciliación de React para listas.
      </p>

      <InfoBox type="angular" title="Angular *ngFor vs React .map()">
        <p>
          Angular: <code>*ngFor="let item of items; trackBy: trackById"</code> o el nuevo
          <code> @for (item of items; track item.id)</code>. React: <code>items.map(item =&gt;
          &lt;Item key={'{item.id}'} /&gt;)</code>. El concepto es idéntico — ambos necesitan
          un identificador para trackear elementos. La diferencia es que en Angular es una
          directiva de template, en React es JavaScript puro. Angular 17+ con <code>@for</code>
          hizo <code>track</code> obligatorio, exactamente como React siempre lo exigió con <code>key</code>.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">map() — Transformar datos en UI</h2>
      <p className="text-text-muted mb-4">
        <code>.map()</code> recorre un array y transforma cada elemento en JSX. Es una
        <strong> expresión</strong> (retorna un nuevo array), por eso funciona dentro de las
        llaves de JSX. Un <code>for</code> loop no funciona porque es un statement.
      </p>
      <CodeBlock code={mapBasico} language="tsx" filename="map-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cómo usa React las keys internamente?</h2>
      <p className="text-text-muted mb-4">
        Cuando el estado cambia y React re-renderiza una lista, necesita <strong>matchear</strong> los
        elementos del render anterior con los del nuevo. Las keys son el mecanismo: React busca
        en el nuevo render un elemento con la misma key que el anterior. Si lo encuentra, lo
        <strong> reutiliza</strong> (preservando su estado DOM). Si no, lo <strong>destruye y recrea</strong>.
      </p>
      <CodeBlock code={keysImportancia} language="tsx" filename="keys.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Visualización: keys correctas vs index</h2>
      <p className="text-text-muted mb-4">
        Este ejemplo muestra exactamente <strong>por qué</strong> usar index como key causa
        problemas cuando la lista cambia. El impacto es tanto en rendimiento como en
        <strong> correctitud</strong> (el estado se puede mezclar entre elementos).
      </p>
      <CodeBlock code={keysVisualizacion} language="tsx" filename="keys-visualizacion.tsx" />

      <InfoBox type="warning" title="Reglas de keys — y por qué existen">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Únicas entre hermanos</strong> — React usa la key como identificador; dos keys iguales = ambigüedad</li>
          <li><strong>Estables entre renders</strong> — Si la key cambia, React destruye y recrea el componente (pierde estado)</li>
          <li><strong>Usa IDs de tus datos</strong> — Son únicos y estables por naturaleza</li>
          <li><strong>NUNCA Math.random()</strong> — Genera key nueva en cada render = React destruye TODO siempre</li>
          <li><strong>Index solo para listas estáticas</strong> — Sin agregar, eliminar, ni reordenar</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Listas con componentes</h2>
      <p className="text-text-muted mb-4">
        Lo más común en apps reales: mapear datos a componentes. La key <strong>siempre va en
        el elemento más externo</strong> dentro del map — no dentro del componente hijo. React la
        consume internamente y no la pasa como prop.
      </p>
      <CodeBlock code={listaComponentes} language="tsx" filename="lista-componentes.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Patrón CRUD completo — Listas con estado</h2>
      <p className="text-text-muted mb-4">
        La mayoría de aplicaciones son CRUD (Create, Read, Update, Delete). Saber manipular
        arrays de estado de forma <strong>inmutable</strong> (sin mutar el original) es una
        habilidad fundamental en React. Aquí el patrón completo con <code>.map()</code>,
        <code> .filter()</code> y spread.
      </p>
      <CodeBlock code={listasConEstado} language="tsx" filename="crud-lista.tsx" />

      <InfoBox type="tip" title="Resumen — Listas y Keys">
        <ul className="list-disc list-inside space-y-1">
          <li><code>.map()</code> transforma datos en JSX — es una expresión, funciona en JSX</li>
          <li>Las <strong>keys</strong> son el identificador que React usa para trackear elementos entre renders</li>
          <li>Keys correctas = React reutiliza y mueve nodos DOM (rápido, estado preservado)</li>
          <li>Keys incorrectas = React destruye y recrea (lento, estado perdido/mezclado)</li>
          <li><strong>CRUD inmutable</strong>: agregar con spread, actualizar con map, eliminar con filter</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Lista de contactos: CRUD inmutable (agregar, toggle favorito, eliminar), filtrado
        en tiempo real, keys con IDs estables, estado derivado, y ordenamiento.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/ContactList.tsx" />
    </div>
  );
}
