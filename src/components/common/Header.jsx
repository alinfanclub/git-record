import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoginButton from "../LoginButton";
import UserProfile from "../UserProfile";
import { BsPencilSquare } from "react-icons/bs";
// import { BsBell } from "react-icons/bs";
// import { getPostData } from "../../api/firebase";
// import { useQuery } from "@tanstack/react-query";
import AlertList from "../AlertList";

export default function Header() {
  const { user, login, logout } = useAuthContext();
  const [side, setSide] = useState(false);
  const [alertPop, setAlertPop] = useState(false);
  // const [alert, setAlert] = useState([]);
  const sideToggle = () => {
    setSide(!side);
    setAlertPop(false);
  };
  const alertToggle = () => {
    setAlertPop(!alertPop);
    setSide(false);
  };
  // const { data: post } = useQuery(
  //   ["postAlert"],
  //   async () => await getPostData()
  // );
  // useEffect(() => {
  //   if (user) {
  //     post && setAlert(post.filter((post) => post.readCheck === false));
  //   }
  // }, [post, user]);
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
        {/* <div>
          {user && (
            <div className="relative mr-5" onClick={alertToggle}>
              <BsBell className="text-xl" />
              {
                <div className="absolute -top-2 -right-2.5 bg-amber-400 rounded-full w-5 h-5 flex items-center justify-center text-white">
                  {alert.length}
                </div>
              }
            </div>
          )}
        </div> */}

        {alertPop && (
          <div className="block absolute top-16 bg-white border border-grey py-5 px-10 right-4">
            {alert.length === 0 ? (
              <p>없어요!</p>
            ) : (
              <div className="text-center">
                <h1 className="mb-4">새 댓글</h1>
                <ul className="w-20 flex flex-col gap-4" onClick={alertToggle}>
                  {alert.map((item) => (
                    <AlertList item={item} key={item.id} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {user && (
          <div
            className="relartive flex items-center sm:mr-6"
            onClick={sideToggle}
          >
            <UserProfile user={user} />
            {side && (
              <div className="block sm:hidden absolute top-16 bg-white border border-grey py-5 px-10 right-4">
                <div className="flex gap-4 items-center flex-col">
                  <Link to="/post/new" className="" replace>
                    <BsPencilSquare className="text-2xl" />
                  </Link>
                  <Link to={`/user/${user.uid}`}>내가 쓴 글</Link>
                  <LoginButton text={"logout"} onClick={logout} />
                </div>
              </div>
            )}
            <div className="hidden sm:block">
              <Link to={`/user/${user.uid}`}>내가 쓴 글</Link>
            </div>
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
