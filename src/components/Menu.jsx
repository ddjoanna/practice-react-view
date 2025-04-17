import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Menu = ({ auth, open, setOpen }) => {
  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
        },
      }}
      variant="temporary" // 使用 temporary
      anchor="left"
      open={open}
      onClose={() => setOpen(false)} // 点击外部区域关闭菜单
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
        }}
      >
        <Typography variant="h6" sx={{ ml: 1 }}>
          選單
        </Typography>
        <IconButton onClick={() => setOpen(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem component={Link} to="/products">
          <ListItemText primary="產品列表" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default Menu;
