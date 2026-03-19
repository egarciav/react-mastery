import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const controlado = `// COMPONENTES CONTROLADOS: React controla el valor del input
// El estado de React es la "fuente de verdad"

function FormControlado() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* value + onChange = componente controlado */}
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}`;

const noControlado = `// COMPONENTES NO CONTROLADOS: el DOM mantiene el estado
// Usas useRef para leer el valor cuando lo necesitas

function FormNoControlado() {
  const nombreRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nombre: nombreRef.current?.value,
      email: emailRef.current?.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Sin value ni onChange — el DOM controla el valor */}
      <input ref={nombreRef} defaultValue="" placeholder="Nombre" />
      <input ref={emailRef} defaultValue="" placeholder="Email" />
      <button type="submit">Enviar</button>
    </form>
  );
}

// ¿Cuándo usar cada uno?
// Controlado: validación en tiempo real, campos dependientes
// No controlado: formularios simples, integración con libs externas`;

const formCompleto = `// Formulario completo con validación

interface FormData {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  acepta: boolean;
}

interface Errores {
  nombre?: string;
  email?: string;
  password?: string;
}

function FormularioRegistro() {
  const [form, setForm] = useState<FormData>({
    nombre: '', email: '', password: '', rol: 'usuario', acepta: false,
  });
  const [errores, setErrores] = useState<Errores>({});

  // Handler genérico para todos los campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validar = (): boolean => {
    const nuevosErrores: Errores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
    if (!form.email.includes('@')) nuevosErrores.email = 'Email inválido';
    if (form.password.length < 6) nuevosErrores.password = 'Mínimo 6 caracteres';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      console.log('Datos válidos:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        {errores.nombre && <span className="error">{errores.nombre}</span>}
      </div>
      <div>
        <input name="email" value={form.email} onChange={handleChange} />
        {errores.email && <span className="error">{errores.email}</span>}
      </div>
      <div>
        <input name="password" type="password" value={form.password}
               onChange={handleChange} />
        {errores.password && <span className="error">{errores.password}</span>}
      </div>
      <select name="rol" value={form.rol} onChange={handleChange}>
        <option value="usuario">Usuario</option>
        <option value="admin">Admin</option>
      </select>
      <label>
        <input name="acepta" type="checkbox" checked={form.acepta}
               onChange={handleChange} />
        Acepto los términos
      </label>
      <button type="submit" disabled={!form.acepta}>Registrar</button>
    </form>
  );
}`;

export default function FormulariosPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Formularios</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React ofrece dos enfoques para formularios: <strong>controlados</strong> (React
        maneja el estado) y <strong>no controlados</strong> (el DOM lo maneja). Los
        controlados son el estándar.
      </p>

      <InfoBox type="angular">
        Angular tiene <code>FormsModule</code> (template-driven) y <code>ReactiveFormsModule</code>.
        En React no hay módulos especiales — usas <code>useState</code> + <code>onChange</code> para
        formularios controlados, o <code>useRef</code> para no controlados. React 19 añade Actions
        que simplifican aún más los forms.
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Formulario controlado</h2>
      <CodeBlock code={controlado} language="tsx" filename="form-controlado.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Formulario no controlado</h2>
      <CodeBlock code={noControlado} language="tsx" filename="form-no-controlado.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Formulario completo con validación</h2>
      <CodeBlock code={formCompleto} language="tsx" filename="form-validacion.tsx" />

      <InfoBox type="tip" title="Tip para forms grandes">
        Para formularios grandes, considera: <strong>useReducer</strong> para el estado,
        o librerías como <code>react-hook-form</code> que combinan lo mejor de ambos enfoques.
        React 19 también añade <code>useActionState</code> para forms con server actions.
      </InfoBox>
    </div>
  );
}
