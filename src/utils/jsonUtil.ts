import { AntdTableRef, Item } from "../components/AntdTable"
import alasql from "alasql"

const fetchJson = async (jsonName: string) => {
  // const res = await axios.get("/api/menu"); // 여기를 본인 API 주소로
  return fetch("/mock/" + jsonName + ".json")
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log("json data", data.data)
      return { data: data.data, table: data.table }
    })
}
const updateJson = async (jsonName: string, gridRef: AntdTableRef) => {
  // table의 데이터
  const data = gridRef.getDataSource()

  const jsonArray = await fetchJson(jsonName)
  const jsonData = jsonArray.data

  //실제 table의 column
  const ori_columnList = gridRef.getColumns()
  //rowStatus는 업데이트 시에만 사용하므로 제외
  const columnList = ori_columnList
    .filter((item) => item.dataIndex !== "rowStatus")
    .filter((item) =>
      Object.keys(jsonArray.table).includes(item.dataIndex as string),
    )
  console.log("columnList", columnList)

  //alasql을 사용하기 위해 jsonData를 테이블로 변환
  alasql(`DROP TABLE IF EXISTS ${jsonName}`)
  alasql(`CREATE TABLE ${jsonName}`, [
    columnList.map((item) => item.dataIndex).join(","),
  ])
  alasql(`INSERT INTO ${jsonName} SELECT * from ?`, [jsonData])

  let resultCnt = 0
  data.map((rawData: Item) => {
    // rowStatus는 업데이트 시에만 사용하므로 제외
    const { rowStatus, ...record } = rawData as Record<string, any>

    //rowStatus가 update인 경우
    if (rowStatus === "update") {
      // 컬럼의 requried가 true인 경우는 where절에 사용
      // 컬럼의 requried가 false인 경우는 set절에 사용
      const setquery =
        columnList?.filter((item) => item.required !== true) || []
      const setClauses = setquery
        .map((key) => `${key.dataIndex} = ?`)
        .join(", ")
      const setValues = setquery.map((key) => record[key?.dataIndex])

      const keyColumns =
        columnList?.filter((item) => item.required === true) || []
      const whereClauses = keyColumns
        .map((key) => `${key.dataIndex} = ?`)
        .join(" AND ")
      const whereValues = keyColumns.map((key) => record[key?.dataIndex])

      const query = `UPDATE ${jsonName} SET ${setClauses} WHERE ${whereClauses}`

      resultCnt += alasql(query, [...setValues, ...whereValues]) as number
    } else if (rowStatus === "insert") {
      //TODO: INSERT

      const keyColumns =
        columnList?.filter((item) => item.required === true) || []
      const whereClauses = keyColumns
        .map((key) => `${key.dataIndex} = ?`)
        .join(" AND ")
      const whereValues = keyColumns.map((key) => record[key?.dataIndex])

      const requiredValid = whereValues.filter((item) => item === undefined)

      if (requiredValid.length > 0) {
        alert(`${data.indexOf(rawData)}행의 필수값이 없습니다.`)
        return
      }

      const validQuery = `SELECT * FROM ${jsonName} WHERE ${whereClauses}`
      const validResult = alasql(validQuery, [...whereValues])

      if (validResult.length > 0) {
        alert("이미 존재하는 데이터입니다.")
        return
      }

      const columns = columnList.map((item) => item.dataIndex).join(", ")
      const values = columnList
        .map((item) => {
          if (item.dataIndex === "_seq") {
            const _seqsql = `(SELECT MAX(COALESCE(_seq,0)+1) FROM ${jsonName} WHERE ${whereClauses})`
            return alasql(_seqsql, [...whereValues]) as number
          }

          return `'${record[item?.dataIndex] ?? ""}'`
        })
        .join(", ")

      const query = `INSERT INTO ${jsonName} (${columns}) VALUES (${values})`

      console.log("query", query)
      resultCnt += alasql(query) as number

      console.log("result", result)
    } else if (rowStatus === "delete" || rowStatus === "updateDelete") {
      //TODO: DELETE

      const keyColumns =
        columnList?.filter((item) => item.required === true) || []
      const whereClauses = keyColumns
        .map((key) => `${key.dataIndex} = ?`)
        .join(" AND ")
      const whereValues = keyColumns.map((key) => record[key?.dataIndex])

      const query = `DELETE FROM ${jsonName}  WHERE ${whereClauses}`

      resultCnt += alasql(query, [...whereValues]) as number
    }
  })
  const result = alasql(`SELECT * FROM ${jsonName}`)
  console.log("result", result)
  const saveToServer = async (data: any) => {
    const res = await fetch("/api/save-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: jsonName, data: data }),
    })
  }
  await saveToServer({ table: jsonArray.table, data: result })
  return resultCnt
}
export const $jsonUtil = {
  fetchJson,
  updateJson,
}
