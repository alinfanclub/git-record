import React, { useEffect, useMemo, useRef, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import { deleteComments, updateComment } from "../api/firebase";
import { AiFillDelete } from "react-icons/ai";
import { BiDownArrow } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SubCommentBlock from "./SubCommentBlock";
import SubCommentShow from "./SubCommentShow";
import { useAuthContext } from "../context/AuthContext";
import { formatAgo } from "../util/timeago";
import { MdOutlineAutoFixHigh } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "@looop/quill-image-resize-module-react";
import Quill from "quill";
import SpinnerMic from "./SpinnerMic";
import { uploadImage } from "../api/UploadImage";
import SubmitButton from "./SubmitButton";
Quill.register("modules/ImageResize", ImageResize);

export default function ShowComment({
  commentData,
  commentData: { comment, userInfo, commentId, subcomments, fixed },
  param,
}) {
  // ~ useStates
  const queryClient = useQueryClient();
  const [subEditShow, setSubEditShow] = useState(false);
  const [showAllSubComments, setShowAllSubComments] = useState(true);
  const [subLenght, setSubLength] = useState();
  const [sub, setSub] = useState();
  const [text, setText] = useState(comment);
  const [imageLoding, setImageLoding] = useState(false);
  const [commentFix, setCommentFix] = useState(false);

  // ~ useRef
  const quillRef = useRef();

  // ~ useAuthContext
  const { user } = useAuthContext();

  // ~ subcomments
  useEffect(() => {
    if (subcomments) {
      setSub(Object.values(subcomments));
    } else {
      setSub("");
    }
  }, [subcomments]);

  // ~ subcomments length
  useEffect(() => {
    if (sub) {
      setSubLength(sub.length);
    }
  }, [sub]);

  // ~ 댓글 삭제 관련
  const removeComment = useMutation(
    ({ param, commentId }) => deleteComments(param, commentId),
    {
      onSuccess: () => queryClient.invalidateQueries(["comments"]),
    }
  );

  // ~ 댓글 삭제 함수
  const deleteComment = () => {
    if (window.confirm("정말 삭제하시나요?")) {
      removeComment.mutate({ param, commentId }, { onSuccess: () => {} });
      // deleteComments(param, commentId).then(() => {});
    }
  };

  // ~ 서브 댓글 토글
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

  // ~ 댓글 수정 에티터 관련
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
  const upDateComment = useMutation(
    ({ text, param, commentId }) => updateComment(text, param, commentId),
    { onSuccess: () => queryClient.invalidateQueries(["comments"]) }
  );

  const update = (e) => {
    e.preventDefault();
    upDateComment.mutate(
      { text, param, commentId },
      {
        onSuccess: () => {
          setCommentFix(!commentFix);
        },
      }
    );
  };

  return (
    <li className="h-auto w-full px-2 py-4 box-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4">
            <div>{userInfo.userName}</div>
            <img
              src={userInfo.userProfile}
              alt=""
              className="w-10 h-10 rounded-full mr-2"
            />
          </div>
          <span className="text-xs">
            ({formatAgo(commentData.createdAt, "ko")})
          </span>
          <span className="text-xs">{fixed && "수정됨"}</span>
        </div>
        {user && user.uid === userInfo.userUid && (
          <div className="flex gap-4">
            <AiFillDelete onClick={deleteComment} className="cursor-pointer" />
            <MdOutlineAutoFixHigh
              onClick={() => setCommentFix(!commentFix)}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="bg-neutral-50 rounded-xl py-10 px-4 my-2">
        {!commentFix && <Viewer initialValue={comment} />}
        {commentFix && (
          <form onSubmit={update}>
            <div className="relative">
              {imageLoding && <SpinnerMic text="댓글 다는 중..." />}
              <ReactQuill
                onChange={onChange}
                modules={modules}
                ref={quillRef}
                defaultValue={comment}
                className="min-h-[30vh] h-[fit-content] bg-white"
              />
            </div>
            <div className="w-full flex justify-end my-4">
              <SubmitButton text={"submit"} />
            </div>
          </form>
        )}
      </div>
      {/* subCommentArea */}
      <div className="my-8 pl-4">
        <div className="flex items-center">
          {subcomments && (
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
                  ? `총 댓글 : ${subLenght}개 보기`
                  : `총 댓글 : 0`}
              </p>
            </div>
          )}
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
