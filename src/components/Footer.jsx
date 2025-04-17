import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        textAlign: "center",
        py: 2,
      }}
    >
      <Typography variant="body2">
        © 2025 My App. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
