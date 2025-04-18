import { ChakraProvider } from "@chakra-ui/react";
import { LoginForm } from "./pages/LoginForm";
import { ForgotPasswordForm } from "./pages/ForgetPasswordForm";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { PrivateRoute } from "./my-components/PrivateRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MyHome } from "./pages/HomePage";
import { Logout } from "./my-components/Logout";
function App() {
  return (
    <ChakraProvider>
      <Router>
        {/* <AuthProvider> */}
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forget-password" element={<ForgotPasswordForm />} />
            <Route
              path="/dashbord"
              element={
                <PrivateRoute>
                  <>dashbord</>
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <MyHome />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        {/* </AuthProvider> */}
      </Router>
    </ChakraProvider>
  );
}

export default App;
