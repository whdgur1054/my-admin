// src/routes/MainRoutes.tsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserStats from "../pages/UserStats";
import AppLayout from "../components/AppLayout";
import { useMenu } from "../hooks/useMenu";
import Sample from "../pages/sample";

const componentMap: Record<string, JSX.Element> = {
  dashboard: <Dashboard />,
  userStats: <UserStats />,
  sample: <Sample />, // ✅ 추가
};

function MainRoutes() {
  const menuItems = useMenu();

  const [realMenu, setRealMenu] = React.useState(menuItems);
  React.useEffect(() => {
    setRealMenu(menuItems);
  }, [menuItems]);
  if (!menuItems.length) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<AppLayout menuItems={realMenu} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {realMenu.map((item) => (
          <Route
            key={item.key}
            path={item.path.replace("/main/", "")} // 꼭 상대 경로로
            element={componentMap[item.key]}
          />
        ))}
      </Route>
    </Routes>
  );
}

export default MainRoutes;
