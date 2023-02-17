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
    <section className="p-4 sm:px-8 flex gap-10 flex-col mx-auto">
      {isLoading && <Spinner />}
      {error && <p>error!</p>}
      <div className="">
        <div className="mb-4 flex items-end gap-4">
          <div className="">
            창작 시 <small>최신 5개</small>
          </div>
          <Link
            to="post/creation/list"
            className="cursor-pointer text-neutral-200 text-xs hover:text-neutral-500"
          >
            더보기
          </Link>
        </div>
        <ul className="flex gap-4 flex-col justify-center bg-neutral-50 p-4 rounded-xl">
          {post &&
            post
              .filter((post) => post.type === "creation")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="">
        <div className="mb-4 flex items-end gap-4">
          <div className="">
            추천 시 <small>최신 5개</small>
          </div>
          <Link
            to="post/recomend/list"
            className="cursor-pointer text-neutral-200 text-xs hover:text-neutral-500"
          >
            더보기
          </Link>
        </div>
        <ul className="flex gap-4 flex-col justify-center bg-neutral-50 p-4 rounded-xl">
          {post &&
            post
              .filter((post) => post.type === "recomend")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="">
        <div className="mb-4 flex items-end gap-4">
          <div className="">
            부스러기들 <small>최신 5개</small>
          </div>
          <Link
            to="post/etc/list"
            className="cursor-pointer text-neutral-200 text-xs hover:text-neutral-500"
          >
            더보기
          </Link>
        </div>
        <ul className="flex gap-4 flex-col justify-center bg-neutral-50 p-4 rounded-xl">
          {post &&
            post
              .filter((post) => post.type === "etc")
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
