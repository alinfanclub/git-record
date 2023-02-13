import React, { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { uploadImage } from "../api/UploadImage";
import { addPost } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import "./EditorBlock.module.css";

export default function EditorBlock() {
  const [text, setText] = useState("");
  const [postInfo, setPostInfo] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const postId = uuid();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const editorRef = useRef();
  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setText(data);
    console.log(text);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((item) => ({ ...item, [name]: value }));
  };

  const onUploadImage = async (blob, callback) => {
    console.log(blob);
    uploadImage(blob).then((data) => {
      const { url } = data;
      callback(url, "");
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
      addPost(text, user, postInfo, postId).finally(() => {
        setIsUploading(false);
        navigate(`/post/${postId}`);
      });
    }
  };
  return (
    <>
      <form onSubmit={sendPost}>
        <input
          type="text"
          id="title"
          className="p-4 outline-none border border-gray-300 my-1 w-full"
          placeholder="제목을 입력해주세요"
          onChange={handleChange}
          name="title"
          required
        ></input>
        <input
          type="text"
          id="author"
          className="p-4 outline-none border border-gray-300 my-1 w-full"
          placeholder="작가를 입력해주세요"
          onChange={handleChange}
          name="author"
          required
        ></input>
        <select
          name="type"
          onChange={handleChange}
          className="p-4 outline-none border border-gray-300 my-1 w-full"
          required
        >
          <option value="" disabled selected>
            선택하세요
          </option>
          <option value="추천 시">추천 시</option>
          <option value="창작 시">창작 시</option>
          <option value="부스러기">부스러기</option>
        </select>
        <Editor
          initialValue=""
          previewStyle="vertical"
          height="500px"
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
        {isUploading && (
          <div className="w-screen h-screen bg-black/50 fixed top-0 left-0 z-20 flex items-center justify-center">
            <div className="text-white">is Loading...</div>
          </div>
        )}
        <button className="w-full bg-blue-300">button</button>
      </form>
    </>
  );
}
