// hooks/useMenu.ts
import { useEffect, useState } from "react"
import menuUtil from "../utils/menuUtil"
import { AntdMenu, Menu } from "../store/types"

export interface MenuItem {
  // key: string
  // label: string
  // icon?: string
  // path: string
  crprCd: string
  menuId: string
  menuPrntId?: string
  menuNm?: string
  menuGbCd?: string
  menuNo?: string
  systId?: string | undefined
  prgrId?: string
  prgrUrl?: string
  menuLvl?: number
  rootMenu?: string
}

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<AntdMenu[]>([])

  useEffect(() => {
    const fetchMenu = async () => {
      // const res = await axios.get("/api/menu"); // 여기를 본인 API 주소로
      const res: { data: Menu[] } = {
        // data: [
        //   {
        //     key: "Dashboard",
        //     label: "Dashboard",
        //     icon: "HomeOutlined",
        //     path: "/main/Dashboard",
        //     realpath: "/pages/Dashboard",
        //   },
        //   {
        //     key: "UserStats",
        //     label: "Users",
        //     icon: "UserOutlined",
        //     path: "/main/UserStats",
        //     realpath: "/pages/UserStats",
        //   },
        //   {
        //     key: "Sample",
        //     label: "Sample",
        //     icon: "UserOutlined",
        //     path: "/main/Sample",
        //     realpath: "/pages/Sample",
        //   },
        //   {
        //     key: "Test",
        //     label: "Test",
        //     icon: "UserOutlined",
        //     path: "/main/Test",
        //     realpath: "/pages/views/cm/Test",
        //   },
        // ],
        data: [
          {
            crprCd: "100",
            menuId: "CM00",
            menuPrntId: "-",
            menuNm: "즐겨찾기",
            menuGbCd: "CM502M",
            menuNo: undefined,
            systId: "",
            prgrId: undefined,
            prgrUrl: undefined,
            menuLvl: 1,
            rootMenu: undefined,
          },
          {
            crprCd: "100",
            menuId: "CM01",
            menuPrntId: "-",
            menuNm: "관리자설정",
            menuGbCd: "CM502M",
            menuNo: undefined,
            systId: undefined,
            prgrId: undefined,
            prgrUrl: undefined,
            menuLvl: 1,
            rootMenu: undefined,
          },
          {
            crprCd: "100",
            menuId: "CM0101",
            menuPrntId: "CM01",
            menuNm: "BXF 관리자메뉴",
            menuGbCd: "CM502S",
            menuNo: undefined,
            systId: undefined,
            prgrId: undefined,
            prgrUrl: undefined,
            menuLvl: 2,
            rootMenu: undefined,
          },
          {
            crprCd: "100",
            menuId: "CM010102",
            menuPrntId: "CM0101",
            menuNm: "회사정보관리",
            menuGbCd: "CM502P",
            menuNo: "0002",
            systId: undefined,
            prgrId: "CMCrprMstrM01",
            prgrUrl: "pages/views/cm/admn/CMCrprMstrM01",
            menuLvl: 3,
            rootMenu: "관리자설정",
          },
          {
            crprCd: "100",
            menuId: "CM010103",
            menuPrntId: "CM0101",
            menuNm: "사용자관리",
            menuGbCd: "CM502P",
            menuNo: "0003",
            systId: undefined,
            prgrId: "CMUserMstrM01",
            prgrUrl: "pages/views/cm/admn/CMUserMstrM01",
            menuLvl: 3,
            rootMenu: "관리자설정",
          },
          {
            crprCd: "100",
            menuId: "CM010104",
            menuPrntId: "-",
            menuNm: "대시보드",
            menuGbCd: "CM502P",
            menuNo: "0004",
            systId: undefined,
            prgrId: "Dashboard",
            prgrUrl: "/pages/Dashboard",
            menuLvl: 1,
            rootMenu: "관리자설정",
          },
        ],
      }
      const menuList: AntdMenu[] = menuUtil().getAntdMenuList(res.data, "-")
      console.log("menuList", menuList)
      // setMenuItems(res.data)
      setMenuItems(menuList)
    }
    fetchMenu()
  }, [])
  console.log("menuItems-useMenus", menuItems)
  return menuItems
}
