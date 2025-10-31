import { sequelize } from "./database.ts";
import "../models/bookmark.model.ts";
import "../models/car.model.ts";
import "../models/parking.model.ts";
import "../models/ticket.model.ts";
import "../models/user.model.ts";

// Sequelize ORM <-> DB 연동 테스트 확인
/* eslint-disable no-console */
sequelize
  .authenticate()
  .then(() => {
    console.log("DB 연결 성공 ✅");
  })
  .catch(() => {
    console.log("DB 연결 실패 ❌");
  });

// Sequelize ORM 모델 기반 테이블 자동 생성
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("모델 동기화 완료 ✅");
  })
  .catch(() => {
    console.log("모델 동기화 실패 ❌");
  });
