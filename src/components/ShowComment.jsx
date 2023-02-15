import { Viewer } from "@toast-ui/react-editor";
import React from "react";
import { deleteComments } from "../api/firebase";
import { AiFillDelete } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ShowComment({
  commentData,
  commentData: { comment, userInfo, commentId },
  param,
}) {
  const queryClient = useQueryClient();

  const removeComment = useMutation(
    ({ param, commentId }) => deleteComments(param, commentId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );
  const deleteComment = () => {
    if (window.confirm("정말 삭제하시나요?")) {
      removeComment.mutate({ param, commentId }, { onSuccess: () => {} });
      // deleteComments(param, commentId).then(() => {});
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
          <AiFillDelete />
        </div>
      </div>
      <div className="">
        <Viewer initialValue={comment} />
      </div>
    </li>
  );
}
