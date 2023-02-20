import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoginButton from "../LoginButton";
import UserProfile from "../UserProfile";
import { BsPencilSquare } from "react-icons/bs";

export default function Header() {
  const { user, login, logout } = useAuthContext();
  const [side, setSide] = useState(false);
  const sideToggle = () => {
    setSide(!side);
  };
  return (
    <header className="w-full flex justify-between border-b border-gray-300 p-2 items-center sticky top-0 bg-white mb-4 z-50">
      <Link to={"/"}>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
      </Link>
      <div className="flex items-center">
        {user && (
          <Link to="/post/new" className="mr-5 hidden sm:block">
            <BsPencilSquare className="text-2xl" />
          </Link>
        )}
        {user && (
          <div className="relartive flex items-center mr-6" onClick={sideToggle}>
            <UserProfile user={user} />
            {side && (
              <div className="block sm:hidden absolute top-16 bg-white border border-grey py-5 px-10 right-4">
                <div className="flex gap-4 items-center flex-col">
                  <Link to="/post/new" className="">
                    <BsPencilSquare className="text-2xl" />
                  </Link>
                  <LoginButton text={"logout"} onClick={logout} />
                  <Link to={`/user/${user.uid}`}>내가 쓴 글</Link>
                </div>
              </div>
            )}
            <div className="hidden sm:block"><Link to={`/user/${user.uid}`}>내가 쓴 글</Link></div>
          </div>
        )}
        {!user && <LoginButton text={"login"} onClick={login} />}
        <div className="hidden sm:block">
          {user && <LoginButton text={"logout"} onClick={logout} />}
        </div>
      </div>
    </header>
  );
}
