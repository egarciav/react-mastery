import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const setup = `# Instalación con Vite + Vitest (recomendado en 2026)
npm install -D vitest @testing-library/react @testing-library/user-event
npm install -D @testing-library/jest-dom jsdom

# En vite.config.ts agregar:
# test: {
#   environment: 'jsdom',
#   globals: true,
#   setupFiles: './src/test/setup.ts',
# }

# src/test/setup.ts:
# import '@testing-library/jest-dom';`;

const primerasPruebas = `// Primer test: renderizar y verificar contenido

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Componente a probar
function Saludo({ nombre }: { nombre: string }) {
  return <h1>Hola, {nombre}</h1>;
}

describe('Saludo', () => {
  it('muestra el nombre correctamente', () => {
    render(<Saludo nombre="María" />);

    // getByText: busca por texto exacto
    expect(screen.getByText('Hola, María')).toBeInTheDocument();
  });

  it('renderiza un h1', () => {
    render(<Saludo nombre="Carlos" />);

    // getByRole: busca por rol de accesibilidad (semántico)
    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent('Hola, Carlos');
  });
});`;

const queries = `// Queries de Testing Library — cómo encontrar elementos

// ─── Prioridad de queries (orden recomendado) ───
// 1. getByRole — rol de accesibilidad (button, heading, input, etc.)
screen.getByRole('button', { name: /enviar/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('heading', { level: 2 });
screen.getByRole('checkbox', { name: /acepto/i });

// 2. getByLabelText — busca por el label del input
screen.getByLabelText('Email');
screen.getByLabelText(/contraseña/i);

// 3. getByPlaceholderText — por placeholder
screen.getByPlaceholderText('Buscar...');

// 4. getByText — por contenido de texto
screen.getByText('Bienvenido');
screen.getByText(/cargando/i);  // regex = case insensitive

// 5. getByDisplayValue — valor de input/select/textarea
screen.getByDisplayValue('opcion1');

// 6. getByTestId — última opción (data-testid="mi-elemento")
screen.getByTestId('spinner');

// ─── Variantes ───
// getBy... → falla si no encuentra o encuentra más de uno
// queryBy... → retorna null si no encuentra (para aserciones negativas)
// getAllBy... → retorna array, falla si no encuentra ninguno
// findBy... → asíncrono, espera hasta que aparezca

const boton = screen.getByRole('button');          // lanza si no existe
const boton2 = screen.queryByRole('button');       // null si no existe
const botones = screen.getAllByRole('button');      // array
const elemento = await screen.findByText('Cargado'); // async`;

const interacciones = `// Simular interacciones del usuario con userEvent

import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

function Contador() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Incrementar</button>
    </div>
  );
}

describe('Contador', () => {
  it('incrementa al hacer click', async () => {
    const user = userEvent.setup();
    render(<Contador />);

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    // userEvent simula interacción real del usuario
    await user.click(screen.getByRole('button', { name: 'Incrementar' }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});

// Escribir en un input:
it('actualiza el input al escribir', async () => {
  const user = userEvent.setup();
  render(<input placeholder="Nombre" />);

  const input = screen.getByPlaceholderText('Nombre');
  await user.type(input, 'María');

  expect(input).toHaveValue('María');
});`;

const async = `// Probar componentes asíncronos (fetch, useEffect)

import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Componente que hace fetch
function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/usuarios')
      .then(r => r.json())
      .then(data => { setUsuarios(data); setCargando(false); });
  }, []);

  if (cargando) return <p>Cargando...</p>;
  return <ul>{usuarios.map(u => <li key={u}>{u}</li>)}</ul>;
}

describe('ListaUsuarios', () => {
  it('muestra spinner y luego usuarios', async () => {
    // Mock de fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(['Ana', 'Bob', 'Carlos']),
    });

    render(<ListaUsuarios />);

    // Verificar estado de carga
    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    // Esperar a que aparezca el contenido asíncrono
    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
    });

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
  });
});`;

const mockContext = `// Probar componentes que usan Context

import { render, screen } from '@testing-library/react';

// El componente usa AuthContext
function NavBar() {
  const { user } = useAuth();
  return user ? <p>Hola, {user.nombre}</p> : <a href="/login">Entrar</a>;
}

// Helper para renderizar con providers
function renderConProviders(
  ui: React.ReactElement,
  { user = null }: { user?: User | null } = {}
) {
  return render(
    <AuthContext.Provider value={{ user, login: vi.fn(), logout: vi.fn() }}>
      {ui}
    </AuthContext.Provider>
  );
}

describe('NavBar', () => {
  it('muestra link de login si no hay sesión', () => {
    renderConProviders(<NavBar />, { user: null });
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('muestra nombre del usuario con sesión activa', () => {
    renderConProviders(<NavBar />, {
      user: { nombre: 'María', id: 1 }
    });
    expect(screen.getByText('Hola, María')).toBeInTheDocument();
  });
});`;

export default function TestingPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Testing en React</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        El stack estándar de testing en React en 2026: <strong>Vitest</strong> (test runner)
        + <strong>React Testing Library</strong> (RTL). La filosofía de RTL es probar
        el comportamiento del usuario, no los detalles de implementación.
      </p>

      <InfoBox type="angular" title="Angular Testing vs React Testing">
        Angular usa Karma + Jasmine con TestBed para configurar módulos. React usa
        Vitest/Jest + React Testing Library. La diferencia clave: Angular testa más la
        implementación interna; RTL testa desde la perspectiva del <strong>usuario final</strong>:
        ¿qué ve? ¿qué puede hacer? No importa cómo está implementado internamente.
      </InfoBox>

      <InfoBox type="info" title="Filosofía de React Testing Library">
        "Cuanto más tus tests se parezcan a cómo tu software es usado, más confianza
        te darán." — Kent C. Dodds. Por eso RTL prioriza buscar por <strong>roles de accesibilidad</strong>
        (<code>getByRole</code>) en vez de por clases CSS o estructura del DOM.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Setup con Vitest</h2>
      <CodeBlock code={setup} language="bash" filename="setup.sh" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Primeros tests</h2>
      <CodeBlock code={primerasPruebas} language="tsx" filename="saludo.test.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Queries — Cómo encontrar elementos</h2>
      <CodeBlock code={queries} language="tsx" filename="queries.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Simular interacciones</h2>
      <CodeBlock code={interacciones} language="tsx" filename="interacciones.test.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Tests asíncronos</h2>
      <CodeBlock code={async} language="tsx" filename="async.test.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Probar componentes con Context</h2>
      <CodeBlock code={mockContext} language="tsx" filename="context.test.tsx" />

      <InfoBox type="tip" title="Buenas prácticas de testing en React">
        <ul className="list-disc list-inside space-y-1">
          <li>Usa <code>getByRole</code> primero — es el más accesible y semántico</li>
          <li><strong>No testees detalles de implementación</strong> (nombres de funciones, estado interno)</li>
          <li>Usa <code>userEvent</code> en vez de <code>fireEvent</code> — simula mejor al usuario real</li>
          <li>Crea un helper <code>renderConProviders</code> para componentes que usan Context/Router</li>
          <li>Prefiere tests de <strong>integración</strong> (varios componentes juntos) sobre unitarios aislados</li>
        </ul>
      </InfoBox>
    </div>
  );
}
