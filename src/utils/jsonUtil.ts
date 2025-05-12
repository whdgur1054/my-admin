const fetchJson = async (jsonName: string) => {
  // const res = await axios.get("/api/menu"); // 여기를 본인 API 주소로
  return fetch("/mock/" + jsonName + ".json")
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log("json data", data)
      return data
    })
}
export const $jsonUtil = {
  fetchJson,
}
