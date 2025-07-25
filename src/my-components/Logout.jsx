import { useNavigate } from "react-router-dom";
import { clearTokens } from "../api/tokenUtils";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";

export const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const logoutUser = async () => {
      clearTokens();
      navigate("/home");
      setUser(null);
    };

    logoutUser();
  }, []);
};
