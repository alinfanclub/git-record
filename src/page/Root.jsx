import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { AuthContextProvier } from "../context/AuthContext";
import ScrollToTop from "./ScrollToTop";

export default function Root() {
  const queryClient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvier>
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </AuthContextProvier>
      </QueryClientProvider>
    </div>
  );
}
