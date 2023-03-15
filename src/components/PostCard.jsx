import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAgo } from "../util/timeago";
import { AiTwotoneHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { useAuthContext } from "../context/AuthContext";

export default function PostCard({
  post,
  post: { id, userInfo, title, type, createdAt },
}) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  return (
    <li
      className="flex items-centr flex-col justify-between border-b border-t border-gray-300 p-4 cursor-pointer"
      onClick={() => {
        navigate(`/post/${id}`);
      }}
    >
      <div className="max-[300px]:flex-col max-[300px]:items-start max-[300px]:gap-2  flex items-center gap-4 mb-4 sm:mb-0 relative sm:items-center">
        <span className="max-[300px]:max-w-s max-[300px]:truncate max-w-ssm">{title}</span>
        <span className="flex gap-4">
          <small className="text-stone-600 font-light">
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
          <small className="text-stone-600 font-light">{formatAgo(createdAt, "ko")}</small>
        </span>
        <small className="absolute top-1/2 -translate-y-1/2 -left-6 sm:relative sm:translate-y-0 sm:top-0 sm:-left-0">
          {user &&
          post.userInfo.userUid === user.uid &&
          post.readCheck === false ? (
            <div className="text-amber-400 text-2xl">
              <GoPrimitiveDot />
            </div>
          ) : null}
        </small>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <p>{userInfo.userName}</p>
        <img
          src={userInfo.userProfile}
          alt={userInfo.displayName}
          className="w-10 h-10 rounded-full max-[300px]:hidden"
        />
        <div className="flex items-center gap-2">
          <AiTwotoneHeart />
          <span>
            {post.userLike ? Object.values(post.userLike).length : "0"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BiCommentDetail />
          <span>
            {post.comments ? Object.values(post.comments).length : "0"}
          </span>
        </div>
      </div>
    </li>
  );
}
