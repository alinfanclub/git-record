import { useQuery } from "@tanstack/react-query";
import { getPostData } from "../api/firebase";
import PostCard from "./PostCard";
import { useCookies } from "react-cookie";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";

export default function PostList() {
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({ queryKey: ["post"], queryFn: getPostData });

  const COOKIE_KEY = "yaerHideModal";
  const [cookie, setCookie] = useCookies([COOKIE_KEY]);
  console.log(post);

  const closeModal = () => {
    const decade = moment();
    decade.add("3650", "d");
    setCookie(COOKIE_KEY, "true", {
      path: "/",
      expires: decade.toDate(),
    });
  };
  return (
    <main className="p-4 flex gap-10 flex-col">
      {isLoading && <p>loading</p>}
      {error && <p>error!</p>}
      <div className="">
        <div className="mb-4">창작 시</div>
        <ul className="flex gap-4 flex-col justify-center border border p-2">
          {post &&
            post
              .filter((post) => post.type === "창작 시")
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="">
        <div className="mb-4">추천 시</div>
        <ul className="flex gap-4 flex-col justify-center border border p-2">
          {post &&
            post
              .filter((post) => post.type === "추천 시")
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      <div className="">
        <div className="mb-4">부스러기들</div>
        <ul className="flex gap-4 flex-col justify-center border border p-2">
          {post &&
            post
              .filter((post) => post.type === "부스러기")
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      </div>
      {cookie[COOKIE_KEY] ? null : (
        <div className="w-full h-full fixed top-0 left-0 bg-black/50 flex items-center justify-center">
          <div className="w-5/6 sm:w-2/5 h-auto bg-white aspect-video relative p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-base sd:text-2xl">공지 사항</h4>
              <AiFillCloseCircle
                onClick={closeModal}
                className="cursor-pointer text-3xl"
              />
            </div>
            <div className="popup_text text-center flex flex-col h-full justify-center text-sm sd:text-xl">
              <p>안녕하세요, 부스러기입니다.</p>
              <p>
                부스러기는 주로 시, 시각 예술을 수집하고 공유하는 사이트입니다.
              </p>
              <small>댓글 및 추가 기능은 개발 중입니다 ^^</small>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
