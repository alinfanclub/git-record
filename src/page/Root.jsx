import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import { AuthContextProvier } from "../context/AuthContext";

export default function Root() {
  return (
    <div>
      <AuthContextProvier>
        <Header />
        <Outlet />
      </AuthContextProvier>
    </div>
  );
}
