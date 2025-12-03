import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const showError = (message) => {
    setError(message || "An unexpected error occurred");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
};
