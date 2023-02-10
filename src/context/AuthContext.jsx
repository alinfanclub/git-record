import { createContext, useContext, useEffect, useState } from "react";
import { onUserStateChange } from "../api/firebase";
import { login, logout } from "../api/firebase";

const AuthContext = createContext();

export function AuthContextProvier({ children }) {
  const [user, setUser] = useState("");
  useEffect((user) => {
    onUserStateChange((user) => {
      console.log(user);
      setUser(user);
      console.log(user);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
