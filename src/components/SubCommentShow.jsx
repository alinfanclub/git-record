import React from "react";
import SubCommentCard from "./SubCommentCard";

export default function SubCommentShow({ data, param, commentId }) {
  return (
    <ul className="my-4">
      {data
        ? data
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((obj) => (
              <SubCommentCard
                key={obj.SubCommentId}
                data={obj}
                param={param}
                commentId={commentId}
              />
            ))
        : null}
    </ul>
  );
}
