import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Viewer } from "@toast-ui/react-editor";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { romoveSubCommentDetail } from "../api/firebase";
import { AiFillDelete } from "react-icons/ai";
import { useAuthContext } from "../context/AuthContext";
import { formatAgo } from "../util/timeago";

export default function SubCommentCard({ data, param, commentId }) {
  const [subId, setSubId] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    setSubId(data.SubCommentId);
  }, [data.SubCommentId]);
  const { user } = useAuthContext();

  const queryClient = useQueryClient();
  const removeSubComment = useMutation(
    ({ param, commentId, subId }) =>
      romoveSubCommentDetail(param, commentId, subId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  const deleteSub = () => {
    if (user.uid === data.userInfo.userUid) {
      if (window.confirm("정말 삭제하시겠나요?")) {
        removeSubComment.mutate(
          { param, commentId, subId },
          {
            onSuccess: () => {
              navigate(`/post/${param}`);
            },
          }
        );
      }
    } else {
      alert("권한이 없습니다.");
    }
  };
  return (
    <>
      <li className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <div>{data.userInfo.userName}</div>
              <img
                src={data.userInfo.userProfile}
                alt=""
                className="w-10 h-10 rounded-full mr-2"
              />
            </div>
            <span className="text-sm">
              ({formatAgo(data.createdAt, "ko")})
            </span>
          </div>
          {user && user.uid === data.userInfo.userUid && (
            <button onClick={deleteSub} className="cursor-pointer">
              <AiFillDelete />
            </button>
          )}
        </div>
        <div className="bg-neutral-50 rounded-xl py-10 px-4 my-2t">
          <Viewer initialValue={data.comment} />
        </div>
      </li>
    </>
  );
}
