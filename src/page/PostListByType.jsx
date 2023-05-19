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
  const [selected, setSelected] = useState("newest");
  const {
    isLoading,
    error,
    data: Post,
  } = useQuery({
    queryKey: ["postType", param, selected],
    queryFn: () => getPostDataForType(param),
  });

  console.log(Post);
  console.log(param);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSelect = (e) => {
    setSelected(e.target.value);
    e.target.blur();
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
        <div className="flex flex-col items-center max-w-6xl mx-auto  gap-4">
          <div className="flex justify-end w-full">
            <select
              name="sortType"
              id="sortType"
              className="outline-none dark:text-white bg-transparent"
              onChange={handleSelect}
              defaultValue={selected}
            >
              <option value="newest">최신 게시물</option>
              <option value="oldest">오래된 게시물</option>
              <option value="AuthorAtoB">작가 가나다 순</option>
              <option value="like">좋아요 순</option>
              <option value="view">조회수 순</option>
            </select>
          </div>
          <ul className="flex gap-4 flex-col justify-center bg-neutral-50 dark:bg-gray-700 p-4 w-full">
            {
              Post &&
                selected === "newest" &&
                Post.sort((a, b) => b.createdAt - a.createdAt)
                  .slice(items * (page - 1), items * (page - 1) + items)
                  .map(
                    (post, index) => <PostCard key={post.id} post={post} /> //
                  ) //
            }
            {
              Post &&
                selected === "oldest" &&
                Post.sort((a, b) => a.createdAt - b.createdAt)
                  .slice(items * (page - 1), items * (page - 1) + items)
                  .map(
                    (post, index) => <PostCard key={post.id} post={post} /> //
                  ) //
            }
            {
              Post &&
                selected === "AuthorAtoB" &&
                Post.sort((a, b) => a.author.localeCompare(b.author))
                  .slice(items * (page - 1), items * (page - 1) + items)
                  .map(
                    (post, index) => <PostCard key={post.id} post={post} /> //
                  ) //
            }
            {
              Post &&
                selected === "like" &&
                Post.sort((a, b) => b.likes - a.likes)
                  .slice(items * (page - 1), items * (page - 1) + items)
                  .map(
                    (post, index) => <PostCard key={post.id} post={post} /> //
                  ) //
            }
            {
              Post &&
                selected === "view" &&
                Post.sort((a, b) => b.views - a.views)
                  .slice(items * (page - 1), items * (page - 1) + items)
                  .map(
                    (post, index) => <PostCard key={post.id} post={post} /> //
                  ) //
            }
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
