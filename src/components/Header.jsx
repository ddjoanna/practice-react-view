import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link, Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import api from "@/api/axios";

const Header = ({ auth, setAuth, setError, setOpen, handleDrawerToggle }) => {
  const handleLogout = async () => {
    console.log("开始登出...");

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("沒有 token，已是登出狀態");
      setAuth(false);
      setOpen(true); // 顯示成功訊息
      return;
    }

    try {
      console.log("发送登出请求...");
      await api.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("登出请求成功...");
      localStorage.removeItem("token");
      setAuth(false);
      setOpen(true); // 顯示成功訊息
    } catch (error) {
      console.error("登出失败：", error);
      // 強制清除 token，避免前端狀態錯誤
      localStorage.removeItem("token");
      setAuth(false);
      setOpen(true); // 也可以顯示成功訊息，或改成錯誤訊息
      setError("登出失敗，但已強制清除登入狀態，請重新登入！");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 已登入狀態顯示左側選單按鈕 */}
        {auth && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle} // 调用 handleDrawerToggle
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {/* 標題連結 */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            管理系統
          </Link>
        </Typography>

        {/* 右側操作按鈕（登入、註冊 或 登出） */}
        {!auth ? (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              登入
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              註冊
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            登出
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
