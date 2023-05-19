import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoginButton from "../LoginButton";
import UserProfile from "../UserProfile";
import { HiMoon, HiSun } from "react-icons/hi";
// import { BsBell } from "react-icons/bs";
// import { getPostData } from "../../api/firebase";
// // import { useQuery } from "@tanstack/react-query";
// import AlertList from "../AlertList";
import { useDarkMode } from "../../context/DarkModeContext";
import { useModalStore } from "../../store/store";
import { AiOutlineSearch } from "react-icons/ai";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, login } = useAuthContext();
  const openSearchToggle = useModalStore((state) => state.openSearchToggle);

  return (
    <header className="w-full flex justify-between border-b border-gray-300 dark:border-gray-500/50 p-2 items-center sticky top-0 bg-white mb-4 z-50 sm:px-[4.5rem] dark:bg-gray-800">
      <Link to={"/"} className="w-56">
        {!darkMode ? (
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
        ) : (
          <img src={`${process.env.PUBLIC_URL}/logo_dark.png`} alt="logo" />
        )}
      </Link>
      <div className="flex items-center gap-4">
        <nav className="">
          <ul className="flex items-center gap-4 hidden sm:flex dark:text-white items-center">
            <li>
              <Link to={"/post/creation/list"}>창작 시</Link>
            </li>
            <li>
              <Link to={"/post/recomend/list"}>추천 시</Link>
            </li>
            <li>
              <Link to={"/post/etc/list"}>부스러기들</Link>
            </li>
            <li>
              <Link to={"/post/notice/list"}>공지사항</Link>
            </li>
          </ul>
        </nav>
        <div
          onClick={openSearchToggle}
          className="sm:w-36 sm:bg-white sm:h-8 sm:rounded-2xl sm:px-2 flex items-center sm:border sm:border-gray-500"
        >
          <AiOutlineSearch className="dark:text-white dark:sm:text-gray-500" />
        </div>
        <button onClick={toggleDarkMode} className="dark:text-white">
          {!darkMode && <HiMoon />}
          {darkMode && <HiSun />}
        </button>
        {user && (
          <div className="">
            <UserProfile user={user} />
          </div>
        )}
        {!user && <LoginButton text={"login"} onClick={login} />}
      </div>
    </header>
  );
}
