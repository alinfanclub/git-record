import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { AuthContextProvier } from "../context/AuthContext";

export default function Root() {
  const queryClient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvier>
          <Header />
          <Outlet />
          <Footer />
        </AuthContextProvier>
      </QueryClientProvider>
    </div>
  );
}
