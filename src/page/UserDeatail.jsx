import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPostDataForUsername,
  getUserURLInfo,
  userImageFix,
  userImageFixPost,
  userNameFix,
  userNameFixPost,
} from "../api/firebase";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import Pagination from "react-js-pagination";
import { PersonalUserDataStore } from "../store/store";
import { MdAutoFixHigh } from "react-icons/md";
import { uploadImage } from "../api/UploadImage";

export default function UserDeatail() {
  const param = useParams().userId;
  const [page, setPage] = useState(1);
  const [items] = useState(10);
  const [postLength, setPostLength] = useState();
  const personal = PersonalUserDataStore((state) => state.personal);
  const addPersonalUserUrl = PersonalUserDataStore((state) => state.addPersonalUserUrl)
  const addPersonalUserDisplayName = PersonalUserDataStore((state) => state.addPersonalUserDisplayName)
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    data: post,
  } = useQuery({
    queryKey: ["myPost", param],
    queryFn: () => getPostDataForUsername(param),
  });

  const { data: user } = useQuery({
    queryKey: ["userInfo", param],
    queryFn: () => getUserURLInfo(param),
  });

  const [reUserName, setReUserName] = useState(personal.userDisplayName);
  const [fixing, setFixing] = useState(false);

  const updateUserName = useMutation(
    ({ personal, reUserName }) => userNameFix(personal, reUserName),
    { onSuccess: () => queryClient.invalidateQueries(["userInfo"]) }
  );
  const updateUserNamePost = useMutation(
    ({ personal, reUserName }) => userNameFixPost(personal, reUserName),
    { onSuccess: () => queryClient.invalidateQueries(["userInfo"]) }
  );
  const updateUserImage = useMutation(
    ({ personal, url }) => userImageFix(personal, url),
    { onSuccess: () => queryClient.invalidateQueries(["userInfo"]) }
  );
  const chageUserImagePost = useMutation(
    ({ personal, url }) => userImageFixPost(personal, url),
    { onSuccess: () => queryClient.invalidateQueries(["myPost"]) }
  );

  useEffect(() => {
    getPostDataForUsername(param).then((res) => {
      setPostLength(res.length);
    });
  }, [param]);
  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setReUserName(value);
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (window.confirm("수정 하시겠나요?")) {
      updateUserName.mutate(
        { personal, reUserName },
        {
          onSuccess: () => {
            setFixing(false);
            addPersonalUserDisplayName(reUserName)
          },
        }
      );
      updateUserNamePost.mutate(
        { personal, reUserName },
        {
          onSuccess: () => {
            setFixing(false);
            addPersonalUserDisplayName(reUserName)
          },
        }
      );
      
    }
  };

  const handleReImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (window.confirm("수정 하시겠나요?")) {
      uploadImage(file).then((data) => {
        const { url } = data;
        console.log(url);
        updateUserImage.mutate({
          personal,
          url,
        },{
          onSuccess:() =>{
            addPersonalUserUrl(url)
          }
        });
        chageUserImagePost.mutate({
          personal,
          url,
        },{
          onSuccess:() =>{
            addPersonalUserUrl(url)
          }
        });

        console.log("end");
      });
    }
  };
  return (
    <>
      {isLoading && <Spinner />}
      {error && <p>error!</p>}
      {post && user && (
        <section className="p-4 sm:px-8 flex gap-10 flex-col mx-auto">
          <div className="flex justify-center flex-col items-center gap-[1rem]">
            <form
              onSubmit={handleReImage}
              className="flex gap-4 items-end relative"
            >
              <img
                src={user.userPhotoURL}
                alt={user.userDisplayName}
                className="w-20 h-20 rounded-full max-[300px]:hidden object-cover bg-white"
              />
              <div className="absolute bottom-0 -right-4">
                <input
                  type="file"
                  name="imagefile"
                  id="imagefile"
                  className="hidden"
                  onChange={handleReImage}
                />
                <label htmlFor="imagefile">
                  <MdAutoFixHigh className="dark:text-white" />
                </label>
              </div>
            </form>
            <form onSubmit={handleRename} className="flex items-center gap-4">
              {fixing ? (
                <input
                  type="text"
                  value={reUserName}
                  onChange={handleChange}
                  name="userDisplayName"
                  className="py-2 px-4 rounded-3xl text-center box-border outline-none"
                />
              ) : (
                <p className="text-xl font-bold dark:text-white">
                  {user.userDisplayName}
                </p>
              )}
              {personal.userUid === user.userUid && (
                <>
                  {fixing ? (
                    <span
                      className="dark:text-white cursor-pointer"
                      onClick={handleRename}
                    >
                      수정하기
                    </span>
                  ) : (
                    <MdAutoFixHigh
                      onClick={() => setFixing(true)}
                      className="dark:text-white"
                    />
                  )}
                </>
              )}
            </form>
            <span className="dark:text-white">게시글 갯수 : {postLength}</span>
          </div>
          {post.map((obj) => obj.userInfo.userUid).includes(param) ? (
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
      )}
    </>
  );
}
