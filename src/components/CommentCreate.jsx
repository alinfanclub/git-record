import React, { useMemo, useRef, useState } from "react";

import { uploadImage } from "../api/UploadImage";
import SpinnerMic from "./SpinnerMic";
import { useParams } from "react-router-dom";
import { addComment, UserChekFalse } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import SubmitButton from "./SubmitButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "@looop/quill-image-resize-module-react";
import Quill from "quill";
Quill.register("modules/ImageResize", ImageResize);

export default function CommentCreate() {
  const { user } = useAuthContext();

  const [comment, seComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const quillRef = useRef();
  const postId = useParams().postId;
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onChange = (text) => {
    seComment(text);
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
      const editor = quillRef.current.getEditor();
      addComments.mutate(
        { comment, user, postId },
        {
          onSuccess: () => {
            setIsUploading(false);
            editor.setText("");
            checkFalse.mutate({ postId });
            // navigate(`/post/${postId}`);
          },
          onError: () => {
            alert("로그인은 하셨나요?");
            editor.setText("");
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

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ align: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, "link"],
          [
            {
              color: [
                "#000000",
                "#e60000",
                "#ff9900",
                "#ffff00",
                "#008a00",
                "#0066cc",
                "#9933ff",
                "#ffffff",
                "#facccc",
                "#ffebcc",
                "#ffffcc",
                "#cce8cc",
                "#cce0f5",
                "#ebd6ff",
                "#bbbbbb",
                "#f06666",
                "#ffc266",
                "#ffff66",
                "#66b966",
                "#66a3e0",
                "#c285ff",
                "#888888",
                "#a10000",
                "#b26b00",
                "#b2b200",
                "#006100",
                "#0047b2",
                "#6b24b2",
                "#444444",
                "#5c0000",
                "#663d00",
                "#666600",
                "#003700",
                "#002966",
                "#3d1466",
                "custom-color",
              ],
            },
            { background: [] },
          ],
          ["image", "video"],
          ["clean"],
        ],
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
      <div className="w-11/12 2xl:w-2/5 mx-auto relative">
        <form onSubmit={sendComment} className="relative">
          {isUploading && <SpinnerMic text="댓글 다는 중..." />}
          <input type="comment" />
          <ReactQuill onChange={onChange} modules={modules} ref={quillRef} />
          <div className="my-4">
            <SubmitButton text="댓글 달기" />
          </div>
        </form>
      </div>
    </>
  );
}
