import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getPostData } from "../api/firebase";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";

export default function PostListByType() {
  const {
    isLoading,
    error,
    data: Post,
  } = useQuery({ queryKey: ["post"], queryFn: getPostData });
  console.log(Post);
  const param = useParams().type;
  console.log(param);

  return (
    <>
      {error && <NotFound />}
      {isLoading && <Spinner />}
      <div className="p-4 sm:px-8 flex gap-10 flex-col mx-auto min-h-screen">
        <ul className="flex gap-4 flex-col justify-center bg-neutral-50 p-4">
          {Post &&
            Post.filter((post) => post.type === param)
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((post, index) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
    </>
  );
}
