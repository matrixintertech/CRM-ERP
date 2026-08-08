import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Toaster,
} from "sonner";

import "@/styles/globals.css";

import App from "./App";

import {
  AuthProvider,
} from "./app/providers/AuthProvider";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:
          60 * 1000,

        refetchOnWindowFocus:
          false,

        retry: 1,
      },
    },
  });

ReactDOM.createRoot(
  document.getElementById(
    "root",
  )!,
).render(
  <React.StrictMode>
    <QueryClientProvider
      client={queryClient}
    >
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
    </QueryClientProvider>
  </React.StrictMode>,
);