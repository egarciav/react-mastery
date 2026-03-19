import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const portalBasico = `import { createPortal } from 'react-dom';

// Un Portal renderiza un componente FUERA del árbol DOM padre,
// pero DENTRO del árbol React (los eventos siguen propagándose).

// Caso de uso principal: modales, tooltips, dropdowns

function Modal({ abierto, onCerrar, children }: {
  abierto: boolean;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
  if (!abierto) return null;

  // createPortal(qué renderizar, dónde renderizarlo)
  return createPortal(
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onCerrar} className="modal-close">✕</button>
        {children}
      </div>
    </div>,
    document.body  // Se renderiza directamente en el body
  );
}

// Uso:
function App() {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="overflow-hidden"> {/* overflow no afecta al modal */}
      <button onClick={() => setMostrar(true)}>Abrir Modal</button>
      <Modal abierto={mostrar} onCerrar={() => setMostrar(false)}>
        <h2>Soy un modal</h2>
        <p>Estoy renderizado en document.body, fuera de mi padre.</p>
        <p>Pero los eventos React siguen funcionando normalmente.</p>
      </Modal>
    </div>
  );
}`;

const portalTooltip = `// Tooltip con Portal — evita problemas de overflow y z-index

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
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
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
        document.body
      )}
    </>
  );
}`;

export default function PortalsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Portals</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Los Portals permiten renderizar componentes <strong>fuera del nodo DOM padre</strong>,
        pero manteniendo el contexto de React (eventos, context, etc.). Ideales para
        modales, tooltips y dropdowns.
      </p>

      <InfoBox type="angular">
        Angular tiene <code>CDK Overlay</code> para esto. En React usas <code>createPortal</code>{' '}
        de <code>react-dom</code>. El componente se renderiza en otro lugar del DOM pero sigue
        siendo parte del árbol React.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Modal con Portal</h2>
      <CodeBlock code={portalBasico} language="tsx" filename="portal-modal.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tooltip con Portal</h2>
      <CodeBlock code={portalTooltip} language="tsx" filename="portal-tooltip.tsx" />

      <InfoBox type="info" title="¿Cuándo usar Portals?">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Modales</strong> — para evitar problemas de overflow y z-index</li>
          <li><strong>Tooltips</strong> — necesitan posicionarse sobre cualquier contenido</li>
          <li><strong>Dropdowns</strong> — cuando el padre tiene overflow:hidden</li>
          <li><strong>Notificaciones</strong> — toasts que se muestran sobre todo</li>
        </ul>
      </InfoBox>
    </div>
  );
}
