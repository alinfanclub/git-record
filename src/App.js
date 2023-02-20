import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/PostList";
import PostListByType from "./page/PostListByType";
import MapPage from "./page/MapPage";
import NotFound from "./page/NotFound";
import PostDetail from "./page/PostDetail";
import Root from "./page/Root";
import UpdatePost from "./page/UpdatePost";
import WritePost from "./page/WritePost";
import UserDeatail from "./page/UserDeatail";
import ProtectedRoute from "./page/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // root가 index 첫순서로
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/map",
        element: <MapPage />,
      },
      {
        path: "/post/new",
        element: (
          <ProtectedRoute>
            <WritePost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:postId",
        element: <PostDetail />,
      },
      {
        path: "/post/update/:postId",
        element: (
          <ProtectedRoute>
            <UpdatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:type/list",
        element: <PostListByType />,
      },
      {
        path: "/user/:userId",
        element: (
          <ProtectedRoute>
            <UserDeatail />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
