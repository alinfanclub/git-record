import React, { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { uploadImage } from "../api/UploadImage";
import { Cloudinary } from "@cloudinary/url-gen";

export default function EditorBlock() {
  const editorRef = useRef();
  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
  };

  const [imageId, setImageId] = useState([]);

  const getImagId = (obj) => {
    console.log(obj);
    console.log(imageId);
    setImageId([...imageId, obj]);
    console.log(imageId);
  };

  const onUploadImage = async (blob, callback) => {
    console.log(blob);
    uploadImage(blob).then((data) => {
      const { url, public_id } = data;
      getImagId(public_id);
      callback(url, "");
    });
    // return false;
  };
  return (
    <>
      <Editor
        initialValue="hello react editor world!"
        previewStyle="vertical"
        height="1000px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
        language="ko-KR"
        ref={editorRef}
        onChange={onChange}
        hideModeSwitch={true}
        plugins={[colorSyntax]}
        hooks={{
          addImageBlobHook: onUploadImage,
        }}
        extendedAutolinks={true}
        autofocus={false}
      />
      <button onClick={getImagId}>button</button>
    </>
  );
}
