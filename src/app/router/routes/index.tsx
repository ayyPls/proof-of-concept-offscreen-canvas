import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout";
import { EAppRouterPath } from "../paths";
import ViewerPageLayout from "../../../pages/viewer/layout";
import UIPage from "../../../pages/ui";

const AppRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: EAppRouterPath.VIEWER,
        element: <ViewerPageLayout />,
      },
      {
        path: EAppRouterPath.UI,
        element: <UIPage />,
      },
      {
        path: EAppRouterPath.ANY_PATH,
        element: <Navigate to={EAppRouterPath.LOGIN} />,
      },
    ],
  },
]);

export default AppRouter;
