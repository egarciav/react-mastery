import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const mapBasico = `// .map() es el equivalente de *ngFor en React
const frutas = ['Manzana', 'Banana', 'Cereza'];

function ListaFrutas() {
  return (
    <ul>
      {frutas.map((fruta, index) => (
        <li key={index}>{fruta}</li>
      ))}
    </ul>
  );
}`;

const keysImportancia = `// ⚠️ KEY es OBLIGATORIA y debe ser ÚNICA y ESTABLE

interface Usuario { id: number; nombre: string; }
const usuarios: Usuario[] = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Bob' },
];

function Lista() {
  return (
    <ul>
      {/* ✅ Usa un ID único y estable */}
      {usuarios.map(u => <li key={u.id}>{u.nombre}</li>)}

      {/* ❌ index como key: problemas al reordenar/eliminar */}
      {usuarios.map((u, i) => <li key={i}>{u.nombre}</li>)}

      {/* ❌ Sin key: React da warning y rendimiento malo */}
      {usuarios.map(u => <li>{u.nombre}</li>)}

      {/* ❌ Key aleatoria: se regenera en cada render */}
      {usuarios.map(u => <li key={Math.random()}>{u.nombre}</li>)}
    </ul>
  );
}`;

const listaComponentes = `interface Producto {
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
          key={p.id}       // key va en el componente MÁS EXTERNO del map
          producto={p}
          onEliminar={eliminar}
        />
      ))}
    </div>
  );
}`;

export default function ListasKeysPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Listas y Keys</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        Para renderizar listas en React usas <code>.map()</code> de JavaScript.
        Cada elemento necesita una <strong>key</strong> única para que React pueda
        trackear cambios eficientemente.
      </p>

      <InfoBox type="angular">
        Angular: <code>*ngFor="let item of items"</code> o <code>@for (item of items; track item.id)</code>.
        React: <code>items.map(item =&gt; &lt;Item key=&#123;item.id&#125; /&gt;)</code>. Similar concepto, diferente sintaxis.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">map() básico</h2>
      <CodeBlock code={mapBasico} language="tsx" filename="map-basico.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">¿Por qué son importantes las Keys?</h2>
      <p className="text-text-muted mb-4">
        Las keys ayudan a React a identificar qué elementos cambiaron, se agregaron
        o se eliminaron. Sin keys correctas, React re-renderiza toda la lista
        innecesariamente.
      </p>
      <CodeBlock code={keysImportancia} language="tsx" filename="keys.tsx" />

      <InfoBox type="warning" title="Reglas de keys">
        <ul className="list-disc list-inside space-y-1">
          <li>Deben ser <strong>únicas</strong> entre hermanos</li>
          <li>Deben ser <strong>estables</strong> (no cambiar entre renders)</li>
          <li>Usa IDs de tus datos, NO el index del array</li>
          <li>NUNCA uses <code>Math.random()</code> como key</li>
          <li>Index está OK solo si la lista es estática y nunca se reordena</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Listas con componentes</h2>
      <p className="text-text-muted mb-4">
        Lo más común: mapear datos a componentes. La key va en el componente
        más externo dentro del map.
      </p>
      <CodeBlock code={listaComponentes} language="tsx" filename="lista-componentes.tsx" />
    </div>
  );
}
