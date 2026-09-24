import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react';

import { api, setAuthToken } from '@/api/client';
import type { Session } from '@/api/types';

const SESSION_STORAGE_KEY = 'school-connect:session';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        const restored = JSON.parse(stored) as Session;
        setAuthToken(restored.token);
        setSession(restored);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const next = await api.signIn(email, password);
    setAuthToken(next.token);
    setSession(next);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }

  async function signOut() {
    setAuthToken(null);
    setSession(null);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY).catch(() => {});
  }

  return <AuthContext value={{ session, isLoading, signIn, signOut }}>{children}</AuthContext>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.');
  return value;
}

export function useSession(): Session {
  const { session } = useAuth();
  if (!session) throw new Error('useSession called while signed out.');
  return session;
}
