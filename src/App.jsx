import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Container, CssBaseline, useMediaQuery } from "@mui/material";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ProductManager from "@/pages/ProductManager";
import CategoryManager from "@/pages/CategoryManager";

const theme = createTheme();

function App() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    };

    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <CssBaseline />
          <Header
            auth={auth}
            setAuth={setAuth}
            setError={setError}
            setOpen={setOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Box
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {auth && <Sidebar open={open} />}
            {/* 主要路由區域 */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                px: 2,
                py: 2,
                backgroundColor: "#fff",
              }}
            >
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  minHeight: "100%",
                }}
              >
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/login"
                    element={
                      auth ? <Navigate to="/" /> : <Login setAuth={setAuth} />
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      auth ? <ProductManager /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      auth ? <CategoryManager /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/"
                    element={auth ? <Dashboard /> : <Navigate to="/login" />}
                  />
                </Routes>
              </Container>
            </Box>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
