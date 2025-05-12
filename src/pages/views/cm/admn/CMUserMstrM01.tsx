import { useEffect, useRef, useState } from "react"
import AntdTable, { antdColType } from "../../../../components/AntdTable"
import { Button, Flex } from "antd"
import { $jsonUtil } from "../../../../utils/jsonUtil"

const CMUserMstrM01 = () => {
  const tableRef = useRef<any>(null)
  const [tableData, setTableData] = useState<any[]>([])

  useEffect(() => {
    $jsonUtil.fetchJson("user").then((data) => {
      setTableData(data)
    })
  }, [])

  const columns: antdColType[] = [
    {
      title: "상태",
      dataIndex: "rowStatus",
      width: 100,
      align: "center",
      editable: false,
    },
    {
      title: "회사코드",
      dataIndex: "crprCd",
      editable: true,
      required: true,
    },
    {
      title: "사용자ID",
      dataIndex: "userId",
      editable: true,
      required: true,
    },
    {
      title: "사용자명",
      dataIndex: "userNm",
      editable: true,
    },
    {
      title: "사용자구분코드",
      dataIndex: "userGbCd",
      editable: true,
    },
    {
      title: "사용자번호",
      dataIndex: "userNo",
      editable: true,
    },
  ]

  const buttonEvent = {
    buttonAdd() {
      tableRef.current.addRow({})
    },
    buttonSave() {
      const saveToServer = async (data: any) => {
        const res = await fetch("/api/save-json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: "user", data: data }),
        })
      }
      const valid = tableRef.current.validationCheck()
      if (!valid.result) {
        alert("필수값을 입력하세요.")
        return
      }
      const data = tableRef.current.getDataSource()
      saveToServer(data)
    },
    buttonDel() {
      tableRef.current.deleteRows()
    },
  }
  return (
    <div>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: "20px" }}
      >
        <>테스트 소제목</>
        <Flex>
          <Button onClick={buttonEvent.buttonAdd}> 추가</Button>
          <Button onClick={buttonEvent.buttonDel}> 삭제</Button>
          <Button onClick={buttonEvent.buttonSave}> 저장</Button>
        </Flex>
      </Flex>
      <AntdTable
        columns={columns}
        data={tableData}
        ref={tableRef}
        options={{ check: true }}
      />
    </div>
  )
}

export default CMUserMstrM01
