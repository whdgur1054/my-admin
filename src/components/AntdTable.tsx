// AntdTable.tsx
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  JSX,
} from "react"
import { Table, Input, Form } from "antd"
import type { InputRef, TableProps } from "antd"
import type { FormInstance } from "antd/es/form"
import "./AntdTable.css"
import { ColumnType } from "antd/es/table"

export type RowStatus =
  | "normal"
  | ""
  | "insert"
  | "update"
  | "delete"
  | "insertDelete"
  | "updateDelete"

export interface Item {
  [key: string]: any
  rowStatus?: RowStatus
}
export interface antdColType extends ColumnType {
  editable?: boolean
  required?: boolean
}
export interface EditableCellProps<T> extends antdColType {
  title: React.ReactNode | JSX.Element
  editable?: boolean
  children?: React.ReactNode
  dataIndex: keyof T
  record?: T
  required?: boolean
  handleSave?: (record: T) => void
}

interface AntdTableProps extends TableProps {
  data?: Item[]
  columns?: EditableCellProps<Item>[]
  options?: {
    check?: boolean
  }
}

export interface AntdTableRef {
  getDataSource: () => Item[]
  getCurrentRow: () => Item | null
  validationCheck: () => { result: boolean; message: string[] }
  getColumns: () => EditableCellProps<Item>[]
  setDataSource: (data: Item[]) => void
  getValue: (key: string, dataIndex: string) => any
  addRow: (newRow: Item) => void
  deleteRows: () => void
}

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

const EditableCell: React.FC<EditableCellProps<Item>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  required,
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
      handleSave?.({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children

  if (
    (required != true && editable) ||
    (required == true && record?.rowStatus === "insert" && editable)
  ) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, height: "100%" }} // ← 높이 고정
        name={dataIndex}
        rules={[{ required: required, message: `${title}을(를) 입력하세요.` }]}
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

const AntdTable = forwardRef<AntdTableRef, AntdTableProps>(
  (props: AntdTableProps, ref) => {
    const [dataSource, setDataSource] = useState<Item[]>(props.data || [])
    const [selectedRow, setSelectedRow] = useState<Item | null>(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    useEffect(() => {
      setDataSource(
        props.data?.map((Item, index) => {
          return { key: index, ...Item }
        }) || [],
      )
    }, [props.data])

    const handleSave = (row: Item) => {
      const newData = [...dataSource]
      const index = newData.findIndex((item) => row.key === item.key)
      const oldRow = newData[index]

      const hasChanged = Object.keys(row).some((key) => {
        if (key === "rowStatus" || key === "key") return false
        return row[key] !== oldRow[key]
      })

      if (row.key === oldRow.key) {
        if (hasChanged) {
          const updatedRow = {
            ...oldRow,
            ...row,
            rowStatus:
              oldRow.rowStatus === "insert"
                ? ("insert" as RowStatus)
                : oldRow.rowStatus === "delete"
                ? ("updateDelete" as RowStatus)
                : ("update" as RowStatus),
          }
          newData.splice(index, 1, updatedRow)
          setDataSource(newData)
        }
      }
    }

    useImperativeHandle(ref, () => ({
      getDataSource: () => dataSource,
      getCurrentRow: () => selectedRow,
      validationCheck: () => {
        const requiredCols = (props.columns || []).filter(
          (col: EditableCellProps<Item>) => col.required,
        )

        let result = true
        const message: string[] = []
        dataSource.forEach((row) => {
          requiredCols.forEach((col: EditableCellProps<Item>) => {
            if (!row[col.dataIndex]) {
              result = false

              message.push(
                `${dataSource.indexOf(row)} : ${col.title} is required`,
              )
            }
          })
        })
        return {
          result: result,
          message: message,
        }
      },
      getColumns: () => {
        return props.columns || []
      },

      setDataSource: (newData) => setDataSource(newData),
      getValue: (key: string, dataIndex: string) => {
        const row = dataSource.find((item) => item.key === key)
        return row ? row[dataIndex] : null
      },
      addRow: (newRow: Item) => {
        newRow.rowStatus = "insert"
        newRow.key = Math.max(...dataSource.map((item) => item.key)) + 1
        if (newRow.key === -Infinity) {
          newRow.key = 1
        }
        console.log("newRow", newRow)
        setDataSource((prev) => [...prev, newRow])
      },
      deleteRows: () => {
        const newData = [...dataSource]
        selectedRowKeys?.forEach((key) => {
          const index = newData.findIndex((item) => key === item.key)
          if (index > -1) {
            const row = newData[index]
            if (row.rowStatus === "insert") {
              newData[index] = { ...row, rowStatus: "insertDelete" }
            } else if (row.rowStatus === "insertDelete") {
              newData[index] = { ...row, rowStatus: "insert" }
            } else if (row.rowStatus === "updateDelete") {
              newData[index] = { ...row, rowStatus: "update" }
            } else if (row.rowStatus === "delete") {
              newData[index] = { ...row, rowStatus: "" }
            } else if (row.rowStatus === "update") {
              newData[index] = { ...row, rowStatus: "updateDelete" }
            } else {
              newData[index] = { ...row, rowStatus: "delete" }
            }
          }
        })
        setDataSource(newData)
        setSelectedRowKeys([])
      },
    }))

    const mergedColumns = (props.columns || []).map((col) => ({
      ...col,
      title: (
        <>
          {col.title}
          {col.required && (
            <span style={{ color: "red", marginLeft: 4 }}>*</span>
          )}
        </>
      ),
      onCell: (record: Item) => ({
        dataIndex: col.dataIndex,
        editable: col.editable,
        required: col.required,
        handleSave,
        record,
        onClick: () => {
          setSelectedRow(record)
        },
      }),
    }))

    return (
      <Table
        {...(props as TableProps<Item>)}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        // rowClassName={() => "editable-row"}

        rowClassName={(record) => {
          switch (record.rowStatus) {
            case "insert":
              return "row-new"
            case "update":
              return "row-modified"
            case "delete":
            case "insertDelete":
            case "updateDelete":
              return "row-deleted"
            default:
              return ""
          }
        }}
        bordered
        dataSource={dataSource}
        columns={mergedColumns as ColumnType<Item>[]}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selectedRowKeys,
          onChange(selectedRowKeys, selectedRows, info) {
            setSelectedRowKeys(selectedRowKeys)

            if (props.rowSelection?.onChange) {
              props.rowSelection.onChange(selectedRowKeys, selectedRows, info)
            }
          },
        }}
        pagination={false}
        tableLayout="fixed" // ← 요거 추가!!
      />
    )
  },
)

export default AntdTable
