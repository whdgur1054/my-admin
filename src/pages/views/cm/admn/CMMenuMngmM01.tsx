import { Button, Table, TableProps } from "antd"
import { MenuItem, useMenu } from "../../../../hooks/useMenu"
import { useEffect, useState } from "react"
import AntdTable from "../../../../components/AntdTable"

const CMMenuMngmM01 = () => {
  const menu = useMenu()

  const [menuList, setMenuList] = useState<MenuItem[]>([])
  console.log(menuList)
  useEffect(() => {
    setMenuList(menu.rawMenuItems)
  }, [menu?.rawMenuItems])

  const columns: TableProps<MenuItem>["columns"] = [
    {
      dataIndex: "crprCd",
      key: "crprCd",
      title: "회사코드",
    },
    {
      dataIndex: "menuId",
      key: "menuId",
      title: "메뉴ID",
    },
    {
      dataIndex: "menuNm",
      key: "menuNm",
      title: "메뉴명",
    },
    {
      dataIndex: "menuGbCd",
      key: "menuGbCd",
      title: "메뉴구분",
    },
    {
      dataIndex: "menuNo",
      key: "menuNo",
      title: "메뉴번호",
    },
    {
      dataIndex: "systId",
      key: "systId",
      title: "시스템ID",
    },
    {
      dataIndex: "prgrId",
      key: "prgrId",
      title: "화면ID",
    },
    {
      dataIndex: "prgrUrl",
      key: "prgrUrl",
      title: "화면URL",
    },
    {
      dataIndex: "menuLvl",
      key: "menuLvl",
      title: "메뉴레벨",
    },
    {
      dataIndex: "rootMenu",
      key: "rootMenu",
      title: "최상위메뉴",
    },
  ]

  const handleAdd = () => {
    const newData = {}
    setMenuList([...menuList, newData])
  }
  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        행추가
      </Button>
      {/* <Table
        columns={columns}
        dataSource={menuList}
        rowSelection={{ type: "checkbox" }}
      ></Table> */}
      <AntdTable></AntdTable>
    </>
  )
}

export default CMMenuMngmM01
