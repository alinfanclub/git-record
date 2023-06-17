import { initializeApp } from "firebase/app";
import { v4 as uuid } from "uuid";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  serverTimestamp,
  remove,
  update,
  query,
} from "firebase/database";
// import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_BASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export function login() {
  signInWithPopup(auth, provider).catch((error) => {
    console.error(error);
  });
}
export function logout() {
  signOut(auth).catch((error) => {
    console.error(error);
  });
}

// ~ 'user/'에 정보 추가하기
export async function addUser({ displayName, uid, email, photoURL }) {
  const userRef = ref(database, `user/${uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return false;
  } else {
    return set(ref(database, `user/${uid}`), {
      userDisplayName: displayName,
      userUid: uid,
      userEmail: email,
      userPhotoURL: photoURL,
    });
  }
}

// ~ 유저 이름 수정
export async function userNameFix(user, name) {
  return update(ref(database, `user/${user.userUid}`), {
    ...user,
    userDisplayName: name,
  });
}

export async function userImageFix(user, url) {
  return update(ref(database, `user/${user.userUid}`), {
    ...user,
    userPhotoURL: url,
  });
}

// post 데이터에서 userInfo의 userUid와 같은 데이터를 찾아서  userPhotoURL을 user의 userPhotoURL로 변경
export async function userImageFixPost(user, url) {
  return get(ref(database, "post")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const post = Object.values(snapshot.val());
        post.forEach((post) => {
          if(user.userUid === post.userInfo.userUid){
            update(ref(database, `post/${post.id}/userInfo`), {
              userProfile: url,
            })
          }

          if(post.comments) {
            Object.values(post.comments).forEach((comment)=> {
              if(comment.userInfo.userUid === user.userUid) {
                update(ref(database, `post/${post.id}/comments/${comment.commentId}/userInfo`), {
                  userProfile: url,
                })
              }
              if(comment.subcomments) {
                Object.values(comment.subcomments).forEach((subcomment)=> {
                  if(subcomment.userInfo.userUid === user.userUid) {
                    update(ref(database, `post/${post.id}/comments/${comment.commentId}/subcomments/${subcomment.SubCommentId}/userInfo`), {
                      userProfile: url,
                    })
                  }
                })
              }
            })
          }
        });
      }
    });
}

export async function userNameFixPost(user, text) {
  return get(ref(database, "post")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const post = Object.values(snapshot.val());
        post.forEach((post) => {
          if(user.userUid === post.userInfo.userUid){
            update(ref(database, `post/${post.id}/userInfo`), {
              userName: text,
            })
          }

          if(post.comments) {
            Object.values(post.comments).forEach((comment)=> {
              if(comment.userInfo.userUid === user.userUid) {
                update(ref(database, `post/${post.id}/comments/${comment.commentId}/userInfo`), {
                  userName: text,
                })
              }
              if(comment.subcomments) {
                Object.values(comment.subcomments).forEach((subcomment)=> {
                  if(subcomment.userInfo.userUid === user.userUid) {
                    update(ref(database, `post/${post.id}/comments/${comment.commentId}/subcomments/${subcomment.SubCommentId}/userInfo`), {
                      userName: text,
                    })
                  }
                })
              }
            })
          }
        });
      }
    });
}


// ~ 사용 유저 정보 가져오기
export async function getUserUseinInfo(user) {
  const data = query(ref(database, `user/${user.uid}`));
  return get(data) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object(snapshot.val());
      }
      return [];
    });
}
export async function getUserUseinInfoS(id) {
  const data = query(ref(database, `user/${id}`));
  return get(data) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object(snapshot.val());
      }
      return [];
    });
}

export async function getAllUser(user) {
  const data = query(ref(database, `user`));
  return get(data) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object(snapshot.val());
      }
      return [];
    });
}

// ~ 유저 디테일 페이지 정보 가져오기
export async function getUserURLInfo(param) {
  const data = query(ref(database, `user/${param}`));
  return get(data) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object(snapshot.val());
      }
      return [];
    });
}

export function onUserStateChange(callback) {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

async function adminUser(user) {
  return get(ref(database, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
      return user;
    });
}
export async function getPostData() {
  const data = query(ref(database, "post"));
  return get(data) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    });
}

export async function getPostDataForType(params) {
  return get(ref(database, "post")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val()).filter(
          (post) => post.type === params
        );
        // .sort((a, b) => b.createdAt - a.createdAt);
      }
      return [];
    });
}

// ~ 유저 디테일 페이지 포스트 데이터
export async function getPostDataForUsername(params) {
  return get(ref(database, "post")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val())
          .filter((post) => post.userInfo.userUid === params)
          .sort((a, b) => b.createdAt - a.createdAt);
      }
      return [];
    });
}

// TODO 삭제하기
// export async function getUserThumbnail(params) {
//   return get(ref(database, "post")) //
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         return Object.values(snapshot.val()).find(
//           (post) => post.userInfo.userUid === params
//         );
//       }
//       return [];
//     });
// }
export async function getPostDataDetail(id) {
  return get(ref(database, `post/${id}`)) //
    .then((snapshot) => {
      return Object(snapshot.val());
    });
}
export async function addPost(text, personal, postInfo, id) {
  return set(ref(database, `post/${id}`), {
    ...postInfo,
    text,
    id,
    createdAt: serverTimestamp(),
    userInfo: {
      userUid: personal.userUid,
      userName: personal.userDisplayName,
      userProfile: personal.userPhotoURL,
    },
  });
}

// ~ read and false
export async function UserChekTrue(id) {
  return update(ref(database, `post/${id}`), {
    readCheck: true,
  });
}
export async function UserChekFalse(id) {
  return update(ref(database, `post/${id}`), {
    readCheck: false,
  });
}

// ! Hearts

// ~ 좋아요 누른 아이디 저장
export async function addUserLike(id, user) {
  return set(ref(database, `post/${id}/userLike/${user.uid}`), {
    user: user.uid,
    userName: user.displayName,
  });
}
// ~ 좋아요 누른 아이디 불러오기
export async function userLikeList(id) {
  return get(ref(database, `post/${id}/userLike`)).then((snapshot) => {
    const Like = snapshot.val() || {};
    return Object.values(Like);
  });
}

// ~ 좋아요 누른 아이디 삭제
export async function deleteHeart(id, user) {
  return remove(ref(database, `post/${id}/userLike/${user.uid}`));
}

// ~ 좋아요 절대적인 카운터 +1
export async function addLkie(id, post, user) {
  const postRef = ref(database, `post/${id}`);
  const snapshot = await get(postRef);
  const currentLikes = snapshot.val().likes || 0;
  const is = snapshot.val().userLike;
  const userLikeList = Object.values(is || []);
  if (!userLikeList.map((obj) => obj.user).includes(user.uid)) {
    return set(ref(database, `post/${id}`), {
      ...post,
      likes: currentLikes + 1,
    });
  }
  return alert("좋아요 추가 중복");
}

// ~ 좋아요 절대적인 카운터 -1
export async function loseLkie(id, post, user) {
  const postRef = ref(database, `post/${id}`);
  const snapshot = await get(postRef);
  const currentLikes = snapshot.val().likes;
  const userLikeList = Object.values(snapshot.val().userLike);
  if (userLikeList.map((obj) => obj.user).includes(user.uid)) {
    return set(ref(database, `post/${id}`), {
      ...post,
      likes: currentLikes - 1,
    });
  }
  return alert("좋아요 취소 중복");
}

// ~ 게시글 업데이트
export async function updatePost(text, personal, postInfo, id) {
  return update(ref(database, `post/${id}`), {
    ...postInfo,
    text,
    id,
    fixed: true,
    userInfo: {
      userUid: personal.userUid,
      userName: personal.userDisplayName,
      userProfile: personal.userPhotoURL,
    },
  });
}

// ! 조회수 기능 추가
export async function upView(id, post) {
  const postRef = ref(database, `post/${id}`);
  const snapshot = await get(postRef);
  const currentViews = snapshot.val().views || 0;
  return update(ref(database, `post/${id}`), {
    ...post,
    views: currentViews + 1,
  });
}
export async function getView(id) {
  return get(ref(database, `post/${id}/views`)).then((snapshot) => {
    return String(snapshot._node.value_);
  });
}

export async function readCheckPost(text, user, postInfo, id) {
  return set(ref(database, `post/${id}`), {
    ...postInfo,
    text,
    id,
    createdAt: serverTimestamp(),
    UserRead: false,
    userInfo: {
      userUid: user.uid,
      userName: user.displayName,
      userProfile: user.photoURL,
    },
  });
}
export async function removePost(fuck) {
  remove(ref(database, `post/${fuck}`));
}

// ! 댓글 기능 개발

// ~ 댓글 작성
export async function addComment(comment, personal, postId) {
  const randomId = uuid();
  return update(ref(database, `post/${postId}/comments/${randomId}`), {
    comment,
    postId,
    commentId: randomId,
    createdAt: serverTimestamp(),
    userInfo: {
      userUid: personal.userUid,
      userName: personal.userDisplayName,
      userProfile: personal.userPhotoURL,
    },
  });
}

// ~ 특정 게시글 댓글 불러오기
export async function getComments(Postid) {
  return get(ref(database, `post/${Postid}/comments`)) //
    .then((snapshot) => {
      const comment = snapshot.val() || {};
      return Object.values(comment);
    });
}

// ~ 댓글 수정하기
export async function updateComment(text, postId, commnetId) {
  return update(ref(database, `post/${postId}/comments/${commnetId}`), {
    comment: text,
    fixed: true,
  });
}

// ~ 댓글 삭제하기
export async function deleteComments(postId, commentId) {
  remove(ref(database, `post/${postId}/comments/${commentId}`));
}

// ! 대 댓글
// ! 대 댓글

// 대 댓글 작성
export async function addSubComment(comment, personal, postId, commentId) {
  const randomSubId = uuid();
  return update(
    ref(
      database,
      `post/${postId}/comments/${commentId}/subcomments/${randomSubId}`
    ),
    {
      comment,
      SubCommentId: randomSubId,
      createdAt: serverTimestamp(),
      userInfo: {
        userUid: personal.userUid,
        userName: personal.userDisplayName,
        userProfile: personal.userPhotoURL,
      },
    }
  );
}

export async function getSubComments(Postid, commentId) {
  return get(ref(database, `post/${Postid}/comments/${commentId}/subcomments`)) //
    .then((snapshot) => {
      const comment = snapshot.val() || {};
      return Object.values(comment);
    });
}
export async function updateSubComments(Postid, commentId, subId, text) {
  return update(
    ref(database, `post/${Postid}/comments/${commentId}/subcomments/${subId}`),
    {
      comment: text,
      fixed: true,
    }
  );
}

export async function romoveSubCommentDetail(Postid, commentId, SubCommentId) {
  return remove(
    ref(
      database,
      `post/${Postid}/comments/${commentId}/subcomments/${SubCommentId}`
    )
  );
}
