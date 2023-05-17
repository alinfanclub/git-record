import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { getPostData } from "../api/firebase";
import { PostListStore } from "../store/store";

export const PostListContext = createContext();

export function PostListProvider({ children }) {
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({ queryKey: ["post"], queryFn: getPostData });

  const addPostList = PostListStore((state) => state.addPostList);

  useEffect(() => {
    addPostList(post);
    console.log(post);
  }, [post, addPostList]);

  return (
    <PostListContext.Provider value={{ isLoading, error }}>
      {children}
    </PostListContext.Provider>
  );
}

export const usePostList = () => useContext(PostListContext);
