import { useEffect, useRef, useState } from "react"
import AntdTable, {
  AntdTableRef,
  EditableCellProps,
  RowStatus,
} from "../../../../components/AntdTable"
import { Button, Col, Flex, Form, Input, Modal, Row } from "antd"
import { $jsonUtil } from "../../../../utils/jsonUtil"
import alasql from "alasql"
import { SearchOutlined } from "@ant-design/icons"

const CMMenuUserM01 = () => {
  const tableRef = useRef<AntdTableRef>(null)
  const searchFormRef = useRef<any>(null)
  const [tableData, setTableData] = useState<any[]>([])

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    buttonEvent.buttonSrch()
  }, [])

  interface UserMstr {
    crprCd: number
    menuId: string
    menuNm: string
    userId: string
    userNm: string
    userGbCd: string
    userNo: number
    rowStatus: RowStatus | undefined
  }

  const columns: EditableCellProps<UserMstr>[] = [
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
      title: "메뉴ID",
      dataIndex: "menuId",
      required: true,
    },
    {
      title: "메뉴명",
      dataIndex: "menuNm",
      required: true,
      render: (text: string, record: UserMstr) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{text}</span>
          {record.rowStatus === "insert" ? (
            <Button
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => {
                setModalOpen(true)
                console.log("click")
              }}
            ></Button>
          ) : (
            <></>
          )}
          <Modal
            open={modalOpen}
            onCancel={(e) => {
              setModalOpen(false)
            }}
            onClose={(e) => {
              setModalOpen(false)
            }}
            onOk={(e) => {
              setModalOpen(false)
            }}
            title="테스트"
          >
            <Form>
              <Form.Item label="메뉴 명" name="menuNm">
                <Input></Input>
              </Form.Item>
              <Form.Item label="메뉴 명" name="menuNm">
                <Input></Input>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ),
    },
    {
      title: "사용자ID",
      dataIndex: "userId",
      editable: true,
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
    async buttonSrch() {
      const searchForm = searchFormRef.current
      const formData = searchForm.getFieldsValue()
      const userId = formData.userId ?? ""
      const userNm = formData.userNm ?? ""
      let menuData = []
      let menuUserData = []
      let userData = []

      async function fetchData() {
        let userData: any[] = []
        let menuUserData: any[] = []
        let menuData: any[] = []
        await $jsonUtil.fetchJson("user").then(({ data }) => {
          userData = data
        })

        await $jsonUtil.fetchJson("menuuser").then(({ data }) => {
          menuUserData = data
        })

        await $jsonUtil.fetchJson("menu").then(({ data }) => {
          menuData = data
        })
        return { userData, menuUserData, menuData }
      }
      fetchData().then((result) => {
        //   let query = `SELECT * FROM ? AS A LEFT JOIN ? AS B ON A.menuId = B.menuId LEFT JOIN ? C ON B.userId = C.userid WHERE 1=1`
        let query = `SELECT * FROM ? AS A `

        console.log("menuData", result.menuData)
        console.log("menuUserData", result.menuUserData)
        console.log("userData", result.userData)
        //   const parmas = [menuData, menuUserData, userData]
        const parmas = [result.menuData]

        //   if (userId) {
        //     query += ` AND C.userId LIKE ?`
        //     parmas.push(`%${userId}%`)
        //   }
        //   if (userNm) {
        //     query += ` AND C.userNm LIKE ?`
        //     parmas.push(`%${userNm}%`)
        //   }
        const tableData = alasql(query, parmas) as any[]
        setTableData(tableData)
      })
    },
    buttonAdd() {
      console.log(tableRef.current?.getCurrentRow())
      tableRef.current?.addRow({})
    },
    buttonSave() {
      if (tableRef.current) {
        $jsonUtil.updateJson("menuuser", tableRef.current).then(() => {
          buttonEvent.buttonSrch()
        })
      }
    },
    buttonDel() {
      tableRef.current?.deleteRows()
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

export default CMMenuUserM01
