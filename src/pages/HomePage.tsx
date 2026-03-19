import { Link } from 'react-router-dom';
import InfoBox from '../components/InfoBox';
import CodeBlock from '../components/CodeBlock';
import { ArrowRight, Code2, Box, Zap, Layers, Rocket } from 'lucide-react';

const angularVsReact = `// ─── Angular ───
// Angular usa módulos, decoradores y TypeScript obligatorio.
// Los componentes se definen con @Component y tienen
// template, styles y clase separados.

@Component({
  selector: 'app-saludo',
  template: '<h1>Hola {{ nombre }}</h1>',
  styles: ['h1 { color: blue; }']
})
export class SaludoComponent {
  nombre = 'Mundo';
}

// ─── React ───
// React usa funciones simples que retornan JSX.
// Todo vive en un solo archivo. No hay decoradores,
// no hay módulos, no hay selector.

function Saludo() {
  const nombre = 'Mundo';
  return <h1 style={{ color: 'blue' }}>Hola {nombre}</h1>;
}`;

const features = [
  {
    icon: Code2,
    title: 'JSX',
    desc: 'Escribe HTML dentro de JavaScript con superpoderes',
    path: '/jsx',
  },
  {
    icon: Box,
    title: 'Componentes',
    desc: 'Bloques reutilizables que construyen tu interfaz',
    path: '/componentes',
  },
  {
    icon: Zap,
    title: 'Hooks',
    desc: 'Estado, efectos y lógica reutilizable con funciones',
    path: '/estado',
  },
  {
    icon: Layers,
    title: 'Context API',
    desc: 'Comparte estado entre componentes sin prop drilling',
    path: '/context',
  },
  {
    icon: Rocket,
    title: 'React 19',
    desc: 'Las últimas novedades: Actions, use(), Server Components',
    path: '/react19',
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-react to-accent bg-clip-text text-transparent">
          React Mastery 2026
        </h1>
        <p className="text-xl text-text-muted leading-relaxed max-w-2xl">
          Tu guía completa para dominar React. Desde los fundamentos hasta las
          características más avanzadas de React 19+, con ejemplos prácticos y
          explicaciones claras.
        </p>
      </div>

      <InfoBox type="angular" title="Vienes de Angular — Perfecto">
        <p>
          Esta guía está pensada para ti. A lo largo de cada tema encontrarás
          comparaciones directas con Angular para que puedas relacionar
          conceptos que ya conoces. En Angular piensas en <strong>módulos,
          servicios e inyección de dependencias</strong>. En React todo se
          simplifica a <strong>funciones, props y hooks</strong>.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-2">Angular vs React — Primer vistazo</h2>
      <p className="text-text-muted mb-4">
        La diferencia fundamental: Angular es un <strong>framework completo</strong> (router,
        HTTP, forms, DI, todo incluido). React es una <strong>librería de UI</strong> que
        se enfoca exclusivamente en construir interfaces. Tú eliges las herramientas
        complementarias.
      </p>

      <CodeBlock code={angularVsReact} language="tsx" filename="angular-vs-react.tsx" />

      <div className="overflow-x-auto my-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-muted font-semibold">Concepto</th>
              <th className="text-left py-3 px-4 text-angular font-semibold">Angular</th>
              <th className="text-left py-3 px-4 text-react font-semibold">React</th>
            </tr>
          </thead>
          <tbody className="text-text-muted">
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">Tipo</td>
              <td className="py-3 px-4">Framework completo</td>
              <td className="py-3 px-4">Librería de UI</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">Lenguaje</td>
              <td className="py-3 px-4">TypeScript (obligatorio)</td>
              <td className="py-3 px-4">JavaScript/TypeScript (opcional)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">Templates</td>
              <td className="py-3 px-4">HTML + directivas (*ngIf, *ngFor)</td>
              <td className="py-3 px-4">JSX (JavaScript + HTML)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">Componentes</td>
              <td className="py-3 px-4">Clases con decoradores</td>
              <td className="py-3 px-4">Funciones simples</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">Estado</td>
              <td className="py-3 px-4">Propiedades de clase + Signals</td>
              <td className="py-3 px-4">useState / useReducer</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">DI / Servicios</td>
              <td className="py-3 px-4">Inyección de dependencias</td>
              <td className="py-3 px-4">Context API + Custom Hooks</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-text">Ciclo de vida</td>
              <td className="py-3 px-4">ngOnInit, ngOnDestroy, etc.</td>
              <td className="py-3 px-4">useEffect</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-text">Routing</td>
              <td className="py-3 px-4">@angular/router (integrado)</td>
              <td className="py-3 px-4">react-router-dom (externo)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-6">Temas del curso</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.path}
              to={f.path}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-surface-light hover:bg-surface-lighter/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors flex items-center gap-2">
                  {f.title}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-text-muted mt-1">{f.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <InfoBox type="tip" title="¿Cómo usar esta guía?">
        <p>
          Sigue los temas en orden desde la barra lateral. Cada sección tiene
          explicaciones detalladas, código que puedes copiar y probar, y
          comparaciones con Angular cuando es relevante. <strong>Todo el
          código es funcional</strong> — este mismo sitio está construido con React.
        </p>
      </InfoBox>
    </div>
  );
}
