import { AntdMenu, Menu } from "../store/types"

function menuUtil() {
  // [no export] antd메뉴 포맷 get Item
  const getAntdMenuItem = (menu: Menu) => {
    const menuItem: AntdMenu = {
      key: menu.menuId,
      label: menu.menuNm,
      bwgmenu: menu,
      title: menu.menuNm,
    }

    if (menu.menuGbCd != "CM502P") {
      menuItem.children = []
    }

    return menuItem
  }

  /**
   * @description Antd 메뉴 포맷으로 변환
   * @param arrayList 메뉴목록
   * @param rootId 최상위메뉴ID
   */
  const getAntdMenuList = (arrayList: Menu[], rootId: string): AntdMenu[] => {
    const rootNodes: AntdMenu[] = []
    const traverse: any = function (nodes: any[], item: Menu, index: number) {
      if (nodes instanceof Array) {
        return nodes.some((node) => {
          if (node.bwgmenu.menuId === item.menuPrntId) {
            node.children = [...(node.children || [])]
            return node.children.push(
              getAntdMenuItem(arrayList.splice(index, 1)[0]),
            )
          }
          return traverse(node.children, item, index)
        })
      }
    }

    while (arrayList.length > 0) {
      arrayList.some((item: Menu, index: number) => {
        if (item.menuPrntId === rootId) {
          return rootNodes.push(getAntdMenuItem(arrayList.splice(index, 1)[0]))
        }
        return traverse(rootNodes, item, index)
      })
    }

    return rootNodes
  }

  return { getAntdMenuItem, getAntdMenuList }
}
export default menuUtil
