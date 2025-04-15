// src/routes/MainRoutes.tsx
import React, { lazy, Suspense } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { useMenu } from "../hooks/useMenu"
import { AntdMenu } from "../store/types"

const Loading = () => <div>Loading page...</div>

// 🔥 glob으로 전부 불러오기
const pageModules = import.meta.glob("../pages/**/*.tsx")

// 💡 파일명을 key로 쓰는 map 구성
const routeComponentMap: Record<string, React.LazyExoticComponent<any>> = {}
Object.entries(pageModules).forEach(([prgrUrl, loader]) => {
  // const fileName = path.split("/").pop()?.replace(".tsx", "");
  const fileName = prgrUrl.split("/").pop()?.replace(".tsx", "")
  if (fileName && loader) {
    routeComponentMap[fileName] = lazy(loader as any)
  }
})

function MainRoutes() {
  const menu = useMenu()
  const menuItems = menu?.menuItems || []
  if (!menuItems.length) return <div>Loading...</div>

  const renderRoutes = (menuItems: AntdMenu[]) => {
    return menuItems.map((item) => {
      const LazyComponent = routeComponentMap[item?.bwgmenu?.prgrId]

      // children이 있는 경우 재귀적으로 처리
      if (item.children && item.children.length > 0) {
        return renderRoutes(item.children)
      }

      // prgrId가 없거나 라우트 모듈이 없으면 무시
      if (!item?.bwgmenu?.prgrId || !LazyComponent) {
        console.warn(`🚨 No component found for key: ${item?.bwgmenu?.prgrId}`)
        return null
      }

      return (
        <Route
          key={item?.bwgmenu?.prgrId}
          path={item?.bwgmenu?.prgrId}
          element={
            <Suspense fallback={<Loading />}>
              <LazyComponent />
            </Suspense>
          }
        />
      )
    })
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout menuItems={menuItems} rawMenuItems={menu.rawMenuItems} />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        {renderRoutes(menuItems)}
      </Route>
    </Routes>
  )
}

export default MainRoutes
