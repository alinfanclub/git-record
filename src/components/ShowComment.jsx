import { Viewer } from "@toast-ui/react-editor";
import React, { useEffect, useState } from "react";
import { deleteComments } from "../api/firebase";
import { AiFillDelete } from "react-icons/ai";
import { BiDownArrow } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SubCommentBlock from "./SubCommentBlock";
import SubCommentShow from "./SubCommentShow";

export default function ShowComment({
  commentData,
  commentData: { comment, userInfo, commentId, subcomments },
  param,
}) {
  const queryClient = useQueryClient();
  const [subEditShow, setSubEditShow] = useState(false);
  const [showAllSubComments, setShowAllSubComments] = useState(true);
  const [subLenght, setSubLength] = useState();

  const [sub, setSub] = useState();
  useEffect(() => {
    if (subcomments) {
      setSub(Object.values(subcomments));
    } else {
      setSub("");
    }
  }, [subcomments]);

  useEffect(() => {
    if (sub) {
      setSubLength(sub.length);
    }

    console.log(sub);
  }, [sub]);

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

  const showAllSubCommentsToggle = () => {
    setShowAllSubComments(!showAllSubComments);
  };

  // ~ 답글 에디터 닫기
  const toggleSubComment = () => {
    setSubEditShow(!subEditShow);
  };
  // ~ 답글 에디터 작성 후 닫기 프롭 전달
  const hideSub = () => {
    setSubEditShow(false);
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
      {/* subCommentArea */}
      <div className="my-8 pl-4">
        <div className="flex items-center">
          <div
            className="flex items-center gap-4 text-brand cursor-pointer"
            onClick={showAllSubCommentsToggle}
          >
            <div className={showAllSubComments ? "rotate-180" : "rotate-0"}>
              <BiDownArrow className="text-xs" />
            </div>
            <p className="mr-4 text-xs flex items-center">
              {showAllSubComments
                ? "댓글 숨기기"
                : sub
                ? `총 댓글 : ${subLenght}`
                : `총 댓글 : 0`}
            </p>
          </div>
          <p className="text-xs cursor-pointer" onClick={toggleSubComment}>
            답글 달기
          </p>
        </div>
        <div className="border-l-2 pl-4">
          {subEditShow && (
            <div className="">
              <SubCommentBlock commentId={commentId} hideSub={hideSub} />
            </div>
          )}
          {showAllSubComments && (
            <div className=" pl-4">
              {sub && (
                <SubCommentShow
                  data={sub}
                  param={param}
                  commentId={commentId}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
