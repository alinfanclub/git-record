import { useQuery } from "@tanstack/react-query";
import { getPostData } from "../api/firebase";
import PostCard from "./PostCard";
import { useCookies } from "react-cookie";
import moment from "moment";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
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
  console.log(post);
  console.log(1);

  const navigate = useNavigate();
  return (
    <section className="p-4 flex gap-10 flex-col mx-auto">
      {isLoading && <Spinner />}
      {error && <p>error!</p>}
      <div className="">
        <div className="mb-4 flex items-center gap-4">
          <div className="">창작 시</div>
          <div
            onClick={() => {
              navigate(`/post/creation/list`, { state: { post } });
            }}
            className="cursor-pointer"
          >
            더보기
          </div>
        </div>
        <ul className="flex gap-4 flex-col justify-center border border p-2">
          {post &&
            post
              .filter((post) => post.type === "creation")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="">
        <div className="mb-4">추천 시</div>
        <ul className="flex gap-4 flex-col justify-center border border p-2">
          {post &&
            post
              .filter((post) => post.type === "recomend")
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="">
        <div className="mb-4">부스러기들</div>
        <ul className="flex gap-4 flex-col justify-center border border p-2">
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
