import { ChakraProvider } from "@chakra-ui/react";
import { LoginForm } from "./my-components/LoginForm";
function App() {
  return (
    <ChakraProvider>
      <LoginForm />
    </ChakraProvider>
  );
}

export default App;
