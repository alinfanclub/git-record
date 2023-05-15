import React, { useState } from "react";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuthContext();
  const [side, setSide] = useState(false);

  const sideToggle = () => {
    setSide(!side);
  };

  return (
    <div className="relative">
      <div className="flex items-center shrink-0" onClick={sideToggle}>
        {/* <span className="hidden sm:block  mr-4">{displayName}</span> */}
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="w-10 h-10 rounded-full"
        />
      </div>
      {side && (
        <div className="block absolute top-[2.7rem] bg-white border border-grey right-0 sm:left-[50%] sm:translate-x-[-50%] w-[8rem] h-auto rounded-2xl shadow-md dark:border-gray-500/50 dark:bg-gray-800">
          {/* <Link to="/post/new" className="" replace>
              <BsPencilSquare className="text-2xl" />
            </Link> */}
          <div className="py-4 px-4 w-full flex justify-center dark:text-white">
            <Link to={`/user/${user.uid}`}>내가 쓴 글</Link>
          </div>
          <div className="border-gray-300 border-t py-4 px-4 flex justify-center">
            <LoginButton text={"logout"} onClick={logout} />
          </div>
        </div>
      )}
    </div>
  );
}
