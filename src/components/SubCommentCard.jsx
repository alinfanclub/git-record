import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Viewer } from "@toast-ui/react-editor";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { romoveSubCommentDetail } from "../api/firebase";

export default function SubCommentCard({ data, param, commentId }) {
  const [subId, setSubId] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    setSubId(data.SubCommentId);
  }, [data.SubCommentId]);

  const queryClient = useQueryClient();
  const removeSubComment = useMutation(
    ({ param, commentId, subId }) =>
      romoveSubCommentDetail(param, commentId, subId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  const deleteSub = () => {
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
  };
  return (
    <>
      <li className="flex">
        <Viewer initialValue={data.comment} />
        <button onClick={deleteSub}>삭제</button>
      </li>
    </>
  );
}
