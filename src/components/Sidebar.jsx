import React from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemText } from "@mui/material";

function Sidebar({ open }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "250px" },
        backgroundColor: "#f5f5f5",
        p: 2,
        boxSizing: "border-box",
        display: open ? "block" : "none", // 根據 open 狀態顯示或隱藏
      }}
    >
      <List>
        <ListItem button="true" to="/users">
          <ListItemText primary="用戶管理" />
        </ListItem>
        <ListItem button="true" component={Link} to="/categories">
          <ListItemText primary="產品分類" />
        </ListItem>
        <ListItem button="true" component={Link} to="/products">
          <ListItemText primary="產品管理" />
        </ListItem>
        <ListItem button="true" to="/orders">
          <ListItemText primary="訂單管理" />
        </ListItem>
        <ListItem button="true" to="/purchases">
          <ListItemText primary="採購管理" />
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
