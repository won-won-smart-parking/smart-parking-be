import express from "express";
// 상수 선언(필수 X)
const [PORT, HOST] = [8080, "0.0.0.0"];

// Express 애플리케이션 생성
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!!");
});

// Express 서버 구동
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
