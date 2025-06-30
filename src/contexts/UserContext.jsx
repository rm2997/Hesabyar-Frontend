import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { loadTokens } from "../api/tokenUtils";

export const UserContext = createContext();

const token = loadTokens().accessToken;
const initialUser = token ? jwtDecode(token) : null;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
