import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home";
import MapPage from "./page/MapPage";
import NotFound from "./page/NotFound";
import Root from "./page/Root";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
