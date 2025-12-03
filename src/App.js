import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { CssBaseline, Container } from "@mui/material";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useThemeContext } from "./context/ThemeContext";

function AppContent() {
  const { user, token } = useAuth();
  const { theme } = useThemeContext();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!token ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={<Navigate to={token ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </Container>
      </Router>
    </MuiThemeProvider>
  );
}

export default function App() {
  return <AppContent />;
}
