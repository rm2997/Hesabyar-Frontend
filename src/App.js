import { ChakraProvider } from "@chakra-ui/react";
import { LoginForm } from "./pages/LoginForm";
import { ForgotPasswordForm } from "./pages/ForgetPasswordForm";
import { NotificationProvider } from "./contexts/NotificationContext";

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
import { LocationProvider } from "./contexts/LocationContext";
import { UserProvider } from "./contexts/UserContext";
import { SecondLogin } from "./pages/SecondLogin";
import { UploadProformaDocument } from "./pages/UploadProformaDocument";
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
                <NotificationProvider>
                  <LocationProvider>
                    <UserProvider>
                      <MyHome />
                    </UserProvider>
                  </LocationProvider>
                </NotificationProvider>
              </PrivateRoute>
            }
          />
          <Route path="/second-login" element={<SecondLogin />} />
          <Route
            path="/upload-proforma-document"
            element={<UploadProformaDocument proformaId={17} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* </AuthProvider> */}
      </Router>
    </ChakraProvider>
  );
}

export default App;
