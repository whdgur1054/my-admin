import { Button, Col, Flex, Form, Input, Modal, Row } from "antd"
import { useEffect, useRef, useState } from "react"
import AntdTable, {
  antdColType,
  AntdTableRef,
  EditableCellProps,
} from "../../../../../components/AntdTable"
import { useMenu } from "../../../../../hooks/useMenu"

const CMMenuModal = (open, result) => {
  const [modalopen, setModalOpen] = useState(true)
  const tableRef = useRef<AntdTableRef>(null)
  const [tableData, setTableData] = useState<any[]>([])

  const menuList = useMenu().rawMenuItems

  useEffect(() => {
    setTableData(menuList)
  }, [menuList])

  const columns: antdColType[] = [
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
  ]

  return (
    <Modal
      open={modalopen}
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
      <Flex justify="space-between" align="center">
        <Form>
          <Row>
            <Col span={11}>
              <Form.Item label="메뉴ID" name="menuId">
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="메뉴 명" name="menuNm">
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Button style={{ marginBottom: "24px" }}>조회</Button>
      </Flex>
      <AntdTable
        columns={columns}
        data={tableData}
        ref={tableRef}
        options={{ check: true }}
        size="small"
      />
    </Modal>
  )
}

export default CMMenuModal
