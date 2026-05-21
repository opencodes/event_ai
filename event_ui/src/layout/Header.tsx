import { Menu, Bell, Flame, Moon, Sun, KeyRound, CalendarDays } from 'lucide-react';
import { useAuth } from '@/core/auth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useState } from 'react';
import { authAPI } from '@/core/api';
import { useEventWorkspace } from '@/modules/events/context';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { selectedEvent } = useEventWorkspace();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Current and new password are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPasswordError(e?.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="border-b border-[var(--panel-border)] px-4 md:px-5 h-[64px] flex items-center justify-between glass-black-surface shadow-nav">
      <div className="flex items-center gap-2.5">
        <button
          className="icon-button"
          onClick={onMobileMenuToggle}
          style={{ display: onMobileMenuToggle ? 'flex' : 'none' }}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="font-semibold text-[var(--app-fg)] text-[15px] leading-tight tracking-[-0.02em]">
            {selectedEvent?.title || 'No event selected'}
          </h1>
          <p className="text-[11px] text-[var(--app-fg-muted)] hidden sm:block leading-tight mt-0.5">
            {new Date(selectedEvent?.start_at || new Date()).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

    

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleDarkMode}
          className="icon-button"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border"
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary-text)',
            borderColor: 'rgba(16, 185, 129, 0.2)',
          }}
        >
          <Flame className="w-3 h-3" />
          <span>0-day streak</span>
        </div>
        <button className="icon-button relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--panel-bg)]" />
        </button>
      </div>
 
    </header>
  );
}
