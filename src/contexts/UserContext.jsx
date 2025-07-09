import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { loadTokens } from "../api/tokenUtils";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = loadTokens().accessToken;

    return saved ? jwtDecode(saved) : null;
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
