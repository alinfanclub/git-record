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
  return get(ref(database, "post")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    });
}
export async function getPostDataDetail(id) {
  return get(ref(database, `post/${id}`)) //
    .then((snapshot) => {
      return Object(snapshot.val());
    });
}
export async function addPost(text, user, postInfo, id) {
  return set(ref(database, `post/${id}`), {
    ...postInfo,
    text,
    id,
    createdAt: serverTimestamp(),
    userInfo: {
      userUid: user.uid,
      userName: user.displayName,
      userProfile: user.photoURL,
    },
  });
}
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

// comments
export async function addUserLike(id, user) {
  return set(ref(database, `post/${id}/userLike/${user.uid}`), {
    user: user.uid,
    userName: user.displayName,
  });
}
export async function userLikeList(id) {
  return get(ref(database, `post/${id}/userLike`)).then((snapshot) => {
    const Like = snapshot.val() || {};
    return Object.values(Like);
  });
}
export async function deleteHeart(id, user) {
  return remove(ref(database, `post/${id}/userLike/${user.uid}`));
}

export async function updatePost(text, user, postInfo, id) {
  return set(ref(database, `post/${id}`), {
    ...postInfo,
    text,
    id,
    fixed: true,
    userInfo: {
      userUid: user.uid,
      userName: user.displayName,
      userProfile: user.photoURL,
    },
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

// ! ?????? ?????? ??????

// ~ ?????? ??????
export async function addComment(comment, user, postId) {
  const randomId = uuid();
  return set(ref(database, `post/${postId}/comments/${randomId}`), {
    comment,
    postId,
    commentId: randomId,
    createdAt: serverTimestamp(),
    userInfo: {
      userUid: user.uid,
      userName: user.displayName,
      userProfile: user.photoURL,
    },
  });
}

// ~ ?????? ????????? ?????? ????????????
export async function getComments(Postid) {
  return get(ref(database, `post/${Postid}/comments`)) //
    .then((snapshot) => {
      const comment = snapshot.val() || {};
      return Object.values(comment);
    });
}
// // ~ ????????? ????????????
// // TODO ?????? ????????? ????????? ?????? ????????? ?????? ?????? ??????
// export async function updateComment(comment, user, postId, commnetId) {
//   return set(ref(database, `post/${postId}/comments/${commnetId}`), {
//     comment,
//     createdAt: serverTimestamp(),
//   });
// }

// ~ ?????? ????????????
export async function deleteComments(postId, commentId) {
  remove(ref(database, `post/${postId}/comments/${commentId}`));
}

// ! ??? ??????

// ??? ?????? ??????
export async function addSubComment(comment, user, postId, commentId) {
  const randomSubId = uuid();
  return set(
    ref(
      database,
      `post/${postId}/comments/${commentId}/subcomments/${randomSubId}`
    ),
    {
      comment,
      SubCommentId: randomSubId,
      createdAt: serverTimestamp(),
      userInfo: {
        userUid: user.uid,
        userName: user.displayName,
        userProfile: user.photoURL,
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
export async function romoveSubCommentDetail(Postid, commentId, SubCommentId) {
  return remove(
    ref(
      database,
      `post/${Postid}/comments/${commentId}/subcomments/${SubCommentId}`
    )
  );
}
