import { Sequelize } from "sequelize";
import { env } from "./env.ts";

// Sequelize ORM <-> 데이터베이스(MySQL) 연결 및 초기화
export const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: "mysql",
  logging: false,
});
