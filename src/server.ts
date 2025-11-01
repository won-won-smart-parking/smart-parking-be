import express from "express";
import "./configs/sequelize.ts";
import router from "./router/index.ts";

const app = express();

app.use(express.json()); // Content-Type: application/json 요청 본문(Request Body) 자동 해석
app.use(express.urlencoded({ extended: true })); // Content-Type: application: x-www-form-urlencoded 요청 본문 파싱(qs 모듈을 통해 본문 내의 URL 인코딩 데이터를 해석)

app.use("/", router); // 애플리케이션 서버 라우트 미들웨어 등록

// 웹 서버(Web Server) 오픈
/* eslint-disable no-console */
app.listen(3000, () => {
  console.log(`Running on 3000`);
});
