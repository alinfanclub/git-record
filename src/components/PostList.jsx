import { useQuery } from "@tanstack/react-query";
import { getPostData } from "../api/firebase";
import PostCard from "./PostCard";

export default function PostList() {
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({ queryKey: ["post"], queryFn: getPostData });

  console.log(post);
  return (
    <div className="p-4 flex gap-10 flex-col">
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
    </div>
  );
}
