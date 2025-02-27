import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OccurrencesProvider } from "./core/ReportsContext";
import Home from "./pages/Home";
import { Navigate, Route, BrowserRouter, Routes } from "react-router";
import { AuthProvider } from "./core/AuthContext";
import Login from "./pages/Login";
import { RegionsProvider } from "./core/RegionsContext";
import { NeighborhoodProvider } from "./core/NeighborhoodContext";
import { InstitutionProvider } from "./core/InstitutionContext";
import { NotificationProvider } from "./core/NotificationContext";
import Cadastro from "./pages/Cadastro";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OccurrencesProvider>
          <RegionsProvider>
            <NeighborhoodProvider>
              <InstitutionProvider>
                <BrowserRouter>
                  <NotificationProvider>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/cadastro" element={<Cadastro />} />
                      <Route path="/" element={<Home />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </NotificationProvider>
                </BrowserRouter>
              </InstitutionProvider>
            </NeighborhoodProvider>
          </RegionsProvider>
        </OccurrencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
