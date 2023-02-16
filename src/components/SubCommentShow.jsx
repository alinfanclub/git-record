import { Viewer } from "@toast-ui/react-editor";
import React from "react";

export default function SubCommentShow({ subComments }) {
  return (
    <>
      <Viewer initialValue={subComments.comment} />
    </>
  );
}
