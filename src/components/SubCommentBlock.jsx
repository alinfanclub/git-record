import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@toast-ui/react-editor";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addSubComment } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import CancleButton from "./CancleButton";
import SubmitButton from "./SubmitButton";

export default function SubCommentBlock({ commentId, hideSub }) {
  const [comment, setComment] = useState();
  const editorRef = useRef();
  const { user } = useAuthContext();
  const postId = useParams().postId;
  const queryClient = useQueryClient();

  const uploadSubComment = useMutation(
    ({ comment, user, postId, commentId }) =>
      addSubComment(comment, user, postId, commentId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  const submitSubComment = (e) => {
    e.preventDefault();
    uploadSubComment.mutate(
      { comment, user, postId, commentId },
      {
        onSuccess: () => {
          editorRef.current.getInstance().setHTML("");
          hideSub();
        },
        onError: () => {
          alert("로그인은 하셨나요?")
          editorRef.current.getInstance().setHTML("");
        }
      }
    );
  };
  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setComment(data);
  };

  return (
    <>
      <form onSubmit={submitSubComment} className="pb-8">
        <div className="my-8">
          <Editor
            toolbarItems={""}
            initialValue=""
            previewStyle="vertical"
            height="200px"
            initialEditType="wysiwyg"
            useCommandShortcut={false}
            language="ko-KR"
            ref={editorRef}
            onChange={onChange}
            hideModeSwitch={true}
            placeholder="내용을 입력해보세요"
            extendedAutolinks={true}
            autofocus={false}
          />
        </div>
        <div className="flex justify-end gap-4">
          <SubmitButton text="댓글 작성" className="" />
          <CancleButton text="취소" onClick={hideSub} />
        </div>
      </form>
    </>
  );
}
