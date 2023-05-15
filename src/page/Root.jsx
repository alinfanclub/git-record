import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { AuthContextProvier } from "../context/AuthContext";
import { DarkModeProvider } from "../context/DarkModeContext";
import WriteButton from "../components/WriteButton";

export default function Root() {
  const queryClient = new QueryClient();
  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <QueryClientProvider client={queryClient}>
        <AuthContextProvier>
          <DarkModeProvider>
            <Header />
            <Outlet />
            <Footer />
            <WriteButton />
          </DarkModeProvider>
        </AuthContextProvier>
      </QueryClientProvider>
    </div>
  );
}
