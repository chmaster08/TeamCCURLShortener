"use client";

import { Alert } from "@mui/material";

interface AlertsProps {
  copiedAlertOpen: boolean;
  deletedAlertOpen: boolean;
  failedAlert: boolean;
}

export default function Alerts({
  copiedAlertOpen,
  deletedAlertOpen,
  failedAlert,
}: AlertsProps) {
  return (
    <>
      {copiedAlertOpen && (
        <Alert
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          severity="success"
        >
          Copied
        </Alert>
      )}
      {deletedAlertOpen && (
        <Alert
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          severity="success"
        >
          Deleted
        </Alert>
      )}
      {failedAlert && (
        <Alert
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          severity="error"
        >
          Failed. Please try again
        </Alert>
      )}
    </>
  );
}
