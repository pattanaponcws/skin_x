"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  singup: (email: string, username: string, password: string) => Promise<void>;
  status: number | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  initialUser: User | null;
  children: ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>();

  const router = useRouter();

  const singup = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/signup`,
        { email: email, username: username, password: password },
        { withCredentials: true, validateStatus: () => true }
      );
      console.log(res);
      if (res.status !== 200) {
        setStatus(res.status);
        setUser(null);
        return;
      }
      setStatus(res.status);
      setUser(res.data);

      // ✅ redirect หลัง login สำเร็จ
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/signin`,
        { username: username, password: password },
        { withCredentials: true, validateStatus: () => true }
      );
      if (res.status !== 200) {
        setStatus(res.status);
        setUser(null);
        return;
      }
      setStatus(res.status);
      setUser(res.data);

      // ✅ redirect หลัง login สำเร็จ
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/signout`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        // Handle successful logout
        console.log(response);
        setUser(null);
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  };

  const value = { user, loading, singup, login, logout, status };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
