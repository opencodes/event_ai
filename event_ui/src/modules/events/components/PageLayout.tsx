import { useState } from 'react';
import { Sidebar, Header } from '@/layout';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden app-shell">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isCollapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={handleMenuToggle} />

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-fg)]">{title}</h1>
              {subtitle && <p className="text-sm text-[var(--app-fg-muted)] mt-1">{subtitle}</p>}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
