import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getComments } from "../api/firebase";
import ShowComment from "./ShowComment";

export default function Comments() {
  const param = useParams().postId;
  const { data: comments } = useQuery(["comments", param], () =>
    getComments(param)
  );
  // console.log(comments);
  return (
    <>
      {comments && (
        <div className="w-11/12 mx-auto 2xl:w-2/5 ">
          <h4 className="text-md text-gray-400 mt-10 mb-4">
            총 댓글 : {comments.length}
          </h4>
          <ul id="commentList">
            {comments &&
              comments
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((obj) => (
                  <ShowComment
                    key={obj.commentId}
                    commentData={obj}
                    param={param}
                    fixed={obj.fixed}
                  />
                ))}
          </ul>
        </div>
      )}
    </>
  );
}
