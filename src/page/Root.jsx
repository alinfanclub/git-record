import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { AuthContextProvier } from "../context/AuthContext";
import { DarkModeProvider } from "../context/DarkModeContext";
import WriteButton from "../components/WriteButton";
import ScrollToTop from "./ScrollToTop";
import SearchPop from "../components/SearchPop";
import { useModalStore } from "../store/store";
import { PostListProvider } from "../context/PostListContext";

export default function Root() {
  const queryClient = new QueryClient();
  const location = useLocation().pathname.toString();
  const searchPop = useModalStore((state) => state.searchPop);
  console.log(location);

  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <QueryClientProvider client={queryClient}>
        <AuthContextProvier>
          <DarkModeProvider>
            <PostListProvider>
              <ScrollToTop />
              <Header />
              <Outlet />
              <Footer />
              {location !== "/post/new" && <WriteButton />}
              {searchPop && <SearchPop />}
            </PostListProvider>
          </DarkModeProvider>
        </AuthContextProvier>
      </QueryClientProvider>
    </div>
  );
}
