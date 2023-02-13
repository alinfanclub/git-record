import React, { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import { useNavigate, useParams } from "react-router-dom";
import { formatAgo } from "../util/timeago";
import "./PostDetail.module.css";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import { getPostDataDetail, removePost } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";

export default function PostDetail() {
  // const {
  //   state: { postTime },
  // } = useLocation();
  // console.log(postTime);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  const param = useParams().postId;

  const [post, setPost] = useState();
  const [time, setTime] = useState();
  // const {
  //   isLoading,
  //   error,
  //   data: post,
  // } = useQuery(["post"], async () => await getPostDataDetail(param));

  useEffect(() => {
    getPostDataDetail(param)
      .then((res) => {
        return setPost(res);
      })
      .then(() => {
        if (post) {
          const date = new Date(post.createdAt);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hour = String(date.getHours()).padStart("2", 0);
          const minutes = String(date.getMinutes()).padStart("2", 0);
          const createdAtSimple = `${year}-${month}-${day} ${hour}:${minutes}`;
          setTime(createdAtSimple);
        }
      });
    // console.log(post);
  }, [post, param]);

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
    <>
      {!post && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 text-white text-4xl">
          Loading
        </div>
      )}
      <div className="w-11/12 2xl:w-2/5 my-0 mx-auto">
        <div className="mb-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <img
                src={post && post.userInfo.userProfile}
                alt={post && post.userInfo.userName}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className="mr-2">{post && post.userInfo.userName}</p>
                {post && (
                  <small>
                    {time} ({formatAgo(post && post.createdAt, "ko")})
                  </small>
                )}
              </div>
            </div>
            <div className="cursor-pointer flex items-center gap-4">
              <AiFillDelete onClick={deletePost} />
              <MdOutlineAutoFixHigh onClick={gotoUpdate} />
            </div>
          </div>
          <div className="flex items-end gap-2 my-4">
            <h2 className="text-2xl">{post && post.title}</h2>
            <small>{post && post.author ? post.author : "작가 불명"}</small>
          </div>
        </div>
        {post && <Viewer initialValue={post.text}></Viewer>}
      </div>
    </>
  );
}
