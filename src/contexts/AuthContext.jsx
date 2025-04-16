import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearTokens, loadTokens, saveTokens } from "../api/tokenUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(loadTokens().access_token);

  const location = useLocation();
  const navigate = useNavigate();

  const publicRoutes = ["/logout", "/forget-password", "/signup", "/*"];
  const isPublicRoute = publicRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  const isNotFound =
    location.pathname === "/404" ||
    location.pathname === "*" ||
    location.pathname.includes("404");

  //   useEffect(() => {
  //     if (!accessToken && !isPublicRoute && !isNotFound) {
  //       navigate("/login");
  //     }
  //   }, [accessToken]);

  const login = (token) => {
    saveTokens(accessToken, null);
    setAccessToken(token);
  };

  const logout = () => {
    clearTokens();
    setAccessToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
