import { Viewer } from "@toast-ui/react-editor";
import React, { useState } from "react";
import { deleteComments, getSubComments } from "../api/firebase";
import { AiFillDelete } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubCommentBlock from "./SubCommentBlock";
import SubCommentShow from "./SubCommentShow";

export default function ShowComment({
  commentData,
  commentData: { comment, userInfo, commentId },
  param,
}) {
  const queryClient = useQueryClient();
  const [subComment, setSubComment] = useState(false);
  const { data: subComments } = useQuery(["subComments"], () =>
    getSubComments(param, commentId)
  );
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

  const toggleSubComment = () => {
    setSubComment(!subComment);
  };

  const hideSub = () => {
    setSubComment(false);
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
      <button type="button" onClick={toggleSubComment}>
        답변 작성
      </button>
      {subComment && (
        <div className="">
          <SubCommentBlock commentId={commentId} hideSub={hideSub} />
        </div>
      )}
      {
        <ul>
          {subComments &&
            subComments
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((obj) => (
                <SubCommentShow key={obj.SubCommentId} subComments={obj} />
              ))}
        </ul>
      }
    </li>
  );
}
