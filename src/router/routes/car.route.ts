import express from "express";
import { supabase } from "../../configs/index.ts";
import { accessTokenMiddleware } from "../../middleware/auth.middleware.ts";
import type { CreateCarRequestBodyType, DeleteCarParamType } from "../../types/car.type.ts";

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
router.post("/", accessTokenMiddleware, async (req, res) => {
  const [userId, { name, number }] = [req.user?.id, req.body] as [string, CreateCarRequestBodyType];

  try {
    // 1. 사용자가 등록한 차량 개수가 최대 개수를 넘어간 경우
    const { count } = await supabase.from("car").select("*").eq("user_id", userId);
    if ((count ?? 0) >= 3) {
      return res.status(409).json({
        code: "CAR_LIMIT_EXCEEDED",
        message: "차량은 최대 3개까지만 등록 가능합니다.",
        success: false,
      });
    }

    // 2. 최대 개수를 넘어가지 않았을 경우에는 정상적으로 차량을 등록한다.
    const { error } = await supabase.from("car").insert({
      car_name: name,
      car_number: number,
      main: count === 0,
    });

    if (error) throw error;

    return res.status(201).json({
      code: "CAR_CREATE_SUCCESS",
      message: "입력하신 차량이 성공적으로 등록되었습니다.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: "CAR_CREATE_ERROR",
      message: "서버 내부 과정에서 오류가 발생했습니다.",
      success: false,
      error,
    });
  }
});

/*
  ----------------------------------------------------
  자동차 삭제 API
  ----------------------------------------------------
  - 이메일 중복 유무 확인 -> 실패 시 409 Conflict + SIGN_UP_EMAIL_DUPLICATE 반환
  - Supabase 관련 -> 실패 시 500 Internal Server Error + SIGN_UP_ERROR 반환
  - 위 조건 모두 통과 시 -> 200 OK + SIGN_UP_SUCCESS 반환
*/
router.delete("/:id", accessTokenMiddleware, async (req, res) => {
  const carId = req.params.id as DeleteCarParamType;

  try {
    const { error } = await supabase.from("car").delete().eq("id", carId);

    if (error) throw error; // 자동차 삭제 과정에서 에러가 발생한 경우
    return res.status(200).json({
      code: "CAR_DELETE_SUCCESS",
      message: "등록하신 차량이 정삭적으로 제거되었습니다.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: "CAR_DELETE_ERROR",
      message: "서버 내부 과정에서 오류가 발생했습니다.",
      success: false,
      error,
    });
  }
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
