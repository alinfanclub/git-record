import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDataForUsername } from "../api/firebase";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import Pagination from "react-js-pagination";

export default function UserDeatail() {
  const param = useParams().userId;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(10);
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({
    queryKey: ["myPost"],
    queryFn: () => getPostDataForUsername(param),
  });

  const handlePageChange = (page) => {
    setPage(page);
  };
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

                .slice(items * (page - 1), items * (page - 1) + items)
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </ul>
          ) : (
            <p>게시글이 없어요!</p>
          )}

          <Pagination
            activePage={page}
            itemsCountPerPage={items}
            totalItemsCount={post ? post.length : 0}
            onChange={handlePageChange}
          ></Pagination>
        </section>
      }
    </>
  );
}
