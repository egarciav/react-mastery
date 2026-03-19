import { NavLink } from 'react-router-dom';
import {
  Home, Code2, Box, ArrowRightLeft, Database, Zap,
  Link2, Brain, Repeat, RefreshCw, Layers, FormInput,
  List, GitBranch, AlertCircle, Pause, DoorOpen,
  Puzzle, Rocket, BookOpen, X, Menu, Route,
  Cpu, FlaskConical, Paintbrush, FileCode2, Hash,
  Timer, Wrench
} from 'lucide-react';
import { useState } from 'react';

const sections = [
  {
    title: 'Inicio',
    items: [
      { path: '/', label: 'Bienvenida', icon: Home },
    ],
  },
  {
    title: 'Cómo funciona React',
    items: [
      { path: '/ciclo-renderizado', label: 'Ciclo de Renderizado', icon: Cpu },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { path: '/jsx', label: 'JSX', icon: Code2 },
      { path: '/componentes', label: 'Componentes', icon: Box },
      { path: '/props', label: 'Props', icon: ArrowRightLeft },
      { path: '/estado', label: 'Estado (useState)', icon: Database },
      { path: '/eventos', label: 'Eventos', icon: Zap },
      { path: '/renderizado-condicional', label: 'Renderizado Condicional', icon: GitBranch },
      { path: '/listas-keys', label: 'Listas y Keys', icon: List },
    ],
  },
  {
    title: 'Hooks Esenciales',
    items: [
      { path: '/useeffect', label: 'useEffect', icon: RefreshCw },
      { path: '/useref', label: 'useRef', icon: Link2 },
      { path: '/usememo-usecallback', label: 'useMemo y useCallback', icon: Brain },
      { path: '/usetransition', label: 'useTransition / useDeferredValue', icon: Timer },
      { path: '/hooks-restantes', label: 'Hooks Restantes', icon: Wrench },
      { path: '/custom-hooks', label: 'Custom Hooks', icon: Puzzle },
    ],
  },
  {
    title: 'Gestión de Estado',
    items: [
      { path: '/context', label: 'Context API', icon: Layers },
      { path: '/usereducer', label: 'useReducer', icon: Repeat },
    ],
  },
  {
    title: 'Formularios y UI',
    items: [
      { path: '/formularios', label: 'Formularios', icon: FormInput },
      { path: '/estilos', label: 'Estilos en React', icon: Paintbrush },
    ],
  },
  {
    title: 'Ecosistema',
    items: [
      { path: '/react-router', label: 'React Router', icon: Route },
      { path: '/typescript-react', label: 'TypeScript con React', icon: FileCode2 },
      { path: '/testing', label: 'Testing', icon: FlaskConical },
    ],
  },
  {
    title: 'Patrones Avanzados',
    items: [
      { path: '/error-boundaries', label: 'Error Boundaries', icon: AlertCircle },
      { path: '/suspense-lazy', label: 'Suspense y Lazy', icon: Pause },
      { path: '/portals', label: 'Portals', icon: DoorOpen },
      { path: '/patrones', label: 'Patrones de Composición', icon: Hash },
    ],
  },
  {
    title: 'React 19+',
    items: [
      { path: '/react19', label: 'Novedades React 19', icon: Rocket },
      { path: '/server-components', label: 'Server Components', icon: BookOpen },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-surface-light border border-border rounded-lg p-2 text-text hover:bg-surface-lighter transition-colors cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-surface-light border-r border-border z-40 overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-bold text-react flex items-center gap-2">
            <span className="text-2xl">⚛️</span> React Mastery
          </h1>
          <p className="text-xs text-text-muted mt-1">Guía Completa 2026</p>
        </div>

        <nav className="p-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">
                {section.title}
              </h3>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-0.5 ${
                        isActive
                          ? 'bg-primary/15 text-primary font-medium'
                          : 'text-text-muted hover:bg-surface-lighter/50 hover:text-text'
                      }`
                    }
                    end={item.path === '/'}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
