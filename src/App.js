import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/PostList";
import PostListByType from "./components/PostListByType";
import MapPage from "./page/MapPage";
import NotFound from "./page/NotFound";
import PostDetail from "./page/PostDetail";
import Root from "./page/Root";
import UpdatePost from "./page/UpdatePost";
import WritePost from "./page/WritePost";

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
        element: <WritePost />,
      },
      {
        path: "/post/:postId",
        element: <PostDetail />,
      },
      {
        path: "/post/update/:postId",
        element: <UpdatePost />,
      },
      {
        path: "/post/:type/list",
        element: <PostListByType />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
