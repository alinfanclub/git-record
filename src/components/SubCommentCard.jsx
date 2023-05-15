import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Viewer } from "@toast-ui/react-editor";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { romoveSubCommentDetail, updateSubComments } from "../api/firebase";
import { AiFillDelete } from "react-icons/ai";
import { useAuthContext } from "../context/AuthContext";
import { formatAgo } from "../util/timeago";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import ReactQuill from "react-quill";
import SpinnerMic from "./SpinnerMic";
import SubmitButton from "./SubmitButton";
import { uploadImage } from "../api/UploadImage";

export default function SubCommentCard({ data, param, commentId }) {
  const [subId, setSubId] = useState();
  const [commentFix, setCommentFix] = useState(false);
  const [text, setText] = useState(data.comment);
  const [imageLoding, setImageLoding] = useState(false);

  const navigate = useNavigate();

  const quillRef = useRef();

  useEffect(() => {
    setSubId(data.SubCommentId);
  }, [data.SubCommentId]);
  const { user } = useAuthContext();

  const queryClient = useQueryClient();
  const removeSubComment = useMutation(
    ({ param, commentId, subId }) =>
      romoveSubCommentDetail(param, commentId, subId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  const deleteSub = () => {
    if (user.uid === data.userInfo.userUid) {
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
    } else {
      alert("권한이 없습니다.");
    }
  };

  const onChange = (text) => {
    setText(text);
  };

  const onUploadImage = async () => {
    const input = document.createElement("input");
    // 속성 써주기
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.addEventListener("change", async () => {
      setImageLoding(true);
      const file = input.files[0];
      uploadImage(file).then((data) => {
        const { url } = data;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", url);
        setImageLoding(false);
      });
    });
    // return false;
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

  // ~ 댓글 수정
  // { param, commentId, subId }
  const updateSubComment = useMutation(
    ({ param, commentId, subId, text }) =>
      updateSubComments(param, commentId, subId, text),
    { onSuccess: () => queryClient.invalidateQueries(["comments"]) }
  );

  const update = (e) => {
    e.preventDefault();
    updateSubComment.mutate(
      { param, commentId, subId, text },
      {
        onSuccess: () => {
          setCommentFix(!commentFix);
        },
      }
    );
  };
  return (
    <>
      <li className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <div className="dark:text-white">{data.userInfo.userName}</div>
              <img
                src={data.userInfo.userProfile}
                alt=""
                className="w-10 h-10 rounded-full mr-2"
              />
            </div>
            <span className="text-xs dark:text-white">
              ({formatAgo(data.createdAt, "ko")})
            </span>
            <span className="text-xs dark:text-white">
              {data.fixed && "수정됨"}
            </span>
          </div>
          {user && user.uid === data.userInfo.userUid && (
            <div className="flex gap-4 dark:text-white">
              <AiFillDelete onClick={deleteSub} className="cursor-pointer" />
              <MdOutlineAutoFixHigh
                className="cursor-pointer"
                onClick={() => setCommentFix(!commentFix)}
              />
            </div>
          )}
        </div>
        <div className="bg-neutral-50 rounded-xl py-10 px-4 my-2t dark:bg-gray-700">
          {!commentFix && <Viewer initialValue={data.comment} />}
          {commentFix && (
            <form onSubmit={update}>
              <div className="relative">
                {imageLoding && <SpinnerMic text="댓글 다는 중..." />}
                <ReactQuill
                  onChange={onChange}
                  modules={modules}
                  ref={quillRef}
                  defaultValue={data.comment}
                  className="min-h-[30vh] h-[fit-content] bg-white"
                />
              </div>
              <div className="w-full flex justify-end my-4">
                <SubmitButton text={"submit"} />
              </div>
            </form>
          )}
        </div>
      </li>
    </>
  );
}
