// hooks/useMenu.ts
import { useEffect, useState } from "react"
import menuUtil from "../utils/menuUtil"
import { AntdMenu } from "../store/types"

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
  const [rawMenuItems, setRawMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const fetchMenu = async () => {
      // const res = await axios.get("/api/menu"); // 여기를 본인 API 주소로
      fetch("/mock/menu.json")
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          console.log("menu data", data.data)
          setRawMenuItems(Object.values(data.data))
          const menuList: AntdMenu[] = menuUtil().getAntdMenuList(
            data.data,
            "-",
          )
          setMenuItems(menuList)
        })
    }
    fetchMenu()
  }, [])
  return { menuItems, rawMenuItems }
}
