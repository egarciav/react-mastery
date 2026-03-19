import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const queEsVite = `// Vite es un BUILD TOOL y DEV SERVER para proyectos frontend.
// Su nombre viene del francés "rápido" — y eso es exactamente lo que es.
//
// PROBLEMA que resuelve:
// Las herramientas tradicionales (Webpack, Create React App) hacen un
// BUNDLE de toda la aplicación antes de poder servirla al navegador.
// En proyectos grandes esto tarda 30-60 segundos en arrancar.
//
// SOLUCIÓN de Vite:
// En desarrollo, NO hace bundle. Sirve los archivos directamente como
// ES Modules nativos. El navegador pide solo los módulos que necesita.
//
//  Webpack/CRA:    BUNDLE COMPLETO → servidor → navegador
//  Vite:           servidor → navegador pide módulo → Vite transforma solo ese archivo
//
// Resultado:
// - Arranque casi instantáneo (no importa el tamaño del proyecto)
// - HMR en < 50ms (solo actualiza el módulo que cambió)
// - Build de producción rápido con Rollup (optimizado y tree-shakeable)`;

const comparacionCRA = `// CREATE REACT APP (CRA) vs VITE
//
// CRA fue el estándar oficial de React por años, pero está DEPRECADO.
// Ya no recibe mantenimiento activo desde 2023.

// ── Arranque del dev server ──────────────────────────────────────
// CRA:  ~15-60 segundos (bundle completo con Webpack)
// Vite: < 1 segundo (sin bundle, ESM nativos)

// ── Hot Module Replacement (cambiar código → ver en pantalla) ──
// CRA:  2-10 segundos (re-bundlea módulos afectados)
// Vite: < 50ms (solo transforma el archivo que cambió)

// ── Build de producción ─────────────────────────────────────────
// CRA:  Webpack (configurable pero verboso)
// Vite: Rollup (más moderno, tree-shaking superior, chunks automáticos)

// ── Configuración ───────────────────────────────────────────────
// CRA:  Oculta la config (necesitas "eject" para tocarla → no hay vuelta atrás)
// Vite: vite.config.ts visible y editable desde el inicio

// ── TypeScript ──────────────────────────────────────────────────
// CRA:  Transpilación con Babel (más lento, type checking separado)
// Vite: Transpilación con esbuild (20-30x más rápido que Babel)
//       NOTA: Vite NO hace type checking por defecto (eso es tsc)
//       El build de producción sí incluye tsc -b

// ── Ecosystem ───────────────────────────────────────────────────
// CRA:  Plugins limitados, configuración cerrada
// Vite: API de plugins abierta, compatible con plugins de Rollup`;

const configProyecto = `// Este es el vite.config.ts DE ESTE PROYECTO — explicado línea a línea

import { defineConfig } from 'vite'        // helper con TypeScript autocompletado
import react from '@vitejs/plugin-react'   // plugin oficial de React para Vite
import tailwindcss from '@tailwindcss/vite' // plugin oficial de Tailwind v4

export default defineConfig({
  plugins: [
    react(),       // habilita: JSX transform, Fast Refresh, React DevTools
    tailwindcss(), // integra Tailwind directamente en el pipeline de Vite
  ],
  base: '/react-mastery/', // ruta base para GitHub Pages (sin esto, los assets fallan)
})

// ── ¿Qué hace el plugin de React? ───────────────────────────────
// @vitejs/plugin-react usa Babel internamente y habilita:
// 1. Transformación de JSX → JavaScript
// 2. Fast Refresh: actualiza solo el componente que cambió,
//    sin perder el estado de los demás componentes
// 3. Soporte para el nuevo JSX transform (no necesitas "import React")

// ── ¿Por qué Tailwind como plugin de Vite? ─────────────────────
// Tailwind v4 cambió de una CLI separada a un plugin de Vite.
// Esto significa que Tailwind se integra directamente en el
// pipeline de transformación de CSS de Vite → más rápido,
// sin proceso separado.`;

const configExtendida = `// Opciones comunes de vite.config.ts que te encontrarás en proyectos

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // ── Alias de paths ────────────────────────────────────────────
  // En vez de '../../components/Button', puedes usar '@/components/Button'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ── Servidor de desarrollo ───────────────────────────────────
  server: {
    port: 3000,       // puerto (default: 5173)
    open: true,       // abre el navegador al arrancar
    proxy: {          // proxy para evitar CORS en desarrollo
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  // ── Build de producción ──────────────────────────────────────
  build: {
    outDir: 'dist',           // carpeta de salida (default: dist)
    sourcemap: true,          // genera source maps para debugging
    chunkSizeWarningLimit: 600, // aumenta el límite de warning de chunks (kB)
    rollupOptions: {
      output: {
        // Separar vendors en su propio chunk (mejor caching)
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },

  // ── Variables de entorno ─────────────────────────────────────
  // Define valores que se pueden sobreescribir por entorno
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})`;

const envVars = `// VARIABLES DE ENTORNO en Vite

// Vite expone variables de entorno con el prefijo VITE_
// Las que NO tienen el prefijo VITE_ son privadas del servidor y NO
// están disponibles en el código del cliente (por seguridad).

// ── .env (todas las variables base) ──────────────────────────────
VITE_API_URL=https://api.miapp.com
VITE_APP_NAME=Mi App
DATABASE_PASSWORD=secreto123  // ❌ NO accesible en el cliente

// ── .env.development (solo en desarrollo) ────────────────────────
VITE_API_URL=http://localhost:8080

// ── .env.production (solo en build de producción) ─────────────────
VITE_API_URL=https://api.miapp.com

// ── Uso en el código ──────────────────────────────────────────────
// Accede con import.meta.env (NO process.env como en Node/CRA)

const apiUrl = import.meta.env.VITE_API_URL;    // ✅
const appName = import.meta.env.VITE_APP_NAME;  // ✅
const secret = import.meta.env.DATABASE_PASSWORD; // undefined (privada)

// Variables built-in de Vite:
import.meta.env.MODE       // 'development' | 'production' | 'test'
import.meta.env.DEV        // true si está en desarrollo
import.meta.env.PROD       // true si está en producción
import.meta.env.BASE_URL   // el valor de 'base' en vite.config.ts

// TypeScript: para autocompletado en tus variables personalizadas,
// agrega en src/vite-env.d.ts:
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}`;

const hmrExplicado = `// HMR — Hot Module Replacement

// HMR actualiza módulos en el navegador sin recargar la página.
// Vite + React Fast Refresh van más allá: preservan el ESTADO de los
// componentes que no cambiaron.

// EJEMPLO:
// Tienes un formulario con 5 campos llenados.
// Cambias el color del botón de "Submit".
// Con HMR: solo el botón se actualiza → los 5 campos conservan sus valores.
// Sin HMR (recarga completa): pierdes todo lo escrito.

// ¿Cómo funciona en Vite?
// 1. El file watcher detecta que 'Button.tsx' cambió
// 2. Vite transforma SOLO ese archivo con esbuild (< 10ms)
// 3. Envía el módulo actualizado al navegador via WebSocket
// 4. React Fast Refresh intercambia el componente manteniendo el estado
// 5. Total: < 50ms desde guardar hasta ver el cambio

// Limitaciones del Fast Refresh:
// - Si cambias un archivo que no es componente React (ej: un hook),
//   puede necesitar recarga completa
// - Si cambias el nombre de un export, se recarga
// - Los efectos (useEffect) SÍ se re-ejecutan al hacer Fast Refresh
//   (StrictMode también los ejecuta dos veces en dev — esto es normal)`;

const buildProd = `// BUILD DE PRODUCCIÓN: lo que hace 'npm run build'

// Paso 1: TypeScript (tsc -b)
// Vite primero ejecuta el compilador de TypeScript para verificar tipos.
// Si hay errores de TS, el build falla aquí. Esto es clave:
// en desarrollo Vite NO verifica tipos (por velocidad).

// Paso 2: Rollup bundle
// Rollup procesa todos los archivos y genera el bundle optimizado:
// - Tree shaking: elimina código no usado
// - Minificación: con esbuild (más rápido que Terser)
// - Code splitting: divide el bundle en chunks para carga lazy
// - Hashing de assets: genera nombres únicos (cache busting)

// Resultado de este proyecto (ejemplo):
// dist/
//   index.html                 0.82 kB
//   assets/
//     index-abc123.css        25 kB   ← todos los estilos
//     index-xyz789.js        248 kB   ← core: React + Router + componentes
//     EstadoPage-def456.js    14 kB   ← solo la página de Estado
//     JsxPage-ghi012.js       11 kB   ← solo la página de JSX
//     ... (un chunk por página, gracias a React.lazy)

// El code splitting funciona porque App.tsx usa React.lazy():
const EstadoPage = lazy(() => import('./pages/EstadoPage'));
// Rollup ve este import dinámico → genera un chunk separado
// El navegador descarga ese chunk SOLO cuando el usuario navega a /estado

// Preview del build:
// npm run preview → sirve el build de producción localmente
// Útil para verificar que todo funciona antes de deployar`;

export default function VitePage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Vite — Build Tool para React</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Vite es la herramienta que arranca el servidor de desarrollo, transforma el código
        y genera el build de producción de este sitio. Entender cómo funciona te da
        control total sobre tu proyecto React.
      </p>

      <InfoBox type="angular" title="Angular CLI vs Vite">
        En Angular, el Angular CLI (que usa Webpack/esbuild internamente) hace todo:
        <code>ng serve</code>, <code>ng build</code>, <code>ng test</code>. En React
        no hay un CLI oficial — tú eliges el build tool. <strong>Vite es el estándar
        de facto en 2026</strong> para proyectos React nuevos. Es más rápido que el
        Webpack que usaba Angular anteriormente y comparable al esbuild que usa Angular 17+.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Qué es Vite y por qué es tan rápido?</h2>
      <CodeBlock code={queEsVite} language="tsx" filename="que-es-vite.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Create React App vs Vite</h2>
      <p className="text-text-muted mb-4">
        Create React App (CRA) era la forma oficial de arrancar proyectos React.
        Está <strong>deprecado</strong> — ya no se mantiene. Vite es el reemplazo recomendado.
      </p>
      <CodeBlock code={comparacionCRA} language="tsx" filename="cra-vs-vite.ts" />

      <InfoBox type="warning" title="No uses Create React App en proyectos nuevos">
        Si buscas tutoriales de React y ves <code>npx create-react-app mi-app</code>, ese
        tutorial está desactualizado. El comando actualizado es{' '}
        <code>npm create vite@latest mi-app -- --template react-ts</code>.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">El <code>vite.config.ts</code> de este proyecto</h2>
      <p className="text-text-muted mb-4">
        Este es el archivo de configuración real que usa este sitio — explicado línea por línea.
      </p>
      <CodeBlock code={configProyecto} language="tsx" filename="vite.config.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Configuración extendida — opciones comunes</h2>
      <p className="text-text-muted mb-4">
        Estas son las opciones que más vas a necesitar en proyectos reales: alias de
        paths, proxy para APIs, y control del build.
      </p>
      <CodeBlock code={configExtendida} language="tsx" filename="vite.config.extended.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Variables de entorno</h2>
      <p className="text-text-muted mb-4">
        Vite maneja variables de entorno de forma diferente a Node.js y a Angular.
        Todo lo que empiece con <code>VITE_</code> es accesible en el cliente.
      </p>
      <CodeBlock code={envVars} language="tsx" filename=".env" />

      <h2 className="text-2xl font-bold mt-10 mb-4">HMR — Cómo Vite actualiza el código al instante</h2>
      <CodeBlock code={hmrExplicado} language="tsx" filename="hmr.ts" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Build de producción — qué pasa con <code>npm run build</code></h2>
      <p className="text-text-muted mb-4">
        El comando de build hace más de lo que parece. Aquí lo que ocurre paso a paso,
        usando este proyecto como ejemplo concreto.
      </p>
      <CodeBlock code={buildProd} language="tsx" filename="build-produccion.ts" />

      <InfoBox type="tip" title="Comandos esenciales de Vite">
        <ul className="list-disc list-inside space-y-1">
          <li><code>npm run dev</code> — dev server en <strong>localhost:5173</strong> con HMR</li>
          <li><code>npm run build</code> — verifica tipos (tsc) + bundle de producción en <code>dist/</code></li>
          <li><code>npm run preview</code> — sirve el build de producción localmente para verificarlo</li>
          <li><code>npm create vite@latest mi-app -- --template react-ts</code> — crear proyecto nuevo</li>
        </ul>
      </InfoBox>

      <InfoBox type="info" title="¿Por qué Vite NO hace type checking en desarrollo?">
        Vite usa <strong>esbuild</strong> para transpilar TypeScript — es 20-30x más rápido
        que <code>tsc</code>, pero esbuild simplemente <em>elimina</em> los tipos sin verificarlos.
        Esto hace que el HMR sea casi instantáneo. La verificación de tipos real corre en
        <code>npm run build</code> (que ejecuta <code>tsc -b</code> antes del bundle).
        Para type checking continuo en desarrollo, tu IDE (VSCode) usa el servidor de TypeScript
        en segundo plano.
      </InfoBox>
    </div>
  );
}
