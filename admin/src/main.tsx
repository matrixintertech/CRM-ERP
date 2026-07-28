import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import App from "./App";
import { AuthProvider } from "./app/providers/AuthProvider";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <App />
       <Toaster
          richColors
          position="top-right"
          closeButton
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);