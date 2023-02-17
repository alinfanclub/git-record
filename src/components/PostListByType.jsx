import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getPostData } from "../api/firebase";

export default function PostListByType() {
  const {
    isLoading,
    error,
    data: PostType,
  } = useQuery({ queryKey: ["PostType"], queryFn: getPostData });
  const param = useParams();

  return <div>1</div>;
}
