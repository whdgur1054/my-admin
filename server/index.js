/**
 * TODO
 * 1. 나중에 파일접근이 동시에 이뤄질경우 데이터 손실방생으로 인한
 *  파일 접근시 LOCK처리 할지 생각. - npm install proper-lockfile
 */

// server/index.js
import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

// public 폴더 정적 리소스로 사용
app.use(express.static(path.join(__dirname, "..", "public")))

// JSON 저장 API (public/mock 경로로 저장)
app.post("/api/save-json", (req, res) => {
  const { fileName, data } = req.body

  if (!fileName) {
    return res
      .status(400)
      .json({ success: false, message: "fileName is required" })
  }

  const dirPath = path.join(__dirname, "..", "public", "mock")
  const filePath = path.join(dirPath, `${fileName}.json`)

  // 디렉토리 없으면 생성
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  let rowData = JSON.stringify(data, null, 2)
  if (Array.isArray(data)) {
    rowData = JSON.stringify(
      data.map(({ rowStatus, ...data }) => data),
      null,
      2,
    )
  }

  fs.writeFile(filePath, rowData, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "파일 저장 실패" })
    }
    res.json({
      success: true,
      message: "저장 완료",
      path: `/mock/${fileName}.json`, // 클라이언트에서 접근 가능 경로
    })
  })
})

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000")
})
