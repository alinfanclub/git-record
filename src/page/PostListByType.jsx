import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getPostDataForType } from "../api/firebase";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import NotFound from "./NotFound";
import { useState } from "react";
import Pagination from "react-js-pagination";
import "./PostListByType.css";

export default function PostListByType() {
  const param = useParams().type;
  const [page, setPage] = useState(1);
  const [items] = useState(10);
  const {
    isLoading,
    error,
    data: Post,
  } = useQuery({
    queryKey: ["postType"],
    queryFn: () => getPostDataForType(param),
  });

  console.log(Post);
  console.log(param);

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <>
      {error && <NotFound />}
      {isLoading && <Spinner />}
      <div className="p-4 sm:px-8  min-h-screen items-center">
        <h2 className="text-center text-xl font-medium dark:text-white mb-10">
          {param
            ? param === "creation"
              ? "모든 창작시 들"
              : param === "recomend"
              ? "모든 추천시 들"
              : param === "etc"
              ? "모든 부스러기 들"
              : param === "notice"
              ? "공지사항"
              : "미분류"
            : null}
        </h2>
        <div>
          <ul className="flex gap-4 flex-col justify-center bg-neutral-50 dark:bg-gray-700 p-4 max-w-6xl mx-auto">
            {Post &&
              Post.slice(items * (page - 1), items * (page - 1) + items).map(
                (post, index) => <PostCard key={post.id} post={post} />
              )}
          </ul>
          <Pagination
            activePage={page}
            itemsCountPerPage={items}
            totalItemsCount={Post ? Post.length : 0}
            onChange={handlePageChange}
          ></Pagination>
        </div>
      </div>
    </>
  );
}
