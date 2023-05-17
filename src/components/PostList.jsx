import { useQuery } from "@tanstack/react-query";
import { getPostData } from "../api/firebase";
import PostCard from "./PostCard";
import { useCookies } from "react-cookie";
import moment from "moment";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import WelcomePop from "./common/WelcomePop";

export default function PostList() {
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({ queryKey: ["post"], queryFn: getPostData });

  const COOKIE_KEY = "yaerHideModal";
  const [cookie, setCookie] = useCookies([COOKIE_KEY]);

  const closeModal = () => {
    const decade = moment();
    decade.add("3650", "d");
    setCookie(COOKIE_KEY, "true", {
      path: "/",
      expires: decade.toDate(),
    });
  };
  return (
    <section className="p-4 sm:px-8 flex gap-10 flex-col mx-auto min-h-screen sm:grid sm:grid-cols-2">
      {isLoading && <Spinner />}
      {error && <p>error!</p>}
      <div className="flex flex-col">
        <div className="mb-4 flex items-end gap-4">
          <div className="dark:text-white">
            창작 시 <small>최신 5개</small>
          </div>
          <Link
            to="post/creation/list"
            className="cursor-pointer dark:text-neutral-300 text-xs dark:hover:text-neutral-200"
          >
            더보기
          </Link>
        </div>
        <ul className="flex flex-col bg-neutral-50 p-4 rounded-xl dark:bg-gray-700 grow justify-start">
          {post &&
            post
              .filter((post) => post.type === "creation")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="mb-4 flex items-end gap-4">
          <div className="dark:text-white">
            추천 시 <small>최신 5개</small>
          </div>
          <Link
            to="post/recomend/list"
            className="cursor-pointer dark:text-neutral-300 text-xs dark:hover:text-ne"
          >
            더보기
          </Link>
        </div>
        <ul className="flex flex-col bg-neutral-50 p-4 rounded-xl dark:bg-gray-700 grow justify-start">
          {post &&
            post
              .filter((post) => post.type === "recomend")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="mb-4 flex items-end gap-4">
          <div className="dark:text-white">
            부스러기들 <small>최신 5개</small>
          </div>
          <Link
            to="post/etc/list"
            className="cursor-pointer dark:text-neutral-300 text-xs dark:hover:text-ne"
          >
            더보기
          </Link>
        </div>
        <ul className="flex flex-col bg-neutral-50 p-4 rounded-xl dark:bg-gray-700 grow justify-start">
          {post &&
            post
              .filter((post) => post.type === "etc")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="mb-4 flex items-end gap-4">
          <div className="dark:text-white">
            공지사항 <small>최신 5개</small>
          </div>
          <Link
            to="post/notice/list"
            className="cursor-pointer dark:text-neutral-300 text-xs dark:hover:text-ne"
          >
            더보기
          </Link>
        </div>
        <ul className="flex flex-col bg-neutral-50 p-4 rounded-xl dark:bg-gray-700 grow justify-start">
          {post &&
            post
              .filter((post) => post.type === "notice")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>

      {/* 팝업 */}
      {cookie[COOKIE_KEY] ? null : <WelcomePop closeModal={closeModal} />}
    </section>
  );
}
