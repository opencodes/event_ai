import { useState } from 'react';
import { Sidebar } from '@/layout';
import { Header } from '@/layout';

export default function Dashboard() {
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
          <div className="space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                <p className="text-xs text-[var(--app-fg-muted)]">Data 1</p>
                <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{0}</p>
              </article>
              <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                <p className="text-xs text-[var(--app-fg-muted)]">Data 2  </p>
                <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{0}</p>
              </article>
              <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                <p className="text-xs text-[var(--app-fg-muted)]">Data 3</p>
                <p className={`mt-2 text-2xl font-bold ${0 > 0 ? 'text-green-500' : 'text-[var(--app-fg)]'}`}>
                  {0}
                </p>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
