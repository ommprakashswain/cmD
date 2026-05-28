import { Layout as LayoutIcon } from 'lucide-react';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-semibold tracking-tight">
            <LayoutIcon className="w-5 h-5" />
            <span>Windows Assistant</span>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">Interface</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-16">
        {children}
      </main>
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-100">
        <p>© {new Date().getFullYear()} Windows Assistant. This is a mockup landing page.</p>
      </footer>
    </div>
  );
}
