import { User } from "@supabase/supabase-js";
import { createContext, use, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AuthContextType = {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setRedirectPath: (path: string) => void;
  getRedirectPath: () => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>("/Management");
  useEffect(() => {
    const client = createClient();
    const { data: authListener } = client.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const client = createClient();
    await client.auth.signUp({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    const client = createClient();
    await client.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    const client = createClient();
    await client.auth.signOut();
  };

  const getRedirectPath = () => {
    return redirectPath;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
        setRedirectPath,
        getRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
