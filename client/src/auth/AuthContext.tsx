import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  AuthUser,
  getCurrentUser,
  getStoredAuthToken,
  login,
  logout,
  setAuthToken,
  updateCurrentUser,
  UpdateProfileInput,
  UserRole,
} from '../lib/api';

type AuthContextValue = {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(getStoredAuthToken()));

  useEffect(() => {
    if (!getStoredAuthToken()) {
      return;
    }

    getCurrentUser()
      .then((result) => setUser(result.user))
      .catch(() => setAuthToken(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function loginUser(email: string, password: string) {
    const result = await login(email, password);
    setAuthToken(result.token);
    setUser(result.user);
  }

  async function logoutUser() {
    try {
      if (getStoredAuthToken()) {
        await logout();
      }
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  }

  async function updateProfile(input: UpdateProfileInput) {
    const result = await updateCurrentUser(input);
    setUser(result.user);
  }

  const value = {
    user,
    role: user?.role ?? 'guest',
    isAuthenticated: Boolean(user),
    isLoading,
    loginUser,
    logoutUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
