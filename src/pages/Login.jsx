import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", form);
      const token = response.data.token;

      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/`; // 將 token 存儲到 cookie

      setAuth(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("登入失敗");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          登入
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "50%" }}>
          <TextField
            label="電子郵件"
            fullWidth
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ marginBottom: 2 }} // 增加底部間距
          />
          <TextField
            label="密碼"
            type="password"
            fullWidth
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ marginBottom: 2 }} // 增加底部間距
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            登入
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
