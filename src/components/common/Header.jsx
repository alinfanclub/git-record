import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoginButton from "../LoginButton";
import UserProfile from "../UserProfile";
import { HiMoon, HiSun } from "react-icons/hi";
import { useDarkMode } from "../../context/DarkModeContext";
import { useModalStore, PersonalUserDataStore } from "../../store/store";
import { AiOutlineSearch } from "react-icons/ai";
import { addUser, getUserUseinInfo } from "../../api/firebase";

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, login } = useAuthContext();
  const openSearchToggle = useModalStore((state) => state.openSearchToggle);
  const addPersonal = PersonalUserDataStore((state) => state.addPersonal)
  useEffect(() => {
    async function getUser() {
      await addUser(user)
      getUserUseinInfo(user).then(res => {
        addPersonal(res);
      });
    }
    if (user) {
      getUser();
    }
  }, [user, addPersonal]);

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
