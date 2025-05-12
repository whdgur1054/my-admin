import { useEffect, useRef } from "react"
import { $jsonUtil } from "../../../../utils/jsonUtil"
import { Button, Flex, Form, Input } from "antd"
import { Header } from "antd/es/layout/layout"
import Title from "antd/es/skeleton/Title"

const CMCrprMstrM01 = () => {
  const formRef = useRef<any>(null)

  useEffect(() => {
    $jsonUtil.fetchJson("company").then((data) => {
      formRef.current.setFieldsValue(data)
    })
  }, [])

  const buttonEvent = () => {
    console.log("buttonEvent")
    const saveToServer = async (data: any) => {
      const res = await fetch("/api/save-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: "company", data: data }),
      })
    }
    const data = formRef.current.getFieldsValue()
    saveToServer(data)
  }
  return (
    <div>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: "20px" }}
      >
        <>테스트 소제목</>
        <Button onClick={buttonEvent}> 저장</Button>
      </Flex>
      <Form ref={formRef}>
        <Form.Item label="코드" name="code">
          <Input></Input>
        </Form.Item>
        <Form.Item label="이름" name="name">
          <Input></Input>
        </Form.Item>
        <Form.Item label="회사" name="company">
          <Input></Input>
        </Form.Item>
        <Form.Item label="주소" name="address">
          <Input></Input>
        </Form.Item>
        <Form.Item label="번호" name="phone">
          <Input></Input>
        </Form.Item>
        <Form.Item label="이메일" name="email">
          <Input></Input>
        </Form.Item>
        <Form.Item label="적요" name="description">
          <Input></Input>
        </Form.Item>
        <Form.Item label="생성날짜" name="created_at">
          <Input></Input>
        </Form.Item>
        <Form.Item label="수정날짜" name="updated_at">
          <Input></Input>
        </Form.Item>
        <Form.Item label="id" name="_id">
          <Input></Input>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CMCrprMstrM01
