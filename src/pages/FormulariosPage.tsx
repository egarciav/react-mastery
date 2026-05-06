import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

const controlado = `// COMPONENTES CONTROLADOS: React es la "fuente de verdad" del valor
//
// ¿CÓMO FUNCIONA?
// 1. El valor del input viene del ESTADO de React (value={nombre})
// 2. Cada tecla dispara onChange → actualiza el estado → re-render
// 3. El nuevo estado se refleja en el input → ciclo completo
//
// Flujo por cada tecla:
// Usuario escribe "A" → onChange → setNombre("A") → re-render →
// input muestra "A" (porque value={nombre} y nombre es "A")
//
// ¿POR QUÉ es el enfoque recomendado?
// Porque React SIEMPRE sabe el valor actual del input.
// Esto permite: validación en tiempo real, formateo automático,
// campos dependientes (ej: ciudad depende de país), y submit sin
// necesidad de leer el DOM.
//
// ¿POR QUÉ se llama "controlado"?
// Porque React CONTROLA el valor. Si no actualizas el estado en
// onChange, el input no cambia (parece "congelado"). Esto es
// intencional — le das a React control total.

function FormControlado() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // sin esto, el navegador recarga la página
    console.log({ nombre, email }); // los datos ya están en el estado
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* value + onChange = componente controlado */}
      <input
        value={nombre}  // React controla qué se muestra
        onChange={(e) => setNombre(e.target.value)} // actualiza estado
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
//
// ¿CÓMO FUNCIONA?
// El input maneja su propio valor internamente (como en HTML puro).
// React no sabe qué hay en el input hasta que tú lo lees con useRef.
// Solo lees el valor cuando lo necesitas (ej: al hacer submit).
//
// ¿POR QUÉ usarías no controlado?
// 1. Formularios simples donde no necesitas validación en tiempo real
// 2. Integración con librerías que manejan sus propios inputs
// 3. File inputs (<input type="file">) — SIEMPRE son no controlados
//    porque React no puede establecer su valor por seguridad
// 4. Rendimiento: no hay re-render por cada tecla
//
// defaultValue vs value:
// value = controlado (React controla, necesita onChange)
// defaultValue = no controlado (DOM controla, valor inicial)

function FormNoControlado() {
  const nombreRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Leemos los valores del DOM directamente al hacer submit
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

// COMPARACIÓN:
// ┌────────────────┬─────────────────────┬─────────────────────┐
// │                │ Controlado          │ No controlado       │
// ├────────────────┼─────────────────────┼─────────────────────┤
// │ Fuente verdad  │ Estado React        │ DOM                 │
// │ Lectura valor  │ Siempre disponible  │ Solo con ref        │
// │ Validación     │ Tiempo real ✅      │ Solo al submit      │
// │ Re-renders     │ Cada tecla          │ Ninguno             │
// │ Caso de uso    │ Mayoría de forms    │ Forms simples, file │
// └────────────────┴─────────────────────┴─────────────────────┘`;

const formCompleto = `// Formulario completo con validación
//
// ¿CÓMO se estructura un form real en React?
// 1. Un SOLO estado objeto para todos los campos (no un useState por campo)
// 2. Un handler GENÉRICO que usa [name] computado para actualizar cualquier campo
// 3. Un estado separado para errores de validación
// 4. Validación al submit (y opcionalmente al blur de cada campo)
//
// ¿POR QUÉ un solo objeto en vez de múltiples useState?
// Con 10 campos, tendrías 10 useState + 10 setters. Con un objeto,
// tienes 1 useState y 1 handler genérico. Mucho más limpio.

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

  // HANDLER GENÉRICO: usa el atributo "name" del input como key
  // Así UN solo handler sirve para TODOS los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      // [name] es una "computed property" de JS — usa el valor de name como key
      // Si name="email" → { ...prev, email: "nuevo@valor.com" }
      // Para checkbox, leemos .checked en vez de .value
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Validación: retorna true si todo está bien, false si hay errores
  const validar = (): boolean => {
    const nuevosErrores: Errores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
    if (!form.email.includes('@')) nuevosErrores.email = 'Email inválido';
    if (form.password.length < 6) nuevosErrores.password = 'Mínimo 6 caracteres';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
    // Si el objeto de errores está vacío → no hay errores → válido
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      console.log('Datos válidos:', form);
      // Aquí enviarías los datos al servidor
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* name="nombre" conecta este input con form.nombre */}
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        {/* Renderizado condicional: solo muestra error si existe */}
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
      {/* select funciona igual: value + onChange + name */}
      <select name="rol" value={form.rol} onChange={handleChange}>
        <option value="usuario">Usuario</option>
        <option value="admin">Admin</option>
      </select>
      <label>
        {/* checkbox: checked (no value) + onChange */}
        <input name="acepta" type="checkbox" checked={form.acepta}
               onChange={handleChange} />
        Acepto los términos
      </label>
      {/* disabled cuando no acepta términos */}
      <button type="submit" disabled={!form.acepta}>Registrar</button>
    </form>
  );
}`;

const ejemploGithub = `// ============================================
// 📁 src/components/RegistrationForm.tsx
// Ejemplo COMPLETO: form controlado, validación, handler genérico
// ============================================
import { useState } from 'react';

interface FormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: 'dev' | 'designer' | 'pm';
  aceptaTerminos: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const initialData: FormData = {
  nombre: '', email: '', password: '', confirmPassword: '',
  rol: 'dev', aceptaTerminos: false,
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (data.nombre.length < 2) errors.nombre = 'Mínimo 2 caracteres';
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) errors.email = 'Email inválido';
  if (data.password.length < 6) errors.password = 'Mínimo 6 caracteres';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'No coinciden';
  if (!data.aceptaTerminos) errors.aceptaTerminos = 'Debes aceptar los términos';
  return errors;
}

export default function RegistrationForm() {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);

  // Handler genérico: un handler para todos los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(data);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setEnviado(true);
      console.log('Datos:', data);
    }
  };

  if (enviado) {
    return (
      <div className="max-w-md mx-auto p-8 text-center border rounded-xl">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold">¡Registro exitoso!</p>
        <p className="text-gray-500">Bienvenido, {data.nombre}</p>
        <button onClick={() => { setData(initialData); setEnviado(false); }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Nuevo registro</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-xl space-y-4">
      <h2 className="text-xl font-bold">Registro</h2>

      {(['nombre', 'email', 'password', 'confirmPassword'] as const).map(field => (
        <div key={field}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {field === 'confirmPassword' ? 'Confirmar password' : field}
          </label>
          <input name={field} value={data[field]}
            type={field.includes('assword') ? 'password' : field === 'email' ? 'email' : 'text'}
            onChange={handleChange}
            className={\`w-full px-3 py-2 border rounded \${errors[field] ? 'border-red-500' : ''}\`} />
          {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium mb-1">Rol</label>
        <select name="rol" value={data.rol} onChange={handleChange}
          className="w-full px-3 py-2 border rounded">
          <option value="dev">Desarrollador</option>
          <option value="designer">Diseñador</option>
          <option value="pm">Product Manager</option>
        </select>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="aceptaTerminos"
          checked={data.aceptaTerminos} onChange={handleChange} />
        <span className="text-sm">Acepto los términos</span>
      </label>
      {errors.aceptaTerminos && <p className="text-red-500 text-sm">{errors.aceptaTerminos}</p>}

      <button type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600">
        Registrarse
      </button>
    </form>
  );
}`;

export default function FormulariosPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Formularios</h1>
      <p className="text-lg text-text-muted mb-8 leading-relaxed">
        React ofrece dos enfoques para formularios: <strong>controlados</strong> (React
        maneja el estado, es la fuente de verdad) y <strong>no controlados</strong> (el
        DOM mantiene el estado). Los controlados son el estándar porque permiten
        validación en tiempo real, campos dependientes, y control total sobre los datos.
      </p>

      <InfoBox type="angular" title="Angular Forms vs React Forms">
        <p>
          Angular tiene <code>FormsModule</code> (template-driven, similar a no controlados) y
          <code> ReactiveFormsModule</code> (similar a controlados). En React no hay módulos
          especiales — usas <code>useState</code> + <code>onChange</code> para controlados, o
          <code> useRef</code> para no controlados. Los Reactive Forms de Angular usan
          <code> FormControl</code> y <code>Validators</code>; en React haces lo mismo con
          estado y funciones de validación puras. React 19 añade <code>useActionState</code>
          para forms con server actions.
        </p>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">Formulario controlado — React como fuente de verdad</h2>
      <p className="text-text-muted mb-4">
        El valor del input viene del estado de React. Cada tecla dispara <code>onChange</code>
        → actualiza estado → re-render → input muestra el nuevo valor. React tiene control
        total, permitiendo validación, formateo, y transformación en tiempo real.
      </p>
      <CodeBlock code={controlado} language="tsx" filename="form-controlado.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Formulario no controlado — El DOM como fuente de verdad</h2>
      <p className="text-text-muted mb-4">
        El input maneja su propio valor como en HTML puro. Usas <code>useRef</code> para leer
        el valor cuando lo necesitas. Más simple, sin re-renders por tecla, pero sin validación
        en tiempo real. Es el único enfoque para <code>&lt;input type="file"&gt;</code>.
      </p>
      <CodeBlock code={noControlado} language="tsx" filename="form-no-controlado.tsx" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Formulario completo — Handler genérico y validación</h2>
      <p className="text-text-muted mb-4">
        En formularios reales: un solo <code>useState</code> con un objeto para todos los campos,
        un handler genérico que usa <code>[name]</code> (computed property) para actualizar
        cualquier campo, y validación al submit. Este patrón escala bien sin librerías externas.
      </p>
      <CodeBlock code={formCompleto} language="tsx" filename="form-validacion.tsx" />

      <InfoBox type="warning" title="¿Cuándo usar una librería de forms?">
        Con 3-5 campos, <code>useState</code> + handler genérico es suficiente. Con formularios
        complejos (10+ campos, validación avanzada, campos dinámicos), usa <strong>react-hook-form</strong>:
        combina rendimiento de no controlados (no re-renderiza en cada tecla) con la comodidad
        de controlados (validación, errores, submit). También integra con <strong>Zod</strong> para
        validación con esquemas TypeScript.
      </InfoBox>

      <InfoBox type="tip" title="Resumen — Formularios">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Controlado</strong>: value + onChange → React controla → validación tiempo real</li>
          <li><strong>No controlado</strong>: defaultValue + ref → DOM controla → forms simples</li>
          <li><strong>Handler genérico</strong>: usa <code>[e.target.name]</code> para un handler para todos</li>
          <li><strong>Validación</strong>: estado separado de errores, validar al submit o blur</li>
          <li><strong>Librerías</strong>: react-hook-form + Zod para forms complejos</li>
          <li><strong>File inputs</strong> siempre son no controlados por seguridad del navegador</li>
        </ul>
      </InfoBox>

      <h2 className="text-2xl font-bold mt-10 mb-4">🚀 Ejemplo completo para tu GitHub</h2>
      <p className="text-text-muted mb-4">
        Formulario de registro: controlado, handler genérico con <code>[name]</code>, validación
        al submit, errores por campo, checkbox, select, y pantalla de éxito.
      </p>
      <CodeBlock code={ejemploGithub} language="tsx" filename="src/components/RegistrationForm.tsx" />
    </div>
  );
}
