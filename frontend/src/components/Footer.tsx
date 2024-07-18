import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: "auto", py: 2, bgcolor: "background.paper" }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        2024 TeamCC.
      </Typography>
    </Box>
  );
}
