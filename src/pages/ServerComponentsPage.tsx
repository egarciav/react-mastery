import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const rscBasico = `// SERVER COMPONENTS (RSC) — Componentes que se ejecutan en el SERVIDOR
// No envían JavaScript al navegador = menos bundle, más rendimiento

// ─── Server Component (por defecto en Next.js App Router) ───
// Se ejecuta en el servidor. NO puede usar hooks ni eventos.
async function ListaProductos() {
  // Puedes hacer fetch directamente, acceder a DB, leer archivos
  const productos = await db.query('SELECT * FROM productos');
  
  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>{p.nombre} - \${p.precio}</li>
      ))}
    </ul>
  );
}
// Este componente NUNCA envía JS al cliente.
// El HTML ya viene renderizado desde el servidor.

// ─── Client Component ───
// Para interactividad, debes marcar el archivo con 'use client'
'use client';

import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`;

const patronMixto = `// PATRÓN: Server Component padre + Client Component hijo

// ─── layout.tsx (Server Component) ───
// Hace el fetch de datos en el servidor
async function DashboardLayout() {
  const usuario = await getUsuarioActual();
  const stats = await getEstadisticas();

  return (
    <div>
      <h1>Dashboard de {usuario.nombre}</h1>
      {/* Pasa datos como props al Client Component */}
      <GraficoInteractivo datos={stats} />
      <TablaProductos productos={await getProductos()} />
    </div>
  );
}

// ─── GraficoInteractivo.tsx (Client Component) ───
'use client';

function GraficoInteractivo({ datos }: { datos: Stats }) {
  const [filtro, setFiltro] = useState('todos');
  // Tiene interactividad (useState, onClick, etc.)
  // Pero recibió los datos YA procesados del servidor
  return (
    <div>
      <select onChange={e => setFiltro(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="mes">Este mes</option>
      </select>
      <Chart data={datos} filter={filtro} />
    </div>
  );
}`;

const reglas = `// REGLAS de Server vs Client Components

// SERVER COMPONENTS pueden:
// ✅ Acceder a bases de datos directamente
// ✅ Leer archivos del sistema
// ✅ Usar variables de entorno del servidor
// ✅ Hacer fetch sin CORS (servidor a servidor)
// ✅ Importar Client Components

// SERVER COMPONENTS NO pueden:
// ❌ Usar useState, useEffect ni ningún hook
// ❌ Usar event handlers (onClick, onChange, etc.)
// ❌ Usar APIs del navegador (window, document, localStorage)
// ❌ Usar Context

// CLIENT COMPONENTS pueden:
// ✅ Usar hooks (useState, useEffect, etc.)
// ✅ Usar event handlers
// ✅ Usar APIs del navegador
// ✅ Tener interactividad

// CLIENT COMPONENTS NO pueden:
// ❌ Importar Server Components directamente
//    (pero pueden recibirlos como children)

// REGLA DE ORO:
// Por defecto todo es Server Component.
// Solo marca como 'use client' lo que NECESITA interactividad.`;

const cuando = `// ¿Cuándo necesitas Server Components?
// Requieren un framework que los soporte:

// ✅ Next.js App Router (soporte completo)
// ✅ Remix (soporte parcial)
// ⚠️ Vite + React puro: NO tiene RSC
//    (este sitio usa Vite, por eso no podemos hacer RSC aquí)

// Si usas Vite/CRA sin framework:
// - Todos tus componentes son Client Components
// - No necesitas 'use client' (todo es cliente por defecto)
// - El fetch de datos se hace con useEffect o librerías (TanStack Query)

// Si usas Next.js App Router:
// - Todo es Server Component por defecto
// - Solo marcas 'use client' donde necesitas interactividad
// - Menor bundle size, mejor SEO, acceso directo a datos`;

export default function ServerComponentsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Server Components</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los React Server Components (RSC) son componentes que se ejecutan
        <strong> exclusivamente en el servidor</strong>. No envían JavaScript al navegador,
        lo que reduce drásticamente el bundle size y mejora el rendimiento.
      </p>

      <InfoBox type="angular">
        Angular tiene SSR con Angular Universal. Los Server Components de React van más allá:
        no son SSR tradicional (renderizar y enviar HTML + hidratar con JS). Los RSC
        <strong> nunca envían JS al cliente</strong>. Es un paradigma nuevo que Angular está
        explorando con Server-side rendering parcial.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Server vs Client Components</h2>
      <CodeBlock code={rscBasico} language="tsx" filename="server-components.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Patrón: Server padre + Client hijo</h2>
      <p className="text-text-muted mb-4">
        El patrón más común: el Server Component obtiene datos y el Client Component
        maneja la interactividad.
      </p>
      <CodeBlock code={patronMixto} language="tsx" filename="patron-mixto.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Reglas y limitaciones</h2>
      <CodeBlock code={reglas} language="tsx" filename="reglas-rsc.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cuándo los necesitas?</h2>
      <CodeBlock code={cuando} language="tsx" filename="cuando-rsc.tsx" />

      <InfoBox type="warning" title="Requieren un framework">
        Los Server Components <strong>no funcionan con Vite + React puro</strong>. Necesitas
        un framework como <strong>Next.js</strong> (App Router). Si estás empezando con React,
        enfócate primero en los Client Components y hooks. RSC es el siguiente paso cuando
        necesites rendimiento y SEO.
      </InfoBox>

      <InfoBox type="tip" title="Resumen para decidir">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>SPA simple</strong> (dashboard, app interna): Vite + React, todo client</li>
          <li><strong>App con SEO</strong> (blog, e-commerce): Next.js con Server Components</li>
          <li><strong>App full-stack</strong>: Next.js App Router aprovechando RSC al máximo</li>
        </ul>
      </InfoBox>
    </div>
  );
}
