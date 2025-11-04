import express from "express";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../configs/index.ts";

const router = express.Router();

/*
  ----------------------------------------------------
  이메일 중복 여부 API 설계
  ----------------------------------------------------
  - Authroization 안 보낸 경우 -> 401 Unauthorized + SIGN_OUT_FAILD_AUTH_MISSING 응답 반환
  - 로그아웃 성공 시 -> 200 OK + SIGN_OUT_SUCCESS 응답 반환
*/
router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query as { email: string };

    // email 쿼리 스트링을 보내지 않는 경우 필드가 빠졌다는 실패 응답을 보낸다.
    if (!email) {
      return res.status(400).json({
        code: "CHECK_EMAIL_MISSING_FIELD",
        message: "이메일 필드가 누락되었습니다.",
        success: false,
      });
    }

    // 이메일 존재여부 검증
    const { data, error } = await supabase.from("users").select("id").eq("email", email).single();
    if (error) {
      throw error;
    }

    return res.status(200).json({
      code: "VALID_EMAIL",
      message: "이메일 인증이 완료되었습니다.",
      success: true,
      payload: {
        id: data.id,
      },
    });
  } catch (error) {
    if (error instanceof PostgrestError) {
      return res.status(404).json({
        code: error.code,
        message: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      code: "CHECK_EMAIL_ERROR",
      success: false,
      error,
    });
  }
});

export default router;
