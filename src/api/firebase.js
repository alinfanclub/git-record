import { initializeApp } from "firebase/app";
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
  // 2. 사용자가 어드민 권한을 가지고 있는지 확인
  // 3. {...usr, isAdmin: true/false}
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
export async function updatePost(text, user, postInfo, id) {
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
export async function removePost(fuck) {
  remove(ref(database, `post/${fuck}`));
}
//  ! 포스트의 아이디를 넣어줘서 찾고 업데이트 하도록 id를 포스트 id를 받아오도록 네이밍 수정 및 연결
// export async function updateProduct(product, image) {
//   return update(ref(database, `products/${id}`), {
//     ...product,
//     price: parseInt(product.price),
//     image,
//     options: product.options.split(","),
//   });
// }
