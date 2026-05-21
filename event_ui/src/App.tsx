import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, Login, ResetPassword } from '@/core/auth';
import { DarkModeProvider } from './hooks/useDarkMode';
import { AppSettingsProvider } from '@/core/settings';
import { Settings, RootUsers, RootPermissions, RootRoles, RootGroups } from '@/core/user';
import { isAdminUser } from '@/core/user/permissions';
import { Dashboard } from './modules/dashboard';
import { EventWizardPage } from './modules/events/pages/EventWizardPage';
import { EventListPage } from './modules/events/pages/EventListPage';
import { EventDetailPage } from './modules/events/pages/EventDetailPage';
import { GuestManagementPage } from './modules/events/pages/GuestManagementPage';
import { EventWorkspaceProvider } from './modules/events/context';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-shell">
        <div className="text-[var(--app-fg)]">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isAdminUser(user)) {
    return <Navigate to="/settings" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === 'root') {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/root/users" />} />
        <Route path="/root/permissions" element={<ProtectedRoute><AdminRoute><RootPermissions /></AdminRoute></ProtectedRoute>} />
        <Route path="/root/roles" element={<ProtectedRoute><AdminRoute><RootRoles /></AdminRoute></ProtectedRoute>} />
        <Route path="/root/users" element={<ProtectedRoute><AdminRoute><RootUsers /></AdminRoute></ProtectedRoute>} />
        <Route path="/root/groups" element={<ProtectedRoute><AdminRoute><RootGroups /></AdminRoute></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/root/users" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/settings" /> : <Login />} />
       <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/new"
        element={
          <ProtectedRoute>
            <EventWizardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <GuestManagementPage />
          </ProtectedRoute>
        }
      />
      <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/settings" /> : <ResetPassword />} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/settings" />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <DarkModeProvider>
          <AppSettingsProvider>
            <EventWorkspaceProvider>
              <AppRoutes />
            </EventWorkspaceProvider>
          </AppSettingsProvider>
        </DarkModeProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
