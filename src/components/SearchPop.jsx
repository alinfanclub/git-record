import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { PostListStore, useModalStore, useSearchStore } from "../store/store";
import PostCard from "./PostCard";

export default function SearchPop() {
  const searchText = useSearchStore((state) => state.searchText);
  const addSearch = useSearchStore((state) => state.addSearch);

  const openSearchToggle = useModalStore((state) => state.openSearchToggle);
  const postList = PostListStore((state) => state.postList);

  const searchData = (e) => {
    const { value, name } = e.target;
    addSearch(value, name);
  };

  return (
    <>
      <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white w-[90%] sm:w-1/2 h-4/5 dark:bg-gray-500 z-[60] rounded-3xl py-4 shadow-xl">
        <div className="h-full sm:pr-4 flex flex-col">
          <div className="sticky -top-[1px] z-20 flex flex-col items-center gap-2 mb-4 bg-white dark:bg-gray-500 px-4 pt-4">
            <div className="w-full bg-white h-12 rounded-3xl px-2 flex items-center border border-gray-500">
              <AiOutlineSearch className="text-3xl pl-2" />
              <input
                type="text"
                onKeyUp={searchData}
                name="searchText"
                className="h-full grow focus:border-transparent focus:outline-none px-2 rounded-3xl"
                placeholder="제목 및 작가명 검색"
                autoFocus
              />
            </div>

            {/* <h2 className=" dark:text-white">"{searchText}"에 대한 결과</h2> */}
          </div>
          {searchText === "" ? (
            <div className="flex flex-col items-center justify-center grow gap-4 overflow-y-auto">
              <h2 className="text-2xl font-bold dark:text-white">
                검색 결과가 없습니다.
              </h2>
              <p className="dark:text-gray-200  text-gray-500">
                다른 검색어를 입력해주세요.
              </p>
            </div>
          ) : postList.filter(
              (obj) =>
                obj.title.includes(searchText) ||
                obj.author.includes(searchText)
            ).length === 0 ? (
            <div className="flex flex-col items-center justify-center grow gap-4">
              <h2 className="text-2xl font-bold dark:text-white">
                검색 결과가 없습니다.
              </h2>
              <p className="dark:text-gray-200 text-gray-500">
                다른 검색어를 입력해주세요.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col p-4 rounded-xl grow justify-start overflow-y-auto">
              {postList
                .filter(
                  (obj) =>
                    obj.title.includes(searchText) ||
                    obj.author.includes(searchText)
                )
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className="w-full h-full backdrop-blur-xl fixed top-0 left-0 z-50"
        onClick={openSearchToggle}
      ></div>
    </>
  );
}
