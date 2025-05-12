import { useEffect, useRef, useState } from "react"
import AntdTable, { antdColType, Item } from "../../../../components/AntdTable"
import { Button } from "antd"
import { useMenu } from "../../../../hooks/useMenu"

const CMMenuMngmM01 = () => {
  const tableRef = useRef<any>(null)

  const menuList = useMenu().rawMenuItems

  // const [tableData] = useState<Item[]>([
  //   { key: "10", name: "이몽룡", age: "27", address: "남원시 광한루" },
  //   { key: "11", name: "이몽룡2", age: "272", address: "남원시 광한루" },
  // ])
  const [tableData, setTableData] = useState<Item[]>([])
  useEffect(() => {
    setTableData(menuList)
  }, [menuList])

  const columns: antdColType[] = [
    { title: "순번", dataIndex: "rowStatus", editable: false },
    {
      title: "회사코드",
      dataIndex: "crprCd",
      editable: true,
      required: true,
    },
    {
      title: "메뉴ID",
      dataIndex: "menuId",
      editable: true,
      required: true,
    },
    {
      title: "메뉴명",
      dataIndex: "menuNm",
      editable: true,
    },
    {
      title: "메뉴구분코드",
      dataIndex: "menuGbCd",
      editable: true,
    },
    {
      title: "메뉴번호",
      dataIndex: "menuNo",
      editable: true,
    },
    {
      title: "시스템ID",
      dataIndex: "systId",
      editable: true,
    },
    {
      title: "프로그램ID",
      dataIndex: "prgrId",
      editable: true,
    },
    {
      title: "메뉴레벨",
      dataIndex: "menuLvl",
      editable: true,
    },
    {
      title: "상위메뉴",
      dataIndex: "rootMenu",
      editable: true,
    },
  ]
  const handleClick = () => {
    const row = tableRef.current.getCurrentRow()
    console.log("현재 선택된 행:", row)
    const name = tableRef.current.getValue(row.key, "name")
    console.log("현재 선택된 이름:", name)
  }

  const handleAdd = () => {
    tableRef.current.addRow({})
  }
  const handleDels = () => {
    tableRef.current.deleteRows()
  }
  const handleSave = () => {
    const saveToServer = async (data: any) => {
      const res = await fetch("/api/save-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: "menu", data: data }),
      })

      const result = await res.json()
      console.log(result)

      setTableData(menuList)
    }
    const data = tableRef.current.getDataSource()
    console.log("저장할 데이터:", data)
    saveToServer(data)
  }

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        행추가
      </Button>
      <Button onClick={handleDels} type="primary" style={{ marginBottom: 16 }}>
        선택 행삭제
      </Button>
      <Button onClick={handleSave} type="primary" style={{ marginBottom: 16 }}>
        저장
      </Button>
      <button onClick={handleClick}>현재 행 이름 확인</button>
      <AntdTable
        columns={columns}
        data={tableData}
        ref={tableRef}
        options={{ check: true }}
      />
    </>
  )
}

export default CMMenuMngmM01
