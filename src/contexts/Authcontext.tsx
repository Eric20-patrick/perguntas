import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, provider } from '../services/firebase'; // Firebase importado
import { signInWithPopup } from 'firebase/auth'; // Função para login com Google

// Tipos de dados do usuário
type User = {
  id: string;
  name: string;
  avatar: string;
};

// Tipos do contexto
type AuthContextType = {
  user: User | undefined; // Usuário pode ser indefinido
  signInWithGoogle: () => Promise<void>; // Função de login
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthcontextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined); // Estado para armazenar o usuário

  // Função de login com o Google
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        // Atualiza o estado com as informações do usuário
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
