import React, { useEffect, useMemo, useRef, useState } from "react";

import { uploadImage } from "../api/UploadImage";
import { updatePost } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import Spinner from "../components/Spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "@looop/quill-image-resize-module-react";
import Quill from "quill";
import SpinnerMic from "../components/SpinnerMic";
Quill.register("modules/ImageResize", ImageResize);

export default function UpdatePost() {
  const [text, setText] = useState("");
  const [postInfo, setPostInfo] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoding, setImageLoding] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const quillRef = useRef();

  const {
    state: { post },
  } = useLocation();

  useEffect(() => {
    setPostInfo(post);
    setText(post.text);
  }, [post]);

  // 에디터 덱스트
  const onChange = (text) => {
    setText(text);
  };

  // 타이틀, 타입
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((item) => ({ ...item, [name]: value }));
  };

  // 이미지 업로드
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

  // 수정하기
  const upDate = (e) => {
    e.preventDefault();
    if (post.userInfo.userUid === user.uid) {
      if (text === "") {
        alert("본문을 입력해주세요.");
        return false;
      } else {
        setIsUploading(true);
        const postId = post.id;
        updatePost(text, user, postInfo, postId).finally(() => {
          setIsUploading(false);
          navigate(`/post/${postId}`);
        });
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
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
      <form onSubmit={upDate} className="w-11/12 mx-auto min-h-screen">
        <input
          type="text"
          id="title"
          className="p-4 outline-none border border-gray-300 my-1 w-full sm:text-lg"
          placeholder="제목을 입력해주세요"
          onChange={handleChange}
          name="title"
          value={postInfo ? postInfo.title : post.title}
          required
        ></input>
        <input
          type="text"
          id="author"
          className="p-4 outline-none border border-gray-300 my-1 w-full sm:text-lg"
          placeholder={`작가(혹은 본인)를(을) 입력해주세요 ex)${user.displayName}`}
          onChange={handleChange}
          name="author"
          value={postInfo ? postInfo.author : post.author}
          required
        ></input>
        <select
          name="type"
          onChange={handleChange}
          className="p-4 outline-none border border-gray-300 my-1 w-full"
          value={postInfo ? postInfo.type : post.type}
          required
        >
          <option value="" disabled>
            선택하세요
          </option>
          <option value="recomend">추천 시</option>
          <option value="creation">창작 시</option>
          <option value="etc">부스러기</option>
          {user.isAdmin && <option value="notice">공지사항</option>}
        </select>
        <div className="relative">
          {imageLoding && <SpinnerMic text="댓글 다는 중..." />}
          <ReactQuill
            onChange={onChange}
            modules={modules}
            ref={quillRef}
            defaultValue={post.text}
          />
        </div>
        {isUploading && (
          <div className="w-screen h-screen bg-black/50 fixed top-0 left-0 z-20 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <div className="mt-4 flex">
          <SubmitButton text="글 작성" />
        </div>
      </form>
    </>
  );
}
