import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const cssInline = `// 1. ESTILOS INLINE
// Objeto JavaScript, propiedades en camelCase

function Caja() {
  const estilos: React.CSSProperties = {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  return <div style={estilos}>Hola</div>;
}

// Estilos dinámicos inline:
function Boton({ activo }: { activo: boolean }) {
  return (
    <button
      style={{
        backgroundColor: activo ? '#3b82f6' : '#334155',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      {activo ? 'Activo' : 'Inactivo'}
    </button>
  );
}

// ✅ Úsalos para: estilos completamente dinámicos (calculados en runtime)
// ❌ Evita para: estilos estáticos (mejor CSS Modules o Tailwind)`;

const cssModules = `// 2. CSS MODULES
// Archivos .module.css con clases con scope automático (no colisionan)

// ─── Boton.module.css ───
// .boton {
//   padding: 8px 16px;
//   border-radius: 6px;
//   cursor: pointer;
// }
// .primario {
//   background-color: #3b82f6;
//   color: white;
// }
// .secundario {
//   background-color: #334155;
//   color: #e2e8f0;
// }

// ─── Boton.tsx ───
import styles from './Boton.module.css';

function Boton({ variante = 'primario', children }: {
  variante?: 'primario' | 'secundario';
  children: React.ReactNode;
}) {
  return (
    <button className={\`\${styles.boton} \${styles[variante]}\`}>
      {children}
    </button>
  );
}

// ✅ Las clases se transforman en algo único: "Boton_boton__xK2mP"
// Nunca colisionan con otras clases del mismo nombre en otros archivos.

// ✅ Úsalos para: estilos complejos, animaciones, pseudo-elementos
// ✅ Buena opción si vienes de Angular (similar a styles con ViewEncapsulation)`;

const tailwindReact = `// 3. TAILWIND CSS — La opción más popular en 2026

// Clases utilitarias directamente en el JSX.
// No hay que escribir CSS, todo se hace con clases predefinidas.

function TarjetaProducto({ nombre, precio, imagen }: {
  nombre: string;
  precio: number;
  imagen: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg">
      <img src={imagen} alt={nombre} className="w-full rounded-lg object-cover h-48" />
      <h3 className="mt-3 text-lg font-semibold text-white">{nombre}</h3>
      <p className="text-2xl font-bold text-blue-400">\${precio}</p>
      <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white 
                         font-medium hover:bg-blue-500 transition-colors">
        Agregar al carrito
      </button>
    </div>
  );
}

// Clases dinámicas con Tailwind — usa template literals
function Alerta({ tipo }: { tipo: 'exito' | 'error' | 'info' }) {
  const colores = {
    exito: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={\`rounded-lg border p-4 \${colores[tipo]}\`}>
      Mensaje de {tipo}
    </div>
  );
}`;

const cva = `// 4. VARIANTES CON CLASS-VARIANCE-AUTHORITY (CVA)
// Librería para manejar variantes de componentes con Tailwind

// npm install class-variance-authority clsx tailwind-merge

import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combinar clases de forma segura (maneja conflictos de Tailwind)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Definir variantes del botón
const botonVariantes = cva(
  // Clases base (siempre aplicadas)
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  {
    variants: {
      variante: {
        primario: 'bg-blue-600 text-white hover:bg-blue-500',
        secundario: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
        destructivo: 'bg-red-600 text-white hover:bg-red-500',
      },
      tamaño: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variante: 'primario',
      tamaño: 'md',
    },
  }
);

interface BotonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof botonVariantes> {}

function Boton({ variante, tamaño, className, ...props }: BotonProps) {
  return (
    <button
      className={cn(botonVariantes({ variante, tamaño }), className)}
      {...props}
    />
  );
}

// Uso claro y type-safe
<Boton variante="primario" tamaño="lg">Guardar</Boton>
<Boton variante="destructivo" tamaño="sm">Eliminar</Boton>`;

const styledComponents = `// 5. STYLED COMPONENTS / EMOTION (CSS-in-JS)
// npm install styled-components @types/styled-components

import styled from 'styled-components';

// Crear componentes con estilos embebidos
const Boton = styled.button<{ primario?: boolean }>\`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  background-color: \${props => props.primario ? '#3b82f6' : '#334155'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
  
  /* Media queries normales */
  @media (max-width: 768px) {
    width: 100%;
  }
\`;

const Tarjeta = styled.div\`
  border-radius: 12px;
  border: 1px solid #334155;
  padding: 16px;
  
  /* Anidar selectores como SCSS */
  h2 {
    color: #e2e8f0;
    margin-bottom: 8px;
  }
\`;

function App() {
  return (
    <Tarjeta>
      <h2>Título</h2>
      <Boton primario>Primario</Boton>
      <Boton>Secundario</Boton>
    </Tarjeta>
  );
}

// ⚠️ CSS-in-JS tiene overhead en runtime. En 2026 se prefiere
// Tailwind o CSS Modules por rendimiento.`;

export default function EstilosPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Estilos en React</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        A diferencia de Angular que tiene estilos encapsulados por defecto, React no
        tiene una opinión sobre estilos. Hay 5 enfoques principales, cada uno con sus
        ventajas.
      </p>

      <InfoBox type="angular" title="Angular styles vs React">
        Angular encapsula estilos automáticamente por componente (<code>ViewEncapsulation.Emulated</code>).
        En React no hay encapsulación automática — los estilos son globales a menos que uses
        CSS Modules o CSS-in-JS. <strong>Tailwind CSS</strong> es el estándar dominante en el
        ecosistema React en 2026.
      </InfoBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
        {[
          { name: '1. Inline styles', desc: 'Objetos JS directos', when: 'Estilos dinámicos en runtime' },
          { name: '2. CSS Modules', desc: '.module.css con scope automático', when: 'Estilos complejos sin colisiones' },
          { name: '3. Tailwind CSS', desc: 'Clases utilitarias en JSX', when: 'La opción más popular en 2026' },
          { name: '4. CVA + Tailwind', desc: 'Variantes type-safe', when: 'Librerías de componentes' },
          { name: '5. Styled Components', desc: 'CSS-in-JS en runtime', when: 'Legacy, menos popular hoy' },
        ].map(item => (
          <div key={item.name} className="p-4 rounded-lg bg-surface-light border border-border">
            <p className="font-semibold text-text">{item.name}</p>
            <p className="text-sm text-text-muted">{item.desc}</p>
            <p className="text-xs text-primary mt-1">Úsalo para: {item.when}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">1. Estilos inline</h2>
      <CodeBlock code={cssInline} language="tsx" filename="estilos-inline.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">2. CSS Modules</h2>
      <CodeBlock code={cssModules} language="tsx" filename="css-modules.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">3. Tailwind CSS</h2>
      <p className="text-text-muted mb-4">
        La opción más popular en el ecosistema React. Clases utilitarias directamente
        en el JSX, sin archivos CSS separados.
      </p>
      <CodeBlock code={tailwindReact} language="tsx" filename="tailwind.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">4. CVA + Tailwind (para librerías de componentes)</h2>
      <CodeBlock code={cva} language="tsx" filename="cva-tailwind.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">5. Styled Components (CSS-in-JS)</h2>
      <CodeBlock code={styledComponents} language="tsx" filename="styled-components.tsx" />

      <InfoBox type="tip" title="¿Qué usar en 2026?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Tailwind CSS</strong>: primera opción para la mayoría de proyectos</li>
          <li><strong>CSS Modules</strong>: si prefieres CSS tradicional con scope</li>
          <li><strong>CVA + Tailwind + shadcn/ui</strong>: para librerías o design systems</li>
          <li><strong>Styled Components/Emotion</strong>: legacy, evitar en proyectos nuevos</li>
          <li><strong>Inline styles</strong>: solo para valores calculados en runtime</li>
        </ul>
      </InfoBox>
    </div>
  );
}
