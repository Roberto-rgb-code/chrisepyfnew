'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  reload,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ADMIN_EMAIL } from '@/lib/constants';
import { isEmailVerified } from '@/lib/email-verification';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  emailVerified: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<{ emailVerified: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

async function syncUserWithDb(user: User): Promise<boolean> {
  try {
    const response = await fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }),
    });

    if (!response.ok) return user.email === ADMIN_EMAIL;

    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error('Error syncing user with database:', error);
    return user.email === ADMIN_EMAIL;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await reload(currentUser);
        } catch {
          // Ignore reload errors; use cached user state.
        }
      }

      setUser(currentUser);
      setEmailVerified(isEmailVerified(currentUser));

      if (currentUser) {
        const admin = await syncUserWithDb(currentUser);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error('Auth not initialized');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      await syncUserWithDb(userCredential.user);
      setUser(userCredential.user);
      setEmailVerified(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await reload(userCredential.user);
    const verified = isEmailVerified(userCredential.user);
    setUser(userCredential.user);
    setEmailVerified(verified);
    return { emailVerified: verified };
  };

  const logout = async () => {
    if (!auth) throw new Error('Auth not initialized');
    await signOut(auth);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Auth not initialized');
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerificationEmail = useCallback(async () => {
    if (!auth?.currentUser) throw new Error('Debes iniciar sesión para reenviar el correo');
    if (isEmailVerified(auth.currentUser)) return;
    await sendEmailVerification(auth.currentUser);
  }, []);

  const reloadUser = useCallback(async (): Promise<boolean> => {
    if (!auth?.currentUser) return false;
    await reload(auth.currentUser);
    const verified = isEmailVerified(auth.currentUser);
    setEmailVerified(verified);
    setUser(auth.currentUser);
    return verified;
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    emailVerified,
    signup,
    login,
    logout,
    resetPassword,
    resendVerificationEmail,
    reloadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
