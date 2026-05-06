import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const portalBasico = `import { createPortal } from 'react-dom';

// ¿QUÉ PROBLEMA RESUELVEN los Portals?
// Imagina un modal dentro de un contenedor con overflow: hidden.
// El modal se recorta porque el CSS del padre lo limita.
// O un tooltip dentro de un div con z-index bajo — queda tapado.
// Portals resuelven esto: renderizas el componente en OTRO lugar del DOM
// (como document.body), evitando las restricciones CSS del padre.
//
// ¿CÓMO FUNCIONA internamente?
// createPortal(qué, dónde) hace DOS cosas:
// 1. En el DOM real: monta el elemento en el nodo destino (ej: body)
// 2. En el árbol React: el componente sigue siendo hijo de su padre
//    → Context, eventos, y todo el sistema React funciona normal
//
// Es como teletransportar el HTML a otro lugar, pero manteniendo
// la "ciudadanía" React del componente original.

function Modal({ abierto, onCerrar, children }: {
  abierto: boolean;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
  if (!abierto) return null;

  return createPortal(
    // overlay = fondo oscuro que cubre toda la pantalla
    <div className="modal-overlay" onClick={onCerrar}>
      {/* stopPropagation evita que click en el contenido cierre el modal */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onCerrar} className="modal-close">✕</button>
        {children}
      </div>
    </div>,
    document.body  // ← destino DOM: se monta como hijo directo de <body>
  );
}

// Uso:
function App() {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="overflow-hidden"> {/* overflow NO afecta al modal */}
      <button onClick={() => setMostrar(true)}>Abrir Modal</button>
      <Modal abierto={mostrar} onCerrar={() => setMostrar(false)}>
        <h2>Soy un modal</h2>
        <p>Mi HTML está en document.body (fuera de este div).</p>
        <p>Pero en React sigo siendo hijo de App → Context funciona.</p>
      </Modal>
    </div>
    // En el DOM real:
    // <body>
    //   <div id="root">
    //     <div class="overflow-hidden">...</div>  ← App
    //   </div>
    //   <div class="modal-overlay">...</div>  ← Modal (portal)
    // </body>
  );
}`;

const eventBubbling = `// ¿CÓMO funcionan los EVENTOS con Portals?
//
// Dato clave: los eventos React bubblean por el ÁRBOL REACT,
// NO por el árbol DOM. Esto significa que un onClick en un portal
// puede ser atrapado por un componente padre de React, aunque
// en el DOM estén en lugares completamente diferentes.

function Padre() {
  // Este onClick atrapa clicks de TODOS los hijos React,
  // incluyendo los que están en un portal
  const handleClick = () => console.log('Click atrapado en Padre');

  return (
    <div onClick={handleClick}>
      <p>Contenido del padre</p>
      <ModalPortal>
        <button>Click aquí</button>
        {/* Este button está en document.body en el DOM,
            pero el click bubbles hasta Padre en React */}
      </ModalPortal>
    </div>
  );
}

// ¿POR QUÉ es útil?
// Porque puedes tener un portal (modal, tooltip) que sigue
// participando en el sistema de eventos de su componente padre.
// No necesitas pasar callbacks extra — el event bubbling funciona.

// ¿POR QUÉ React lo diseñó así?
// Para mantener la CONSISTENCIA. Un portal es conceptualmente
// un hijo de su componente padre en React. Si los eventos no
// bubblearan, romperías patrones como formularios con modales,
// context menus, etc.`;

const portalTooltip = `// Tooltip con Portal — evita problemas de overflow y z-index
//
// ¿POR QUÉ un tooltip necesita un portal?
// Sin portal: el tooltip es hijo DOM del elemento que lo activa.
// Si ese elemento está dentro de un contenedor con overflow: hidden
// o un z-index bajo, el tooltip se recorta o queda tapado.
// Con portal: el tooltip se renderiza en document.body → siempre
// visible, sin restricciones CSS del padre.
//
// ¿CÓMO se posiciona?
// 1. Usamos useRef para obtener referencia al elemento trigger
// 2. getBoundingClientRect() nos da su posición en la pantalla
// 3. Posicionamos el tooltip absolutamente respecto al body

function Tooltip({ children, texto }: {
  children: React.ReactNode;
  texto: string;
}) {
  const [visible, setVisible] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const mostrar = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosicion({
        top: rect.bottom + window.scrollY + 8,  // 8px debajo del elemento
        left: rect.left + window.scrollX + rect.width / 2, // centrado
      });
    }
    setVisible(true);
  };

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={mostrar}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>
      {visible && createPortal(
        <div
          className="tooltip"
          style={{ position: 'absolute', top: posicion.top, left: posicion.left }}
        >
          {texto}
        </div>,
        document.body  // Se renderiza en body, no en el padre
      )}
    </>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/Modal.tsx
// Ejemplo COMPLETO: Modal con Portal, accesibilidad, y focus trap
// ============================================
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Focus trap: enfocar el modal al abrirse
    modalRef.current?.focus();
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Modal */}
      <div ref={modalRef} tabIndex={-1}
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
            aria-label="Cerrar">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// 📁 src/App.tsx (uso)
// import { useState } from 'react';
// import Modal from './components/Modal';
//
// function App() {
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <div>
//       <button onClick={() => setShowModal(true)}>Abrir modal</button>
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirmar">
//         <p>¿Estás seguro de continuar?</p>
//         <div className="flex gap-2 mt-4">
//           <button onClick={() => setShowModal(false)}
//             className="px-4 py-2 bg-blue-500 text-white rounded">Sí</button>
//           <button onClick={() => setShowModal(false)}
//             className="px-4 py-2 border rounded">Cancelar</button>
//         </div>
//       </Modal>
//     </div>
//   );
// }`;

export default function PortalsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Portals</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los Portals permiten renderizar componentes <strong>fuera del nodo DOM padre</strong>,
        pero manteniendo el contexto de React (eventos, context, etc.). Resuelven un
        problema práctico de CSS: cuando <code>overflow: hidden</code>, <code>z-index</code>,
        o <code>transform</code> del padre interfieren con la UI de componentes como
        modales, tooltips y dropdowns.
      </p>

      <InfoBox type="angular" title="Angular CDK Overlay vs React Portals">
        <p>
          Angular tiene <code>CDK Overlay</code> del Angular Material que hace algo similar:
          renderiza overlays fuera del componente. En React usas <code>createPortal</code> de
          <code> react-dom</code> directamente. La diferencia: CDK Overlay es una librería con
          posicionamiento automático incluido; en React es una primitiva de bajo nivel — tú
          manejas el posicionamiento.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Modal con Portal — El caso de uso más común</h2>
      <p className="text-text-muted mb-4">
        Un modal necesita cubrir toda la pantalla. Si es hijo DOM de un contenedor con
        <code> overflow: hidden</code>, se recorta. El portal lo "teletransporta" a
        <code> document.body</code>, evitando cualquier restricción CSS del padre.
      </p>
      <CodeBlock code={portalBasico} language="tsx" filename="portal-modal.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Event Bubbling — El detalle que sorprende</h2>
      <p className="text-text-muted mb-4">
        Los eventos React bubblean por el <strong>árbol React</strong>, no por el árbol DOM.
        Un click en un portal puede ser atrapado por su padre React aunque en el DOM estén
        en lugares completamente diferentes. React lo diseñó así para mantener la consistencia.
      </p>
      <CodeBlock code={eventBubbling} language="tsx" filename="event-bubbling-portal.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tooltip con Portal — Posicionamiento manual</h2>
      <p className="text-text-muted mb-4">
        Los tooltips necesitan aparecer sobre cualquier contenido. Con un portal + 
        <code> getBoundingClientRect()</code> puedes posicionarlos con precisión sin que
        ningún contenedor los recorte.
      </p>
      <CodeBlock code={portalTooltip} language="tsx" filename="portal-tooltip.tsx" />

      <InfoBox type="warning" title="Cuidado con la accesibilidad">
        Los portals mueven el HTML fuera del flujo normal del DOM, lo que puede confundir
        a lectores de pantalla. Para modales: usa <code>role="dialog"</code>,
        <code> aria-modal="true"</code>, y maneja el focus trap (atrapar el tab dentro del modal).
        Librerías como <strong>Radix UI</strong> o <strong>Headless UI</strong> ya manejan esto.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Portals">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>createPortal(qué, dónde)</strong> — renderiza JSX en otro nodo DOM</li>
          <li><strong>Problema que resuelven</strong>: overflow, z-index, transform del padre</li>
          <li><strong>Árbol React intacto</strong> — Context, eventos, y todo sigue funcionando</li>
          <li><strong>Eventos bubblean por React</strong>, no por DOM — un click en portal llega al padre React</li>
          <li><strong>Casos de uso</strong>: modales, tooltips, dropdowns, notificaciones</li>
          <li><strong>Accesibilidad</strong>: usar ARIA roles y focus management</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Modal accesible con Portal: overlay, Escape para cerrar, focus trap, bloqueo de scroll,
        aria-modal, y click fuera para cerrar.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/Modal.tsx" />
    </div>
  );
}
