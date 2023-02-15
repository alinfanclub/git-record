import { Viewer } from "@toast-ui/react-editor";
import React from "react";
import { deleteComments } from "../api/firebase";

export default function ShowComment({
  commentData,
  commentData: { comment, userInfo, commentId },
  param,
}) {
  const deleteComment = () => {
    if (window.confirm("정말 삭제하시나요?")) {
      deleteComments(param, commentId).then(() => {});
    }
  };

  return (
    <li className="h-auto w-full px-2 py-4 box-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>{userInfo.userName}</div>
          <img
            src={userInfo.userProfile}
            alt=""
            className="w-10 h-10 rounded-full mr-2"
          />
        </div>
        <div className="" onClick={deleteComment}>
          버튼
        </div>
      </div>
      <div className="">
        <Viewer initialValue={comment} />
      </div>
    </li>
  );
}
