import express from "express";
import { supabase } from "../../configs/index.ts";
import { accessTokenMiddleware } from "../../middleware/auth.middleware.ts";
import type { CreateCarRequestBodyType, DynamicPathCarIdType, UpdateCarRequestBodyType } from "../../types/car.type.ts";

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
*/
router.post("/", accessTokenMiddleware, async (req, res) => {
  const [userId, { name, number }] = [req.user?.id, req.body] as [string, CreateCarRequestBodyType];

  try {
    // 1. 사용자가 등록한 차량 개수가 최대 개수를 넘어간 경우
    const { count } = await supabase.from("car").select("*", { count: "exact", head: true }).eq("user_id", userId);
    if ((count ?? 0) >= 3) {
      return res.status(409).json({
        code: "CAR_LIMIT_EXCEEDED",
        message: "차량은 최대 3개까지만 등록 가능합니다.",
        success: false,
      });
    }

    // 2. 최대 개수를 넘어가지 않았을 경우에는 정상적으로 차량을 등록한다.
    const { error } = await supabase.from("car").insert({
      user_id: userId,
      car_name: name,
      car_number: number,
      main: !count,
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
*/
router.delete("/:id", accessTokenMiddleware, async (req, res) => {
  const carId = req.params.id as DynamicPathCarIdType;

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
*/
router.patch("/:id", accessTokenMiddleware, async (req, res) => {
  const [userId, carId, { name, number, main }] = [req.user?.id, req.params.id, req.body] as [
    string,
    DynamicPathCarIdType,
    UpdateCarRequestBodyType,
  ];

  try {
    // 대표 차량도 같이 수정한 경우 -> 기존 대표 차량을 일반 차량으로 변경한다.
    if (main) {
      await supabase.from("car").update({ main: false }).eq("user_id", userId).eq("main", true);
    }

    const { error } = await supabase
      .from("car")
      .update({
        car_name: name,
        car_number: number,
        main,
      })
      .eq("id", carId);

    if (error) throw error; // 자동차 정보 수정 과정에서 에러가 발생한 경우
    return res.status(200).json({
      code: "CAR_UPDATE_SUCCESS",
      message: "차량 정보가 정상적으로 수정되었습니다.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: "CAR_UPDATE_ERROR",
      message: "서버 내부 과정에서 오류가 발생했습니다.",
      success: false,
      error,
    });
  }
});

/*
  ----------------------------------------------------
  자동차 대표 차량 변경 API
  ----------------------------------------------------
*/
router.patch("/main/:id", accessTokenMiddleware, async (req, res) => {
  const [userId, carId] = [req.user?.id, req.params.id] as [string, DynamicPathCarIdType];

  try {
    // 1. 사용자가 등록한 차량 개수가 1개 이하인 경우
    const { count } = await supabase.from("car").select("*", { count: "exact", head: true }).eq("user_id", userId);
    if ((count ?? 0) <= 1) {
      return res.status(409).json({
        code: "CAR_MAIN_UPDATE_CONFLICT",
        message: "등록하신 차량이 1개 이하이기 때문에 대표 차량을 변경하지 못합니다.",
        success: false,
      });
    }

    // 2. 사용자가 등록한 차량 개수가 2개 이상인 경우
    const { error: orignalCarMainUpdateError } = await supabase.from("car").update({ main: false }).eq("user_id", userId).eq("main", true);
    const { error: carMainUpdateError } = await supabase.from("car").update({ main: true }).eq("car_id", carId);

    if (orignalCarMainUpdateError || carMainUpdateError) throw orignalCarMainUpdateError ?? carMainUpdateError;

    return res.status(200).json({
      code: "CAR_MAIN_UPDATE_SUCCESS",
      message: "대표 차량이 정상적으로 변경되었습니다.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: "CAR_UPDATE_ERROR",
      message: "서버 내부 과정에서 오류가 발생했습니다.",
      success: false,
      error,
    });
  }
});

export default router;
