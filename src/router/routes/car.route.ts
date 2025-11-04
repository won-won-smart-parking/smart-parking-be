import express from "express";
import { supabase } from "../../configs/index.ts";
import { accessTokenMiddleware } from "../../middleware/auth.middleware.ts";
import { CreateCarRequestBodyType } from "../../types/car.type.ts";

const router = express.Router();

/*
  ----------------------------------------------------
  자동차 조회 API
  ----------------------------------------------------
  - 성공 응답 -> 200 OK + CAR_FETCH_SUCCESS
  - 실패 응답 -> 500 Internal Server Error + CAR_FETCH_ERROR
*/
router.get("/", accessTokenMiddleware, async (req, res) => {
  const userId = req.user?.id; // 사용자 ID 조회

  try {
    const { data, error } = await supabase.from("car").select("*").eq("user_id", userId);

    if (error) {
      throw error;
    }

    // 모든 차량 정보가 조회된 경우의 성공 응답 상태 구성
    return res.status(200).json({
      code: "CAR_FETCH_SUCCESS",
      message: "사용자가 등록한 모든 차량 정보가 성공적으로 조회되었습니다.",
      success: true,
      payload: {
        count: data.length,
        infos: data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: "CAR_FETCH_ERROR",
      message: "서버 내부 과정에서 오류가 발생했습니다.",
      success: false,
      error,
    });
  }
});

/*
  ----------------------------------------------------
  자동차 등록 API
  ----------------------------------------------------
  - 이메일 중복 유무 확인 -> 실패 시 409 Conflict + SIGN_UP_EMAIL_DUPLICATE 반환
  - Supabase 관련 -> 실패 시 500 Internal Server Error + SIGN_UP_ERROR 반환
  - 위 조건 모두 통과 시 -> 200 OK + SIGN_UP_SUCCESS 반환
*/
router.post("/", accessTokenMiddleware, async (req, res) => {});

/*
  ----------------------------------------------------
  자동차 삭제 API
  ----------------------------------------------------
  - 이메일 중복 유무 확인 -> 실패 시 409 Conflict + SIGN_UP_EMAIL_DUPLICATE 반환
  - Supabase 관련 -> 실패 시 500 Internal Server Error + SIGN_UP_ERROR 반환
  - 위 조건 모두 통과 시 -> 200 OK + SIGN_UP_SUCCESS 반환
*/
router.delete("/:id", (req, res) => {
  res.send("Hello, Car Route!!");
});

/*
  ----------------------------------------------------
  자동차 수정 API
  ----------------------------------------------------
  - 이메일 중복 유무 확인 -> 실패 시 409 Conflict + SIGN_UP_EMAIL_DUPLICATE 반환
  - Supabase 관련 -> 실패 시 500 Internal Server Error + SIGN_UP_ERROR 반환
  - 위 조건 모두 통과 시 -> 200 OK + SIGN_UP_SUCCESS 반환
*/
router.patch("/:id", (req, res) => {
  res.send("Hello, Car Route!!");
});

export default router;
