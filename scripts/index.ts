import dotenv from "dotenv";
import { writeReport } from "./report";
import { PublicSchema } from "./schema";

dotenv.config(); // .env 파일 내에 구성된 환경 변수 불러오기

const result = PublicSchema.safeParse(process.env); // 환경 변수 유효성 검사

// GitHub Actions에 CI 로그 환경에서 출력할 리포트 생성
const validatedKeys = Object.keys(PublicSchema.shape ?? {}); // 검증 공개키 목록 구성
writeReport(process.env.ENV_REPORT_JSON, {
  success: result.success,
  validatedKeys,
  issues: result.success ? [] : result.error.issues,
});

/* eslint-disable no-console */
if (result.success) console.log(`✅ 환경 변수 유효성 검사 통과`);
else {
  console.error(`❌ 환경 변수 유효성 검사 실패`);
  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message} -`);
  }
  process.exit(1);
}
