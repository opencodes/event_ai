import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearUser, getUser, setUser, type User } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => getUser())

  const login = useCallback((next: User) => {
    setUser(next)
    setUserState(next)
  }, [])

  const logout = useCallback(() => {
    clearUser()
    setUserState(null)
  }, [])

  const updateUser = useCallback((next: User) => {
    setUser(next)
    setUserState(next)
  }, [])

  const value = useMemo(
    () => ({ user, login, logout, updateUser }),
    [user, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
