import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const env = process.env as { [key: string]: string };

// Sequelize ORM 데이터베이스(MySQL) 구성
export const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

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
