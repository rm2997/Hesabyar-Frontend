import { ChakraProvider } from "@chakra-ui/react";
import { LoginForm } from "./my-components/LoginForm";
import { ForgotPasswordForm } from "./my-components/ForgetPasswordForm";
import { useLayoutEffect, useState } from "react";
import { loadToken } from "./api/tokenUtils";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
function App() {
  const [token, setToken] = useState("");

  useLayoutEffect(() => {
    const tmpToken = loadToken();
    if (tmpToken) {
      console.log("شما با موفقیت وارد سیستم شدید");
      setToken(tmpToken);
    }
  }, []);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !token ? <Navigate to="/login" /> : <Navigate to="/home" />
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgetpassword" element={<ForgotPasswordForm />} />
          <Route path="/dashbord" element={<></>} />
          <Route path="/home" element={<></>} />
          {/* <Route path="*" element={<NotFound/>}/> */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
