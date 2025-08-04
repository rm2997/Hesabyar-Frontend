import { ChakraProvider } from "@chakra-ui/react";
import { LoginForm } from "./pages/LoginForm";
import { ForgotPasswordForm } from "./pages/password/ForgetPasswordForm";
import { NotificationProvider } from "./contexts/NotificationContext";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { PrivateRoute } from "./my-components/PrivateRoute";
import { NotFoundPage } from "./pages/NotFoundPage";

import { Logout } from "./my-components/Logout";
import { LocationProvider } from "./contexts/LocationContext";
import { UserProvider } from "./contexts/UserContext";
import { SecondLogin } from "./pages/SecondLogin";
import { UploadProformaDocument } from "./pages/UploadProformaDocument";
import { theme } from "./theme/theme";
import { UploadInvoiceDocument } from "./pages/UploadInvoiceDocument";
import { Home } from "./pages/Home";
import { ChangeUserPassword } from "./pages/password/ChangeUserPassword";
import { MyHome } from "./pages/MyHome";
import { UpdateDriverInfo } from "./pages/UpdateDriverInfo";
import { UpdateInvoiceDriverInfo } from "./pages/UpdateInvoiceDriverInfo";
function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Router>
          {/* <AuthProvider> */}
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element={<Home />} />
            <Route path="/forget-password" element={<ForgotPasswordForm />} />
            <Route path="/change-password" element={<ChangeUserPassword />} />
            <Route path="/second-login" element={<SecondLogin />} />
            <Route
              path="/update-depot-document"
              element={<UpdateDriverInfo />}
            />
            <Route
              path="/update-invoice-driverInfo"
              element={<UpdateInvoiceDriverInfo />}
            />
            <Route path="/view-depot-exit" />
            <Route
              path="/upload-proforma-document"
              element={<UploadProformaDocument />}
            />
            <Route
              path="/upload-invoice-document"
              element={<UploadInvoiceDocument />}
            />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path="/dashbord"
              element={
                <PrivateRoute>
                  <>dashbord</>
                </PrivateRoute>
              }
            />
            <Route
              path="/myhome"
              element={
                <PrivateRoute>
                  <NotificationProvider>
                    <LocationProvider>
                      <MyHome />
                    </LocationProvider>
                  </NotificationProvider>
                </PrivateRoute>
              }
            />
          </Routes>
          {/* </AuthProvider> */}
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;
