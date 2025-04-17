import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate(); // 使用 useNavigate hook
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // 用于存储错误信息

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      alert("註冊成功");
      navigate("/login");
    } catch (error) {
      // 如果 API 返回错误信息，显示具体的错误信息
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "註冊失敗");
      } else {
        setErrorMessage("註冊失敗");
      }
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
          註冊
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ width: "50%" }}>
          <TextField
            label="姓名"
            fullWidth
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="電子郵件"
            fullWidth
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="密碼"
            fullWidth
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="確認密碼"
            fullWidth
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            註冊
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
