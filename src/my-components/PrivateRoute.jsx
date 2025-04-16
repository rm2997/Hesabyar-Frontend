import { Navigate } from "react-router-dom";
import { loadTokens } from "../api/tokenUtils";

export const PrivateRoute = ({ children }) => {
  const { accessToken } = loadTokens();

  return accessToken ? children : <Navigate to="/login" />;
};
