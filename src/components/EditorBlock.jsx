import React, {useMemo, useRef, useState } from "react";
import { uploadImage } from "../api/UploadImage";
import { addPost } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import Spinner from "./Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "@looop/quill-image-resize-module-react";
import Quill from "quill";
import SpinnerMic from "./SpinnerMic";
import { PersonalUserDataStore } from "../store/store";
import container from "../util/editorModule";
Quill.register("modules/ImageResize", ImageResize);

export default function EditorBlock() {
  const [text, setText] = useState("");
  const [postInfo, setPostInfo] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoding, setImageLoding] = useState(false);

  const postId = uuid();
  const { user } = useAuthContext();
  const personal = PersonalUserDataStore((state) => state.personal);
  const navigate = useNavigate();

  const quillRef = useRef();

  const queryClient = useQueryClient();

  const uploadNewPost = useMutation(
    ({ text, personal, postInfo, postId }) =>
      addPost(text, personal, postInfo, postId),
    { onSuccess: () => queryClient.invalidateQueries(["post"]) }
  );

  const onChange = (text) => {
    setText(text);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((item) => ({ ...item, [name]: value }));
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

  const sendPost = (e) => {
    e.preventDefault();
    if (text === "") {
      alert("본문을 입력해주세요.");
      return false;
    } else {
      setIsUploading(true);
      uploadNewPost.mutate(
        { text, personal, postInfo, postId },
        {
          onSuccess: () => {
            setIsUploading(false);
            navigate(`/post/${postId}`);
          },
        }
      );
    }
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
      <form onSubmit={sendPost}>
        <input
          type="text"
          id="title"
          className="p-4 outline-none border border-gray-300 my-1 w-full sm:text-lg dark:bg-gray-500/20 dark:text-white"
          placeholder="제목을 입력해주세요"
          onChange={handleChange}
          name="title"
          required
        ></input>
        <input
          type="text"
          id="author"
          className="p-4 outline-none border border-gray-300 my-1 w-full text-xs sm:text-lg  dark:bg-gray-500/20 dark:text-white"
          placeholder={`작가(혹은 본인)를(을) 입력해주세요 ex)${personal.userDisplayName}`}
          onChange={handleChange}
          name="author"
          required
        ></input>
        <select
          name="type"
          onChange={handleChange}
          className="p-4 outline-none border border-gray-300 my-1 w-full  dark:bg-gray-500/20 dark:text-white"
          required
          value={postInfo ? postInfo.type : ""}
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
            className="min-h-[30vh] h-[fit-content]"
          />
        </div>
        {isUploading && <Spinner />}
        <div className="mt-4 flex">
          <SubmitButton text="글 작성" />
        </div>
      </form>
    </>
  );
}
