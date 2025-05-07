import express from "express"
import fs from "fs"
import path from "path"
import cors from "cors"

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post("/api/save-json", (req, res) => {
  const data = req.body
  const filePath = path.join(__dirname, "data", "saved.json")

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error saving JSON:", err)
      return res.status(500).send("Failed to save file")
    }
    res.send("File saved successfully")
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
