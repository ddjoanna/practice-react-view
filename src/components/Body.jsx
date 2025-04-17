import React from "react";
import { Box, Typography } from "@mui/material";

function Body() {
  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        backgroundColor: "#fff",
        minHeight: "300px",
      }}
    >
      <Typography variant="h5">Main Content Area</Typography>
      <Typography>This is where your main content goes.</Typography>
    </Box>
  );
}

export default Body;
