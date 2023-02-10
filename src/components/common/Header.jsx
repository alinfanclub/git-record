import React from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoginButton from "../LoginButton";
import UserProfile from "../UserProfile";
import { BsPencilSquare } from "react-icons/bs";

export default function Header() {
  const { user, login, logout } = useAuthContext();
  return (
    <header className="w-full flex justify-between border-b border-gray-300 p-2 items-center">
      <Link to={"/"}>Home</Link>
      <div className="flex items-center">
        {user && user.isAdmin && (
          <Link to="/post/new" className="mr-5">
            <BsPencilSquare className="text-2xl" />
          </Link>
        )}
        {user && <UserProfile user={user} />}
        {!user && <LoginButton text={"login"} onClick={login} />}
        {user && <LoginButton text={"logout"} onClick={logout} />}
      </div>
    </header>
  );
}
