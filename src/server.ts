import express from "express";
import "./configs/sequelize.ts";
import router from "./router/index.ts";

const app = express();

app.use(express.json());
app.use("/", router); // 애플리케이션 서버 라우트 미들웨어 등록

// 웹 서버(Web Server) 오픈
/* eslint-disable no-console */
app.listen(3000, () => {
  console.log(`Running on 3000`);
});
