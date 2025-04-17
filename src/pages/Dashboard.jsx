import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          儀表板
        </Typography>
        <Typography variant="h6" gutterBottom>
          目前沒有可用的儀表板。
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
