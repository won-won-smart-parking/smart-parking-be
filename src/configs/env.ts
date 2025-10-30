import dotenv from "dotenv";

dotenv.config();

// 환경 변수 초기화
export const env = process.env as { [key: string]: string };
