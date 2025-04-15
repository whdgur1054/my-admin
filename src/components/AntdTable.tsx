// AntdTable.tsx
import React, { useState, useContext, useEffect, useRef } from "react"
import { Table, Input, Form } from "antd"
import type { InputRef } from "antd"
import type { FormInstance } from "antd/es/form"
import type { ColumnsType } from "antd/es/table"

interface Item {
  key: string
  name: string
  age: string
  address: string
}

const originData: Item[] = [
  {
    key: "0",
    name: "홍길동",
    age: "32",
    address: "서울특별시 강남구",
  },
  {
    key: "1",
    name: "김철수",
    age: "28",
    address: "부산광역시 해운대구",
  },
]

const EditableContext = React.createContext<FormInstance<any> | null>(null)

const EditableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, height: "100%" }} // ← 높이 고정
        name={dataIndex}
        rules={[{ required: true, message: `${title}을(를) 입력하세요.` }]}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{
            height: "100%",
            padding: "0 8px",
            borderRadius: 0,
            width: "100%", // ← 요거 추가!
          }}
        />
      </Form.Item>
    ) : (
      <div
        onClick={toggleEdit}
        style={{
          padding: "6px 8px",
          minHeight: "32px", // ← antd 테이블 행 높이와 동일하게
          lineHeight: "20px",
        }}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

interface AntdTableProps {
  data?: Item[]
  onChange?: (newData: Item[]) => void
}

const AntdTable: React.FC<AntdTableProps> = ({
  data = originData,
  onChange,
}) => {
  const [dataSource, setDataSource] = useState<Item[]>(data)

  useEffect(() => {
    setDataSource(data)
  }, [data])

  const handleSave = (row: Item) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    newData[index] = row
    setDataSource(newData)
    onChange?.(newData) // 외부로 변경 전달
  }

  const columns: ColumnsType<Item> = [
    {
      title: "이름",
      dataIndex: "name",
      editable: true,
      width: "30%",
    },
    {
      title: "나이",
      dataIndex: "age",
      editable: true,
      width: "20%",
    },
    {
      title: "주소",
      dataIndex: "address",
      width: "50%",
    },
  ]

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record: Item) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex!,
      title: col.title,
      handleSave,
    }),
  }))

  return (
    <Table
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      rowClassName={() => "editable-row"}
      bordered
      dataSource={dataSource}
      columns={mergedColumns}
      pagination={false}
      tableLayout="fixed" // ← 요거 추가!!
    />
  )
}

export default AntdTable
