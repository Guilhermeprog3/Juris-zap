"use client";

import React, { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { app } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  telefone: string;
  planoId: string;
  statusAssinatura: 'ativo' | 'pagamento_atrasado' | 'inativo';
  stripeCustomerId: string;
  role: 'user' | 'admin';
  proximoVencimento?: Timestamp;
  trial_end?: Timestamp;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthLoader = () => (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        unsubscribeDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = { uid: firebaseUser.uid, ...docSnapshot.data() } as UserProfile;
            setUser(userData);
            
            const isLoginPage = pathname === '/login';

            if (isLoginPage) {
              if (userData.role === 'admin') {
                router.push('/admin');
              } else {
                router.push('/dashboard');
              }
            }

            const isPendentePage = pathname === '/pagamento-pendente';
            const isPlanosPage = pathname === '/dashboard/planos';

            if (userData.statusAssinatura === 'pagamento_atrasado' && !isPendentePage) {
              router.push('/pagamento-pendente'); 
            } else if (userData.statusAssinatura === 'inativo' && !isPlanosPage) {
              toast.error("Sua assinatura está inativa. Reative para continuar.");
              router.push('/dashboard/planos');
            }
            
          } else {
            signOut(auth);
          }
          setLoading(false);
        }, (error) => {
            console.error("Erro ao buscar dados do usuário:", error);
            toast.error("Erro ao carregar os dados do perfil.");
            signOut(auth);
            setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, [router, pathname]);

  const login = (email: string, password: string): Promise<any> => {
    const auth = getAuth(app);
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const logout = async (): Promise<void> => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/login');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const useRequireAuth = (role?: 'admin' | 'user') => {
    const authState = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (authState.loading) {
        return; 
      }
  
      if (!authState.user) {
        router.push('/login');
        return;
      }
  
      if (role === 'admin' && authState.user.role !== 'admin') {
        router.push('/dashboard');
      } else if (role === 'user' && authState.user.role === 'admin') {
        router.push('/admin');
      }
  
    }, [authState, router, role]);
  
    return authState;
};