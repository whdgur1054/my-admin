import React, { useEffect, useMemo } from "react"
import { Layout, Menu } from "antd"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"
import { Breadcrumb } from "antd"
import * as Icons from "@ant-design/icons" // 아이콘 문자열을 컴포넌트로 매핑
import { MenuItem } from "../hooks/useMenu"

const { Header, Sider, Content } = Layout

const AppLayout: React.FC<{ menuItems: AntdMenu[] }> = ({ menuItems }) => {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true })
    }
  }, [location.pathname, navigate])

  const selectedKey = useMemo(() => {
    return (
      menuItems.find((item) =>
        location.pathname.startsWith("main/" + item?.bwgmenu?.prgrId),
      )?.menuId || ""
    )
  }, [location.pathname, menuItems])

  const breadcrumbItems = useMemo(() => {
    const currentMenu = menuItems.find((item) =>
      location.pathname.startsWith("main/" + item?.bwgmenu?.prgrId),
    )

    return [
      { title: <Link to="/main">Home</Link> },
      currentMenu
        ? {
            title: (
              <Link to={"main/" + currentMenu.prgrId}>
                {currentMenu.menuNm}
              </Link>
            ),
          }
        : null,
    ].filter(Boolean) // null 제거
  }, [location.pathname, menuItems])

  const buildMenuItems = (nodes: MenuItem[]): ItemType[] => {
    return nodes.map((item) => {
      const IconComponent = Icons[item.bwgmenu.icon || ""]
      return {
        key: item.bwgmenu.menuId,
        icon: IconComponent ? <IconComponent /> : undefined,
        label: item.bwgmenu.prgrId ? (
          <Link to={item.bwgmenu.prgrId}>{item.bwgmenu.menuNm}</Link>
        ) : (
          item.bwgmenu.menuNm
        ),
        children: item.children ? buildMenuItems(item.children) : undefined,
      }
    })
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <Header style={{ background: "#001529", padding: 0 }}>
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
      </Header>

      <Layout style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={buildMenuItems(menuItems)}
          >
            {/* {menuItems.map((item) => {
              const IconComponent = Icons[item?.bwgmenu?.icon]
              return (
                <Menu.Item
                  key={item?.bwgmenu?.menuId}
                  icon={IconComponent ? <IconComponent /> : null}
                >
                  <Link to={item?.bwgmenu?.prgrId}>
                    {item?.bwgmenu?.menuNm}
                  </Link>
                </Menu.Item>
              )
            })} */}
          </Menu>
        </Sider>

        <Layout style={{ flex: 1, padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />
          <Content
            style={{
              flex: 1,
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
              overflow: "auto",
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
