import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth, db } from "@/config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    accessCode: string
  ) => Promise<void>;
  registerAdmin: (
    email: string,
    password: string,
    displayName: string,
    accessCode: string
  ) => Promise<string>;
  logout: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    accessCode: string
  ) => {
    try {
      setError(null);
      setLoading(true);

      const usersQuery = query(
        collection(db, "users"),
        where("accessCode", "==", accessCode),
        where("role", "==", "admin")
      );
      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty) {
        throw new Error("Nieprawidłowy kod dostępu");
      }

      const adminDoc = querySnapshot.docs[0];
      const parkingOwnerId = adminDoc.id;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          displayName: displayName,
          role: "user",
          parkingOwnerId: parkingOwnerId,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (
    email: string,
    password: string,
    displayName: string,
    accessCode: string
  ): Promise<string> => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          displayName: displayName,
          role: "admin",
          accessCode: accessCode,
          createdAt: new Date().toISOString(),
        });

        return userCredential.user.uid;
      }
      throw new Error("Nie udało się utworzyć użytkownika");
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        login,
        register,
        registerAdmin,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
