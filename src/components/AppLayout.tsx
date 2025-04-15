import React, { useEffect, useMemo, useState } from "react"
import { Flex, Layout, Menu, Select } from "antd"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"
import { Breadcrumb } from "antd"
import * as Icons from "@ant-design/icons" // 아이콘 문자열을 컴포넌트로 매핑
import { AntdMenu } from "../store/types"
import { MenuItem } from "../hooks/useMenu"
const { Header, Sider, Content } = Layout

const AppLayout: React.FC<{
  menuItems: AntdMenu[]
  rawMenuItems: MenuItem[]
}> = ({ menuItems, rawMenuItems }) => {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true })
    }
  }, [location.pathname, navigate])

  const findmenuPath = (
    items: AntdMenu[],
    path: string,
    parents: AntdMenu[],
  ): AntdMenu[] | null => {
    for (const item of items) {
      const currentPath = [...parents, item]
      if (
        path === "/main/" + item?.bwgmenu?.prgrId ||
        path.startsWith("/main/" + item?.bwgmenu?.prgrId)
      ) {
        return currentPath
      }

      if (item.children) {
        const found: AntdMenu[] | null = findmenuPath(
          item.children,
          path,
          currentPath,
        )
        if (found) return found
      }
    }
    return null
  }
  const [selectedKey, setSelectedKey] = useState("")
  const [selectPageList] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    const currentKey =
      menuItems.find((item) =>
        location.pathname.startsWith("/main/" + item?.bwgmenu?.prgrId),
      )?.bwgmenu?.menuId || ""
    setSelectedKey(currentKey)
  }, [location.pathname, menuItems])

  const breadcrumbItems = useMemo(() => {
    const menuPath = findmenuPath(menuItems, location.pathname, [])
    return [
      { title: <Link to="/main">Home</Link> },
      ...(menuPath || []).map((item) => ({
        title: item.bwgmenu?.prgrId ? (
          <Link to={`/main/${item.bwgmenu.prgrId}`}>{item.bwgmenu.menuNm}</Link>
        ) : (
          item.bwgmenu?.menuNm
        ),
      })),
    ]
  }, [location.pathname, menuItems])

  const buildMenuItems = (nodes: AntdMenu[]): ItemType[] => {
    return nodes.map((item) => {
      const IconComponent = Icons[item.bwgmenu?.icon || ""]
      return {
        key: item.bwgmenu?.menuId,
        icon: IconComponent ? <IconComponent /> : undefined,
        label: item?.bwgmenu?.prgrId ? (
          <Link to={item.bwgmenu.prgrId}>{item.bwgmenu.menuNm}</Link>
        ) : (
          item.bwgmenu?.menuNm
        ),
        children: item.children ? buildMenuItems(item.children) : undefined,
      }
    })
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header style={{ background: "rgb(202 206 209)", padding: 0 }}>
        <Flex justify="flex-start" align="center" style={{ height: "100%" }}>
          <div
            style={{
              color: "white",
              paddingLeft: "20px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Admin Dashboard
          </div>
          <Select
            prefix="화면선택"
            variant="filled"
            style={{ width: 304, paddingLeft: "20px" }}
            options={rawMenuItems
              .filter((item) => item.menuGbCd == "CM502P")
              .map((item) => {
                return {
                  value: item?.menuId,
                  label: item?.menuNm,
                }
              })}
          ></Select>
        </Flex>
      </Header>

      <Layout style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={buildMenuItems(menuItems)}
          ></Menu>
        </Sider>

        <Layout
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "0 24px 24px",
            overflow: "auto",
          }}
        >
          <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />
          <Content
            style={{
              flex: 1,
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout
