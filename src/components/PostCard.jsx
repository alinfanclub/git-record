import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAgo } from "../util/timeago";
import { AiOutlineEye, AiTwotoneHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { BsDot } from "react-icons/bs`";
import { useAuthContext } from "../context/AuthContext";
import { useModalStore } from "../store/store";
import { upView } from "../api/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function PostCard({
  post,
  post: { id, userInfo, title, createdAt, author },
}) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const searchClose = useModalStore((state) => state.searchClose);

  const queryClient = useQueryClient();

  const handleViewup = useMutation(({ id, post }) => upView(id, post), {
    onSuccess: () => queryClient.invalidateQueries(["postDetail"]),
  });

  const moveDetailPage = (id) => {
    navigate(`/post/${id}`);
    searchClose();
    handleViewup.mutate({ id, post });
  };
  return (
    <li className=" flex-col items-centr justify-between border-b first:border-t border-gray-300 p-2 cursor-pointe gap-4 py-4 flex ">
      <div className="flex items-center gap-4 ml-auto justify-between w-full">
        <div className="flex gap-2 items-center">
          <img
            src={userInfo.userProfile}
            alt={userInfo.displayName}
            className="w-8 h-8 rounded-full max-[300px]:hidden"
            onClick={() => {
              navigate(`/user/${userInfo.userUid}`);
            }}
          />
          <small
            onClick={() => {
              navigate(`/user/${userInfo.userUid}`);
            }}
            className="dark:text-gray-100/80 text-gray-900"
          >
            {userInfo.userName}
          </small>
          <span className="flex gap-4">
            <small className="text-stone-600 font-light dark:text-gray-100/80">
              {formatAgo(createdAt, "ko")}
            </small>
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 dark:text-gray-100/80 text-gray-900">
            <AiTwotoneHeart />
            <span>
              {post.userLike ? Object.values(post.userLike).length : "0"}
            </span>
          </div>
          <div className="flex items-center gap-2 dark:text-white ">
            <BiCommentDetail />
            <span>
              {post.comments ? Object.values(post.comments).length : "0"}
            </span>
          </div>
          <div className="flex dark:text-white items-center gap-2">
            <AiOutlineEye />
            <span>{post && post.views ? post.views : "0"}</span>
          </div>
        </div>
      </div>
      <div className="max-[300px]:flex-col max-[300px]:items-start max-[300px]:gap-2  flex items-center gap-4 sm:mb-0 relative sm:items-center justify-between w-full">
        <span
          className="max-[300px]:max-w-s max-[300px]:truncate dark:text-white grow truncate text-lg font-[500] cursor-pointer text-gray-700 max-w-[13.2rem] sm:max-w-none"
          onClick={() => {
            moveDetailPage(id);
          }}
        >
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-stone-600 font-light dark:text-gray-100/80">
            <small>{author}</small>
          </span>
          <small className="absolute top-1/2 -translate-y-1/2 -left-6 sm:relative sm:translate-y-0 sm:top-0 sm:-left-0">
            {user &&
            post.userInfo.userUid === user.uid &&
            post.readCheck === false ? (
              <div className="text-amber-400 text-2xl">
                <BsDot />
              </div>
            ) : null}
          </small>
        </div>
      </div>
    </li>
  );
}
