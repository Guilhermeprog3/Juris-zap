"use client";

import { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase';
import { AuthLoader } from '@/components/auth-provider';
import { toast } from "sonner";

// Tipagem para os dados do usuário no Firestore
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
}

// Tipagem para o valor do Contexto
interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

// Criação do Contexto com valor inicial
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// Componente Provedor
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = { uid: firebaseUser.uid, ...docSnapshot.data() } as UserProfile;
            setUser(userData);
            
            // Lógica de Redirecionamento Baseada no Status
            if (userData.statusAssinatura === 'pagamento_atrasado') {
              toast.warning("Seu pagamento está pendente. Por favor, atualize seus dados.");
              router.push('/dashboard/planos');
            } else if (userData.statusAssinatura === 'inativo') {
              toast.error("Sua assinatura está inativa. Reative para continuar.");
              router.push('/dashboard/planos');
            }
            
          } else {
            // Usuário existe no Auth mas foi removido do Firestore, força logout
            signOut(auth);
          }
          setLoading(false);
        });
        return () => unsubDoc(); // Limpa o listener do documento
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe(); // Limpa o listener de autenticação
  }, [router]);

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
      {loading ? <AuthLoader /> : children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
