import React, { useState } from "react";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiMoon, HiSun } from "react-icons/hi";

export default function UserProfile() {
  const { user, logout } = useAuthContext();
  const [side, setSide] = useState(true);

  const sideToggle = () => {
    setSide(!side);
  };

  const { darkMode, toggleDarkMode } = useDarkMode();

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
        <>
          <div className="block absolute top-[2.7rem] bg-white border border-grey right-0 sm:left-[50%] sm:translate-x-[-50%] w-[8rem] h-auto rounded-2xl shadow-md dark:border-gray-500/50 dark:bg-gray-800 menuOpen hidden sm:block">
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
          <div className="sm:hidden w-full h-full backdrop-blur-xl fixed top-0 left-0 z-50"></div>
          <section className="sm:hidden fixed top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-500 rounded-3xl p-4 m_menu z-[60] shadow-2xl">
            <article className="flex items-center justify-between pb-8">
              <div className="w-56">
                {!darkMode ? (
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
                ) : (
                  <img
                    src={`${process.env.PUBLIC_URL}/logo_dark.png`}
                    alt="logo"
                  />
                )}
              </div>
              <button
                onClick={() => setSide(false)}
                className="text-4xl dark:text-white"
              >
                <IoIosCloseCircleOutline />
              </button>
            </article>
            <article className=" border-gray-500 dark:border-neutral-300 border-t border-b py-8">
              <ul className="dark:text-white flex flex-col gap-8 text-2xl">
                <li onClick={() => setSide(false)}>
                  <Link to={"/post/creation/list"}>창작 시</Link>
                </li>
                <li onClick={() => setSide(false)}>
                  <Link to={"/post/recomend/list"}>추천 시</Link>
                </li>
                <li onClick={() => setSide(false)}>
                  <Link to={"/post/etc/list"}>부스러기들</Link>
                </li>
                <li onClick={() => setSide(false)}>
                  <Link to={"/post/notice/list"}>공지사항</Link>
                </li>
              </ul>
            </article>
            <article className="border-gray-500 dark:border-neutral-300 border-b py-8">
              <ul className="dark:text-white flex flex-col gap-8 text-2xl">
                <li onClick={() => setSide(false)}>
                  <Link to={`/user/${user.uid}`}>내가 쓴 글</Link>
                </li>
              </ul>
            </article>
            <article className="pt-8 flex items-center justify-between">
              <button onClick={logout} className="dark:text-white text-2xl">
                log out
              </button>
              <button
                onClick={toggleDarkMode}
                className="dark:text-white text-3xl"
              >
                {!darkMode && <HiMoon />}
                {darkMode && <HiSun />}
              </button>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
