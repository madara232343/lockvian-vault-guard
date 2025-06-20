
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome to the Quantum Realm! 🚀",
            description: "You've successfully entered your secure dimension.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Portal Closed",
            description: "You've safely exited the quantum dimension.",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Recovery Portal Sent! 📧",
            description: "Check your email for quantum key restoration instructions.",
          });
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "Access to quantum realm denied.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid quantum credentials. Please verify your neural key.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please confirm your quantum identity via email first.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many portal attempts. Please wait before trying again.";
        }

        toast({
          variant: "destructive",
          title: "Portal Access Failed",
          description: errorMessage,
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        variant: "destructive",
        title: "Quantum Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName?.trim() || '',
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        let errorMessage = "Failed to create quantum portal.";
        
        if (error.message.includes('already registered')) {
          errorMessage = "This quantum signature already exists. Try signing in instead.";
        } else if (error.message.includes('Password should be')) {
          errorMessage = "Your neural key must be at least 6 characters long.";
        } else if (error.message.includes('signup disabled')) {
          errorMessage = "New portal creation is temporarily disabled.";
        }

        toast({
          variant: "destructive",
          title: "Portal Creation Failed",
          description: errorMessage,
        });
        return { error };
      }

      if (data.user && !data.session) {
        toast({
          title: "Quantum Portal Created! 📧",
          description: "Please check your email to activate your quantum access.",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        variant: "destructive",
        title: "Quantum Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          variant: "destructive",
          title: "Portal Exit Failed",
          description: "Unable to safely exit quantum dimension.",
        });
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/auth?reset=true`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Password reset error:', error);
        let errorMessage = "Failed to send recovery portal.";
        
        if (error.message.includes('not found')) {
          errorMessage = "No quantum signature found for this email.";
        }

        toast({
          variant: "destructive",
          title: "Recovery Failed",
          description: errorMessage,
        });
        return { error };
      }

      // Success handled by auth state change listener
      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      toast({
        variant: "destructive",
        title: "Quantum Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
