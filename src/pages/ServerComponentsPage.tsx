import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const rscBasico = `// SERVER COMPONENTS (RSC) — Un paradigma nuevo en React
//
// ¿QUÉ PROBLEMA RESUELVEN?
// En una SPA tradicional, TODO el código React se envía al navegador:
// componentes, lógica, librerías de fetch, parsers, etc.
// Si tu componente solo muestra datos de una DB, ¿por qué enviar
// su JavaScript al cliente? El navegador no necesita ese código.
//
// ¿CÓMO FUNCIONAN?
// Los Server Components se ejecutan en el SERVIDOR durante el request.
// React los renderiza a un formato especial (RSC payload, no HTML).
// Ese payload se envía al cliente, donde React lo convierte en DOM.
// El JavaScript del Server Component NUNCA llega al navegador.
//
// ¿POR QUÉ es diferente del SSR tradicional?
// SSR: renderiza HTML en servidor → envía HTML + TODO el JS → hidrata
// RSC: renderiza en servidor → envía solo el resultado → NO envía JS
// SSR reduce el tiempo de primera pintura. RSC reduce el bundle total.

// ─── Server Component (por defecto en Next.js App Router) ───
async function ListaProductos() {
  // ✅ Puedes hacer fetch, acceder a DB, leer archivos del servidor
  // Todo esto se ejecuta en el servidor, no en el navegador
  const productos = await db.query('SELECT * FROM productos');
  
  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>{p.nombre} - \${p.precio}</li>
      ))}
    </ul>
  );
}
// El navegador recibe el HTML renderizado.
// db.query, el driver de base de datos, y el componente
// NUNCA se incluyen en el bundle del cliente.

// ─── Client Component ───
// Para interactividad (hooks, eventos), marca con 'use client'
'use client'; // ← esta directiva marca el límite servidor/cliente

import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);
  // useState, onClick → necesitan JavaScript en el navegador
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
// Este SÍ envía su JavaScript al navegador (es un Client Component).`;

const patronMixto = `// PATRÓN: Server padre + Client hijo (el más importante de RSC)
//
// ¿CÓMO se estructura una página con RSC?
// La idea: maximizar lo que se ejecuta en servidor, minimizar
// lo que se envía al cliente. Solo marca 'use client' lo que
// NECESITA interactividad (hooks, eventos).
//
// ¿POR QUÉ este patrón?
// El Server Component obtiene datos sin latencia de red
// (servidor a DB es rápido). Luego pasa los datos ya procesados
// al Client Component como props (serializados en el RSC payload).
// El Client Component solo maneja la UI interactiva — no necesita
// saber de dónde vinieron los datos ni cómo obtenerlos.

// ─── DashboardLayout.tsx (Server Component — por defecto) ───
async function DashboardLayout() {
  // Estos awaits se ejecutan en el servidor, sin waterfall
  const usuario = await getUsuarioActual();
  const stats = await getEstadisticas();

  return (
    <div>
      <h1>Dashboard de {usuario.nombre}</h1>
      {/* Pasa datos serializables al Client Component */}
      <GraficoInteractivo datos={stats} />
      <TablaProductos productos={await getProductos()} />
    </div>
  );
  // DashboardLayout NO envía JS al cliente.
  // Solo el HTML renderizado + los datos para los Client Components.
}

// ─── GraficoInteractivo.tsx (Client Component) ───
'use client'; // ← este archivo y sus imports van al bundle del cliente

function GraficoInteractivo({ datos }: { datos: Stats }) {
  const [filtro, setFiltro] = useState('todos');
  // ✅ Tiene interactividad (useState, onChange)
  // ✅ Recibió datos YA procesados del servidor (como props)
  // ❌ NO hace fetch — el servidor ya lo hizo
  return (
    <div>
      <select onChange={e => setFiltro(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="mes">Este mes</option>
      </select>
      <Chart data={datos} filter={filtro} />
    </div>
  );
}
// Solo GraficoInteractivo (y Chart) van en el bundle del cliente.
// DashboardLayout, getUsuarioActual, getEstadisticas → solo servidor.`;

const reglas = `// REGLAS de Server vs Client Components
//
// ¿POR QUÉ estas restricciones existen?
// Server Components se ejecutan en Node.js → no hay window, no hay DOM.
// Client Components se ejecutan en el navegador → no hay fs, no hay DB.
// Las restricciones reflejan qué ENTORNO ejecuta cada tipo.

// SERVER COMPONENTS pueden:
// ✅ Acceder a bases de datos directamente (mismo servidor)
// ✅ Leer archivos del sistema (fs.readFile)
// ✅ Usar variables de entorno secretas (API keys del servidor)
// ✅ Hacer fetch sin CORS (servidor a servidor, no hay navegador)
// ✅ Ser async (await directamente en el componente)
// ✅ Importar Client Components como hijos

// SERVER COMPONENTS NO pueden:
// ❌ Usar hooks (useState, useEffect, useRef — necesitan DOM/rerenders)
// ❌ Usar event handlers (onClick — no hay DOM en el servidor)
// ❌ Usar APIs del navegador (window, document, localStorage)
// ❌ Usar Context como consumidor (useContext)
// ¿POR QUÉ? Porque se ejecutan UNA vez en el servidor por request.
// No tienen "ciclo de vida" ni re-renders — son funciones puras.

// CLIENT COMPONENTS pueden:
// ✅ Usar hooks, event handlers, APIs del navegador
// ✅ Tener estado e interactividad
// ✅ Recibir Server Components como children (patrón composición)

// CLIENT COMPONENTS NO pueden:
// ❌ Importar Server Components directamente (rompe el boundary)
//    Pero SÍ pueden recibirlos como children o slots:
//    <ClientComponent>
//      <ServerComponent />  {/* ← esto SÍ funciona */}
//    </ClientComponent>

// REGLA DE ORO:
// Por defecto TODO es Server Component (en Next.js App Router).
// Solo marca 'use client' lo que NECESITA interactividad.
// Cuanto más arriba el 'use client', más JS envías al cliente.`;

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
        Los React Server Components (RSC) son un paradigma nuevo: componentes que se ejecutan
        <strong> exclusivamente en el servidor</strong>. Su JavaScript nunca llega al navegador,
        reduciendo drásticamente el bundle. No son SSR tradicional (que envía HTML + JS y
        luego hidrata) — los RSC eliminan el JS del componente por completo.
      </p>

      <InfoBox type="angular" title="Angular Universal SSR vs React Server Components">
        <p>
          Angular tiene SSR con <strong>Angular Universal</strong>: renderiza HTML en el servidor,
          envía HTML + todo el JS, e hidrata en el cliente. Los RSC de React son diferentes:
          el componente del servidor <strong>nunca envía JS</strong>. Solo el resultado renderizado
          llega al cliente. Angular está explorando algo similar con partial hydration y
          server-side rendering diferido en versiones recientes.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Server vs Client Components — Dos mundos</h2>
      <p className="text-text-muted mb-4">
        Server Components se ejecutan en Node.js (acceso a DB, archivos, APIs internas).
        Client Components se ejecutan en el navegador (hooks, eventos, DOM). La directiva
        <code> 'use client'</code> marca el límite entre ambos mundos.
      </p>
      <CodeBlock code={rscBasico} language="tsx" filename="server-components.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Patrón principal — Server obtiene, Client interactúa</h2>
      <p className="text-text-muted mb-4">
        El Server Component obtiene datos (DB, API) y pasa los resultados como props al
        Client Component. El cliente solo maneja la interactividad — no necesita saber
        de dónde vinieron los datos. Esto maximiza lo que se ejecuta en servidor.
      </p>
      <CodeBlock code={patronMixto} language="tsx" filename="patron-mixto.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Reglas — Qué puede hacer cada tipo y por qué</h2>
      <p className="text-text-muted mb-4">
        Las restricciones reflejan el <strong>entorno de ejecución</strong>: servidor (Node.js)
        no tiene window/DOM; navegador no tiene filesystem/DB. Entender por qué existen
        estas reglas es clave para decidir qué va en cada lado.
      </p>
      <CodeBlock code={reglas} language="tsx" filename="reglas-rsc.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Cuándo los necesitas?</h2>
      <CodeBlock code={cuando} language="tsx" filename="cuando-rsc.tsx" />

      <InfoBox type="warning" title="Requieren un framework con soporte RSC">
        Los Server Components <strong>no funcionan con Vite + React puro</strong>. Necesitas
        <strong> Next.js App Router</strong> (soporte completo). Este sitio usa Vite, por lo que
        todos los componentes aquí son Client Components. Si estás empezando, enfócate en
        hooks y Client Components; RSC es el siguiente nivel cuando necesites rendimiento y SEO.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Server Components">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Se ejecutan en servidor</strong> — su JS nunca llega al navegador</li>
          <li><strong>Diferente de SSR</strong> — SSR envía HTML+JS+hidrata; RSC no envía JS</li>
          <li><strong>Patrón clave</strong>: Server obtiene datos → Client maneja interactividad</li>
          <li><strong>'use client'</strong> marca el límite servidor/cliente</li>
          <li><strong>Restricciones = entorno</strong>: servidor no tiene DOM, cliente no tiene DB</li>
          <li><strong>SPA simple</strong> → Vite; <strong>App con SEO</strong> → Next.js con RSC</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        El patrón mixto Server + Client de arriba es el ejemplo más práctico para Next.js.
        Recuerda: RSC requiere Next.js App Router — este sitio usa Vite (Client Components).
      </p>
      <CodeBlock code={patronMixto} language="tsx" filename="app/products/page.tsx (Next.js)" />
    </div>
  );
}
