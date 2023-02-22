import { Editor } from "@toast-ui/react-editor";
import React, { useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { uploadImage } from "../api/UploadImage";
import SpinnerMic from "./SpinnerMic";
import { useParams } from "react-router-dom";
import { addComment, UserChekFalse } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import SubmitButton from "./SubmitButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CommentCreate() {
  const { user } = useAuthContext();

  const [comment, seComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const editorRef = useRef();
  const postId = useParams().postId;
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    seComment(data);
  };

  const onUploadImage = async (blob, callback) => {
    setIsUploading(true);
    uploadImage(blob).then((data) => {
      const { url } = data;
      callback(url, "");
      setIsUploading(false);
    });
    // return false;
  };

  const addComments = useMutation(
    ({ comment, user, postId }) => addComment(comment, user, postId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  const checkFalse = useMutation(({ postId }) => UserChekFalse(postId), {
    onSuccess: () => queryClient.invalidateQueries(["postAlert"]),
  });

  const sendComment = (e) => {
    e.preventDefault();
    if (comment === "") {
      alert("댓글을 입력해주세요.");
      return false;
    } else {
      setIsUploading(true);
      addComments.mutate(
        { comment, user, postId },
        {
          onSuccess: () => {
            setIsUploading(false);
            editorRef.current.getInstance().setHTML("");
            checkFalse.mutate({ postId });
            // navigate(`/post/${postId}`);
          },
          onError: () => {
            alert("로그인은 하셨나요?");
            editorRef.current.getInstance().setHTML("");
            setIsUploading(false);
          },
        }
      );
      // addComment(comment, user, postId).finally(() => {
      //   editorRef.current.getInstance().setHTML("");
      //   setIsUploading(false);
      //   navigate(`/post/${postId}`);
      // });
    }
  };

  return (
    <>
      <div className="w-11/12 2xl:w-2/5 mx-auto relative">
        <form onSubmit={sendComment} className="relative">
          {isUploading && <SpinnerMic text="댓글 다는 중..." />}
          <input type="comment" />
          <Editor
            initialValue={comment}
            previewStyle="vertical"
            height="200px"
            initialEditType="wysiwyg"
            useCommandShortcut={false}
            language="ko-KR"
            ref={editorRef}
            onChange={onChange}
            hideModeSwitch={true}
            plugins={[colorSyntax]}
            placeholder="내용을 입력해보세요"
            hooks={{
              addImageBlobHook: onUploadImage,
            }}
            extendedAutolinks={true}
            autofocus={false}
          />
          <div className="my-4">
            <SubmitButton text="댓글 달기" />
          </div>
        </form>
      </div>
    </>
  );
}
