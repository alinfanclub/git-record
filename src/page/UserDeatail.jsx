import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDataForUsername, getUserThumbnail } from "../api/firebase";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import Pagination from "react-js-pagination";

export default function UserDeatail() {
  const param = useParams().userId;
  const [page, setPage] = useState(1);
  const [items] = useState(10);
  const [thumb, setThumb] = useState([]);
  const [postLength, setPostLength] = useState();
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({
    queryKey: ["myPost"],
    queryFn: () => getPostDataForUsername(param),
  });

  useEffect(() => {
    getUserThumbnail(param).then((res) => {
      setThumb(res.userInfo);
    });
  }, [param]);

  useEffect(() => {
    getPostDataForUsername(param).then((res) => {
      setPostLength(res.length);
    });
  }, [param]);
  const handlePageChange = (page) => {
    setPage(page);
  };
  return (
    <>
      {isLoading && <Spinner />}
      {error && <p>error!</p>}
      {
        <section className="p-4 sm:px-8 flex gap-10 flex-col mx-auto">
          <div className="flex justify-center flex-col items-center gap-[1rem]">
            <img
              src={thumb && thumb.userProfile}
              alt={thumb && thumb.userName}
              className="w-20 h-20 rounded-full max-[300px]:hidden"
            />
            <p className="text-xl font-bold dark:text-white">
              {thumb && thumb.userName}
            </p>
            <span className="dark:text-white">게시글 갯수 : {postLength}</span>
          </div>
          {post && post.map((obj) => obj.userInfo.userUid).includes(param) ? (
            <>
              <ul className="flex gap-4 flex-col justify-center bg-neutral-50 p-4 rounded-xl dark:bg-gray-700">
                {post
                  .slice(items * (page - 1), items * (page - 1) + items)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </ul>
            </>
          ) : (
            <p className="flex justify-center items-center h-[70vh]">
              게시글이 없어요!
            </p>
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
