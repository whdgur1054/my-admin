import { useEffect, useRef, useState } from "react"
import AntdTable, {
  AntdTableRef,
  EditableCellProps,
  RowStatus,
} from "../../../../components/AntdTable"
import { Button, Col, Flex, Form, Input, Modal, Row, Spin } from "antd"
import { $jsonUtil } from "../../../../utils/jsonUtil"
import alasql from "alasql"
import { SearchOutlined } from "@ant-design/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// API 호출 함수들을 분리하여 정의 (재사용성 및 가독성 향상)
const fetchUsers = () => $jsonUtil.fetchJson("user").then((res) => res.data)
const fetchMenuUsers = () =>
  $jsonUtil.fetchJson("menuuser").then((res) => res.data)
const fetchMenus = () => $jsonUtil.fetchJson("menu").then((res) => res.data)

const CMMenuUserM01 = () => {
  const tableRef = useRef<AntdTableRef>(null)
  const searchFormRef = useRef<any>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // 1. useQuery를 사용하여 각 데이터를 독립적으로, 병렬로 불러옵니다.
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })
  const { data: menuUserData, isLoading: isMenuUserLoading } = useQuery({
    queryKey: ["menuUsers"],
    queryFn: fetchMenuUsers,
  })
  const { data: menuData, isLoading: isMenuLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenus,
  })

  // 전체 로딩 상태를 통합 관리
  const isLoading = isUserLoading || isMenuUserLoading || isMenuLoading

  // 2. useMutation을 사용하여 저장 로직을 처리합니다.
  const saveMutation = useMutation({
    mutationFn: (ref: AntdTableRef) => {
      console.log(ref)
      return $jsonUtil.updateJson("menuuser", ref).then((res) => {
        console.log(res)
        buttonEvent.buttonSrch()
        return res
      })
    },
    onSuccess: () => {
      // 저장이 성공하면, 관련 쿼리를 무효화하여 자동으로 데이터를 다시 불러옵니다.
      alert("저장되었습니다.")
      queryClient.invalidateQueries({ queryKey: ["menuUsers"] })
    },
    onError: (error) => {
      alert(`저장 중 오류가 발생했습니다: ${error.message}`)
    },
  })

  // 3. 데이터 로딩이 완료되면, useEffect를 통해 alasql로 데이터를 조합합니다.
  useEffect(() => {
    // 데이터가 모두 로딩되었을 때만 실행
    if (userData && menuUserData && menuData) {
      buttonEvent.buttonSrch()
    }
  }, [userData, menuUserData, menuData]) // 데이터가 변경될 때마다 실행

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
              onClick={() => setModalOpen(true)}
            ></Button>
          ) : (
            <></>
          )}
          <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onOk={() => setModalOpen(false)}
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
    buttonSrch() {
      // 검색은 클라이언트 사이드에서 처리되므로, 쿼리를 다시 실행할 필요 없이
      // useEffect를 다시 트리거하기 위해 데이터들을 재조합합니다.
      if (userData && menuUserData && menuData) {
        const searchForm = searchFormRef.current
        const formData = searchForm.getFieldsValue()
        const userId = formData.userId ?? ""
        const userNm = formData.userNm ?? ""

        let query = `SELECT T1.*, T2.userId, T3.userNm, T3.userGbCd, T3.userNo FROM ? AS T1
                     LEFT JOIN ? AS T2 ON T1.menuId = T2.menuId
                     LEFT JOIN ? AS T3 ON T2.userId = T3.userId
                     WHERE 1=1`
        const params: any[] = [menuData, menuUserData, userData]

        if (userId) {
          query += ` AND T3.userId LIKE ?`
          params.push(`%${userId}%`)
        }
        if (userNm) {
          query += ` AND T3.userNm LIKE ?`
          params.push(`%${userNm}%`)
        }
        const resultData = alasql(query, params) as any[]
        setTableData(resultData)
      }
    },
    buttonAdd() {
      tableRef.current?.addRow({})
    },
    buttonSave() {
      if (tableRef.current) {
        saveMutation.mutate(tableRef.current)
      }
    },
    buttonDel() {
      tableRef.current?.deleteRows()
    },
  }

  return (
    <Spin spinning={isLoading || saveMutation.isPending} tip="처리 중...">
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
                  <Input />
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={11}>
                <Form.Item label="사용자명" name="userNm">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Flex>
            <Button onClick={buttonEvent.buttonSrch}> 조회</Button>
            <Button onClick={buttonEvent.buttonAdd}> 추가</Button>
            <Button onClick={buttonEvent.buttonDel}> 삭제</Button>
            <Button
              onClick={buttonEvent.buttonSave}
              loading={saveMutation.isPending}
            >
              저장
            </Button>
          </Flex>
        </Flex>
        <AntdTable
          columns={columns}
          data={tableData}
          ref={tableRef}
          options={{ check: true }}
        />
      </div>
    </Spin>
  )
}

export default CMMenuUserM01
