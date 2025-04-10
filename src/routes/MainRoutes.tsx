// src/routes/MainRoutes.tsx
import React, { lazy, Suspense } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { useMenu } from "../hooks/useMenu"

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
  const menuItems = useMenu()
  if (!menuItems.length) return <div>Loading...</div>

  console.log(pageModules)
  return (
    <Routes>
      <Route path="/" element={<AppLayout menuItems={menuItems} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {menuItems.map((item) => {
          const LazyComponent = routeComponentMap[item.prgrId]
          if (!LazyComponent) {
            console.warn(`🚨 No component found for key: ${item.prgrId}`)
            return null
          }
          return (
            <Route
              key={item.prgrId}
              path={item.prgrId}
              element={
                <Suspense fallback={<Loading />}>
                  <LazyComponent />
                </Suspense>
              }
            />
          )
        })}
      </Route>
    </Routes>
  )
}

export default MainRoutes
