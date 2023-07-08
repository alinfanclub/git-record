import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addSubComment, UserChekFalse } from "../api/firebase";
import CancleButton from "./CancleButton";
import SubmitButton from "./SubmitButton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "@looop/quill-image-resize-module-react";
import Quill from "quill";
import { uploadImage } from "../api/UploadImage";
import SpinnerMic from "./SpinnerMic";
import { PersonalUserDataStore } from "../store/store";
import container from "../util/editorModule";
Quill.register("modules/ImageResize", ImageResize);

export default function SubCommentBlock({ commentId, hideSub }) {
  const [comment, setComment] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef();
  const postId = useParams().postId;
  const queryClient = useQueryClient();

  const personal = PersonalUserDataStore((state) => state.personal);

  const uploadSubComment = useMutation(
    ({ comment, personal, postId, commentId }) =>
      addSubComment(comment, personal, postId, commentId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  const checkFalse = useMutation(({ postId }) => UserChekFalse(postId), {
    onSuccess: () => queryClient.invalidateQueries(["postAlert"]),
  });

  const submitSubComment = (e) => {
    const editor = quillRef.current.getEditor();
    e.preventDefault();
    uploadSubComment.mutate(
      { comment, personal, postId, commentId },
      {
        onSuccess: () => {
          editor.setText("");
          hideSub();
          checkFalse.mutate({ postId });
        },
        onError: () => {
          alert("로그인은 하셨나요?");
          editor.setText("");
        },
      }
    );
  };
  const onChange = (text) => {
    setComment(text);
  };

  const onUploadImage = async () => {
    const input = document.createElement("input");
    // 속성 써주기
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.addEventListener("change", async () => {
      setIsUploading(true);
      const file = input.files[0];
      uploadImage(file).then((data) => {
        const { url } = data;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", url);
        setIsUploading(false);
      });
    });
    // return false;
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: container,
        handlers: {
          // handlers object will be merged with default handlers object
          image: onUploadImage,
        },
      },
      ImageResize: { modules: ["Resize"] },
    };
  }, []);

  return (
    <>
      <form onSubmit={submitSubComment} className="pb-8 relative">
        {isUploading && <SpinnerMic text="댓글 다는 중..." />}
        <div className="my-8">
          <ReactQuill onChange={onChange} modules={modules} ref={quillRef} />
        </div>
        <div className="flex justify-end gap-4">
          <SubmitButton text="댓글 작성" className="" />
          <CancleButton text="취소" onClick={hideSub} />
        </div>
      </form>
    </>
  );
}
