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
import SubmitButton from "./SubmitButton";
import Spinner from "./Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditorBlock() {
  const [text, setText] = useState("");
  const [postInfo, setPostInfo] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const postId = uuid();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const editorRef = useRef();

  const queryClient = useQueryClient();

  const uploadNewPost = useMutation(
    ({ text, user, postInfo, postId }) => addPost(text, user, postInfo, postId),
    { onSuccess: () => queryClient.invalidateQueries(["post"]) }
  );

  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setText(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((item) => ({ ...item, [name]: value }));
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
  const sendPost = (e) => {
    e.preventDefault();
    if (text === "") {
      alert("본문을 입력해주세요.");
      return false;
    } else {
      setIsUploading(true);
      uploadNewPost.mutate(
        { text, user, postInfo, postId },
        {
          onSuccess: () => {
            setIsUploading(false);
            navigate(`/post/${postId}`);
          },
        }
      );
      // addPost(text, user, postInfo, postId).finally(() => {
      //   setIsUploading(false);
      //   navigate(`/post/${postId}`);
      // });
    }
  };
  return (
    <>
      <form onSubmit={sendPost}>
        <input
          type="text"
          id="title"
          className="p-4 outline-none border border-gray-300 my-1 w-full sm:text-lg"
          placeholder="제목을 입력해주세요"
          onChange={handleChange}
          name="title"
          required
        ></input>
        <input
          type="text"
          id="author"
          className="p-4 outline-none border border-gray-300 my-1 w-full text-xs sm:text-lg"
          placeholder={`작가(혹은 본인)를(을) 입력해주세요 ex)${user.displayName}`}
          onChange={handleChange}
          name="author"
          required
        ></input>
        <select
          name="type"
          onChange={handleChange}
          className="p-4 outline-none border border-gray-300 my-1 w-full"
          required
          value=""
        >
          <option value="" disabled>
            선택하세요
          </option>
          <option value="recomend">추천 시</option>
          <option value="creation">창작 시</option>
          <option value="etc">부스러기</option>
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
        {isUploading && <Spinner />}
        <div className="mt-4 flex">
          <SubmitButton text="글 작성" />
        </div>
      </form>
    </>
  );
}
