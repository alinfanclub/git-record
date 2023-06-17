import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatAgo } from "../util/timeago";
import "./PostDetail.module.css";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import {
  addLkie,
  addUserLike,
  deleteHeart,
  getPostDataDetail,
  loseLkie,
  removePost,
  UserChekTrue,
  userLikeList,
} from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import CommentCreate from "../components/CommentCreate";
// import ShowComment from "../components/ShowComment";
import Comments from "../components/Comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useQuery } from "@tanstack/react-query";
import "react-quill/dist/quill.snow.css";

export default function PostDetail() {
  // const {
  //   state: { postTime },
  // } = useLocation();
  // console.log(postTime);

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const param = useParams().postId;
  const [text, setText] = useState();
  const [time, setTime] = useState();
  const [btnStop, setBtnStop] = useState(false);

  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: post,
  } = useQuery(
    ["postDetail", param],
    async () => await getPostDataDetail(param)
  );

  const { data: userLike } = useQuery({
    queryKey: ["userLike", param],
    queryFn: async () => userLikeList(param),
  });

  useEffect(() => {
    getPostDataDetail(param).then((res) => {
      setText(res);
    });
  }, [param]);

  // ~ useMutation

  const upHeart = useMutation(({ param, user }) => addUserLike(param, user), {
    onSuccess: () => queryClient.invalidateQueries(["userLike"]),
  });

  const removeHeart = useMutation(
    ({ param, user }) => deleteHeart(param, user),
    {
      onSuccess: () => queryClient.invalidateQueries(["userLike"]),
    }
  );

  const uplikenumber = useMutation(
    ({ param, post, user }) => addLkie(param, post, user, userLike),
    {
      onSuccess: () => queryClient.invalidateQueries(["postDetail"]),
    }
  );
  const loselikenumber = useMutation(
    ({ param, post, user }) => loseLkie(param, post, user),
    {
      onSuccess: () => queryClient.invalidateQueries(["postDetail"]),
    }
  );

  const mock = useMutation(({ param, post }) => UserChekTrue(param), {
    onSuccess: () => queryClient.invalidateQueries(["postAlert"]),
  });

  useEffect(() => {
    if (post) {
      const date = new Date(post.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = String(date.getHours()).padStart(2, 0);
      const minutes = String(date.getMinutes()).padStart(2, 0);
      const createdAtSimple = `${year}-${month}-${day} ${hour}:${minutes}`;
      setTime(createdAtSimple);
    }
  }, [post, param]);

  useEffect(() => {
    if (post) {
      if (user) {
        if (post.userInfo.userUid === user.uid) {
          mock.mutate({ param });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, post, param]);
  // console.log(post);

  // console.log(1);

  // const mockClick = () => {
  //   mock.mutate(
  //     { param },
  //     {
  //       onSuccess: () => {
  //         console.log("mock");
  //       },
  //     }
  //   );
  // };

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
      navigate(`/post/update/${post.id}`, { state: { post }, replace: true });
    } else {
      alert("권한이 없습니다.");
    }
  };

  const handleHeartUp = () => {
    setBtnStop(true);
    uplikenumber.mutate(
      { param, post, user },
      {
        onSuccess: () => {
          upHeart.mutate({ param, user });
          setBtnStop(false);
        },
      }
    );
  };

  const handleHeartDown = () => {
    setBtnStop(true);
    loselikenumber.mutate(
      { param, post, user },
      {
        onSuccess: () => {
          removeHeart.mutate({ param, user });
          setBtnStop(false);
        },
      }
    );
  };

  return (
    <>
      {error && "알 수 없는 에러 뒤로 돌아가주세요!"}
      {isLoading && <Spinner />}
      <div className="w-11/12 2xl:w-2/5 my-0 mx-auto min-h-half sm:min-h-full">
        {/* <button onClick={mockClick}>mock</button>
        <button onClick={mockClickTrue}>mockTrue</button> */}
        <div className="mb-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <img
                src={post && post.userInfo.userProfile}
                alt={post && post.userInfo.userName}
                className="w-10 h-10 rounded-full mr-2 bg-white object-cover"
              />
              <div>
                <p className="mr-2 dark:text-white">
                  {post && post.userInfo.userName}
                </p>
                {post && (
                  <small className="dark:text-white">
                    {time} ({formatAgo(post && post.createdAt, "ko")})
                    {post.fixed && <span className="ml-2">수정됨</span>}
                  </small>
                )}
              </div>
            </div>
            {post && user && user.uid === post.userInfo.userUid && (
              <div className="cursor-pointer flex items-center gap-4  dark:text-white">
                <AiFillDelete onClick={deletePost} />
                <MdOutlineAutoFixHigh onClick={gotoUpdate} />
              </div>
            )}
          </div>
          <div className="flex items-end gap-2 my-4" id="detailFont">
            <h2 className="sm:text-2xl dark:text-white">
              {post && post.title}
            </h2>
            <small className=" dark:text-white">
              {post && post.author ? post.author : "작가 불명"}
            </small>
          </div>
        </div>
        {text && (
          <div
            className="ql-editor viewer"
            dangerouslySetInnerHTML={{ __html: text.text }}
          />
        )}
        <div className="mt-20 flex items-end gap-2 justify-end mb-5 flex-col ">
          <div className="flex dark:text-white items-center gap-2">
            <AiOutlineEye />
            <span>{post && post.views ? post.views : "0"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className={`${btnStop && "pointer-events-none"}`}>
              {userLike &&
              user &&
              userLike.map((obj) => obj.user).includes(user.uid) ? (
                <FcLike onClick={handleHeartDown} />
              ) : (
                <FcLikePlaceholder onClick={handleHeartUp} />
              )}
            </button>
            <span className="dark:text-white">{post && post.likes}</span>
          </div>
        </div>
      </div>
      {/* 댓글 컴포넌트 */}
      {/* 댓글 컴포넌트 */}
      <div className="pb-40">
        <CommentCreate />
        <Comments />
      </div>
    </>
  );
}
