import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <ScrollToTop />
      <Sidebar />
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
