import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const JsxPage = lazy(() => import('./pages/JsxPage'));
const ComponentesPage = lazy(() => import('./pages/ComponentesPage'));
const PropsPage = lazy(() => import('./pages/PropsPage'));
const EstadoPage = lazy(() => import('./pages/EstadoPage'));
const EventosPage = lazy(() => import('./pages/EventosPage'));
const RenderizadoCondicionalPage = lazy(() => import('./pages/RenderizadoCondicionalPage'));
const ListasKeysPage = lazy(() => import('./pages/ListasKeysPage'));
const UseEffectPage = lazy(() => import('./pages/UseEffectPage'));
const UseRefPage = lazy(() => import('./pages/UseRefPage'));
const UseMemoCallbackPage = lazy(() => import('./pages/UseMemoCallbackPage'));
const CustomHooksPage = lazy(() => import('./pages/CustomHooksPage'));
const ContextPage = lazy(() => import('./pages/ContextPage'));
const UseReducerPage = lazy(() => import('./pages/UseReducerPage'));
const FormulariosPage = lazy(() => import('./pages/FormulariosPage'));
const ErrorBoundariesPage = lazy(() => import('./pages/ErrorBoundariesPage'));
const SuspenseLazyPage = lazy(() => import('./pages/SuspenseLazyPage'));
const PortalsPage = lazy(() => import('./pages/PortalsPage'));
const PatronesPage = lazy(() => import('./pages/PatronesPage'));
const React19Page = lazy(() => import('./pages/React19Page'));
const ServerComponentsPage = lazy(() => import('./pages/ServerComponentsPage'));
const ReactRouterPage = lazy(() => import('./pages/ReactRouterPage'));
const UseTransitionPage = lazy(() => import('./pages/UseTransitionPage'));
const CicloRenderizadoPage = lazy(() => import('./pages/CicloRenderizadoPage'));
const HooksRestantesPage = lazy(() => import('./pages/HooksRestantesPage'));
const TypeScriptReactPage = lazy(() => import('./pages/TypeScriptReactPage'));
const EstilosPage = lazy(() => import('./pages/EstilosPage'));
const TestingPage = lazy(() => import('./pages/TestingPage'));
const VitePage = lazy(() => import('./pages/VitePage'));

function App() {
  return (
    <BrowserRouter basename="/react-mastery">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-surface">
          <div className="text-text-muted text-sm">Cargando...</div>
        </div>
      }>
        <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ciclo-renderizado" element={<CicloRenderizadoPage />} />
          <Route path="/jsx" element={<JsxPage />} />
          <Route path="/componentes" element={<ComponentesPage />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/estado" element={<EstadoPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/renderizado-condicional" element={<RenderizadoCondicionalPage />} />
          <Route path="/listas-keys" element={<ListasKeysPage />} />
          <Route path="/useeffect" element={<UseEffectPage />} />
          <Route path="/useref" element={<UseRefPage />} />
          <Route path="/usememo-usecallback" element={<UseMemoCallbackPage />} />
          <Route path="/usetransition" element={<UseTransitionPage />} />
          <Route path="/hooks-restantes" element={<HooksRestantesPage />} />
          <Route path="/custom-hooks" element={<CustomHooksPage />} />
          <Route path="/context" element={<ContextPage />} />
          <Route path="/usereducer" element={<UseReducerPage />} />
          <Route path="/formularios" element={<FormulariosPage />} />
          <Route path="/typescript-react" element={<TypeScriptReactPage />} />
          <Route path="/estilos" element={<EstilosPage />} />
          <Route path="/react-router" element={<ReactRouterPage />} />
          <Route path="/error-boundaries" element={<ErrorBoundariesPage />} />
          <Route path="/suspense-lazy" element={<SuspenseLazyPage />} />
          <Route path="/portals" element={<PortalsPage />} />
          <Route path="/patrones" element={<PatronesPage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/vite" element={<VitePage />} />
          <Route path="/react19" element={<React19Page />} />
          <Route path="/server-components" element={<ServerComponentsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App
