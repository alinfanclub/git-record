import React from "react";
import { Viewer } from "@toast-ui/react-editor";
import { useLocation, useNavigate } from "react-router-dom";
import { formatAgo } from "../util/timeago";
import "./PostDetail.module.css";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import { removePost } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";

export default function PostDetail() {
  const {
    state: { post },
  } = useLocation();
  console.log(post);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  const date = new Date(post.createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart("2", 0);
  const minutes = String(date.getMinutes()).padStart("2", 0);
  const createdAtSimple = `${year}-${month}-${day} ${hour}:${minutes}`;

  const deletePost = () => {
    if (post.userInfo.userUid === user.uid) {
      if (window.confirm("삭제 하시겠나요?")) {
        removePost(post.id).finally(() => {
          navigate(`/`);
        });
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  const gotoUpdate = () => {
    if (post.userInfo.userUid === user.uid) {
      navigate(`/post/update/${post.id}`, { state: { post } });
    } else {
      alert("권한이 없습니다.");
    }
  };
  return (
    <div className="w-11/12 2xl:w-2/5 my-0 mx-auto">
      <div className="mb-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center mb-4">
            <img
              src={post.userInfo.userProfile}
              alt={post.userInfo.userName}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="mr-2">{post.userInfo.userName}</p>
              <small>
                {createdAtSimple} ({formatAgo(post.createdAt, "ko")})
              </small>
            </div>
          </div>
          <div className="cursor-pointer flex items-center gap-4">
            <AiFillDelete onClick={deletePost} />
            <MdOutlineAutoFixHigh onClick={gotoUpdate} />
          </div>
        </div>
        <div className="flex items-end gap-2 my-4">
          <h2 className="text-2xl">{post.title}</h2>
          <small>{post.author ? post.author : "작가 불명"}</small>
        </div>
      </div>

      <Viewer initialValue={post.text}></Viewer>
    </div>
  );
}
