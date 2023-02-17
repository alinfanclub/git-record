import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAgo } from "../util/timeago";

export default function PostCard({
  post,
  post: { id, userInfo, title, type, createdAt },
}) {
  const navigate = useNavigate();
  return (
    <li
      className="flex items-centr flex-col sm:flex-row justify-between border-b border-t border-gray-300 p-4 cursor-pointer"
      onClick={() => {
        navigate(`/post/${id}`);
      }}
    >
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        {title}
        <small>
          {type
            ? type === "creation"
              ? "창작시"
              : type === "recomend"
              ? "추천시"
              : type === "etc"
              ? "부스러기"
              : "미분류"
            : null}
        </small>
        <small>{formatAgo(createdAt, "ko")}</small>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <p>{userInfo.userName}</p>
        <img
          src={userInfo.userProfile}
          alt={userInfo.displayName}
          className="w-10 h-10 rounded-full"
        />
      </div>
    </li>
  );
}
