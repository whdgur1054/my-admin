import { useEffect, useRef, useState } from "react"
import AntdTable, { EditableCellProps } from "../../../../components/AntdTable"
import { Button, Col, Flex, Form, Input, Row } from "antd"
import { $jsonUtil } from "../../../../utils/jsonUtil"

const CMUserMstrM01 = () => {
  const tableRef = useRef<any>(null)
  const searchFormRef = useRef<any>(null)
  const [tableData, setTableData] = useState<any[]>([])

  useEffect(() => {
    $jsonUtil.fetchJson("user").then((data) => {
      setTableData(data)
    })
  }, [])

  const columns: EditableCellProps[] = [
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
    buttonSrch() {
      const searchForm = searchFormRef.current
      const formData = searchForm.getFieldsValue()
      const userId = formData.userId
      const userNm = formData.userNm
      $jsonUtil.fetchJson("user").then((data) => {
        if (userId) {
          data = data.filter((item: any) => item.userId?.includes(userId))
        }
        if (userNm) {
          data = data.filter((item: any) => item.userNm?.includes(userNm))
        }
        setTableData(data)
      })
    },
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
        <Form ref={searchFormRef}>
          <Row>
            <Col span={11}>
              <Form.Item label="사용자ID" name="userId">
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
              <Form.Item label="사용자명" name="userNm">
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Flex>
          <Button onClick={buttonEvent.buttonSrch}> 조회</Button>
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
