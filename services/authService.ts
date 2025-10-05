import { supabase } from '../config/supabase';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export interface AppUser {
  id: string;
  role: 'admin' | 'student';
  name?: string;
  email: string;
}

// Authentication service
class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(email: string, password: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { user: data.user, error };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user: data.user, error };
  }

  async signInWithProvider(provider: 'google' | 'github' | 'facebook' | 'twitter') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    
    if (error) {
      console.error('OAuth sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }
}

export const authService = AuthService.getInstance();

// Custom hook for authentication state
export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          // Determine user role based on some criteria (e.g., email or custom claims)
          // For now, we'll use a simple approach, but you could use custom claims
          const appUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.email?.includes('admin') ? 'admin' : 'student',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          };
          setUser(appUser);
        }
      } catch (err) {
        setError((err as Error).message);
        console.error('Authentication initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const subscription = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const appUser: AppUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.email?.includes('admin') ? 'admin' : 'student',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        };
        setUser(appUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error, signIn: authService.signIn, signOut: authService.signOut };
};