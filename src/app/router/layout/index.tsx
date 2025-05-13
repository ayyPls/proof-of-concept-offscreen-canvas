import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <main className="AppLayout">
      <Outlet />
    </main>
  );
};

export default AppLayout;
