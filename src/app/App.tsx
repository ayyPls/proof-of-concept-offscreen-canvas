import { RouterProvider } from "react-router-dom";
import "./global.css";
import AppRouter from "./router/routes";

function App() {
  return <RouterProvider router={AppRouter} />;
}

export default App;
