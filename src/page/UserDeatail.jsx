import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getPostData } from "../api/firebase";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";

export default function UserDeatail() {
  const param = useParams().userId;
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({ queryKey: ["myPost"], queryFn: getPostData });
  return (
    <>
      {isLoading && <Spinner />}
      {error && <p>error!</p>}
      {
        <section className="p-4 sm:px-8 flex gap-10 flex-col mx-auto">
          {post && post.map((obj) => obj.userInfo.userUid).includes(param) ? (
            <ul className="flex gap-4 flex-col justify-center bg-neutral-50 p-4 rounded-xl">
              {post
                .filter((post) => post.userInfo.userUid === param)
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </ul>
          ) : (
            <p>게시글이 없어요!</p>
          )}
        </section>
      }
    </>
  );
}
