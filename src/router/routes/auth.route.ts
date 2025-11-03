import express from "express";
import type { SignInRequestBodyType, SignUpRequestBodyType } from "types/auth.type.ts";
import { AuthApiError } from "@supabase/supabase-js";
import { supabase, upload } from "../../configs/index.ts";
import { uploadProfileImage } from "../../utils/signUp.ts";

const router = express.Router();

/*
  ----------------------------------------------------
  회원가입 API 설계
  ----------------------------------------------------
  * 인증 헤더 불필요

  - 이메일 중복 유무 확인 -> 실패 시 409 Conflict + SIGN_UP_EMAIL_DUPLICATE 반환
  - Supabase 관련 -> 실패 시 500 Internal Server Error + SIGN_UP_ERROR 반환
  - 위 조건 모두 통과 시 -> 200 OK + SIGN_UP_SUCCESS 반환
*/
router.post("/sign-up", upload.single("profileImage"), async (req, res) => {
  try {
    const [newUserInfo, profileImageFile] = [req.body, req.file] as [SignUpRequestBodyType, Express.Multer.File | undefined]; // 클라이언트에서 보낸 body와 file(선택적)을 전달받는다.

    const profileImageUrl = await uploadProfileImage(profileImageFile); // 사용자 프로필 이미지를 업로드하고 이미지 경로를 반환받는다. (null | string)

    // Supabase Auth에 접근하여 사용자 정보를 구성한다.
    const { data, error: authSingUpError } = await supabase.auth.signUp({
      email: newUserInfo.email,
      password: newUserInfo.password,
    });

    // 에러가 발생한 경우
    if (authSingUpError) {
      throw authSingUpError;
    }

    // 위 절차가 모두 에러 없이 통과한 경우 Supabase DB에 유저 정보를 추가한다.
    const { error } = await supabase.from("users").insert({
      id: data.user?.id,
      name: newUserInfo.name,
      birth: newUserInfo.birth,
      profileImageUrl,
      isLocationAgreed: newUserInfo.isLocationAgreed,
      isAlarmAgreed: newUserInfo.isAlarmAgreed,
    });

    // Supabase DB에 접근하여 오류가 발생한 경우 예외를 발생시킨다.
    if (error) {
      throw error;
    }

    return res.status(201).json({
      code: "SIGN_UP_SUCCESS",
      message: "회원가입이 정상적으로 완료되었습니다.",
      success: true,
      payload: {
        id: data.user?.id,
        email: data.user?.email,
        profilImageUrl: profileImageUrl,
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      },
    });
  } catch (error) {
    if (error instanceof AuthApiError) {
      return res.status(error.status).json({
        code: error.code,
        errorType: "AuthApiError",
        message: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      code: "SIGN_UP_ERROR",
      type: "Server",
      success: false,
      error,
    });
  }
});

/*
  ----------------------------------------------------
  로그인 API 설계
  ----------------------------------------------------
  * 인증 헤더 불필요

  - 사용자 정보 유무 확인 -> 실패 시 401 Unauthorized + SIGN_IN_FAILED 반환
  - 비밀번호 일치 여부 확인 -> 실패 시 401 Unauthorized + SIGN_IN_FAILED 반환
  - 위 조건 모두 통과 시 -> 200 OK + SIGN_IN_SUCCESS 반환
*/
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body as SignInRequestBodyType;

    // Supabase Auth를 통한 로그인 시도
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 사용자 정보가 없거나, 비밀번호가 일치하지 않아 로그인 실패 시 실패 응답을 반환한다.
    if (signInError) {
      return res.status(401).json({
        code: "SIGN_IN_FAILED",
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        success: false,
      });
    }

    // 로그인 된 값을 바탕으로 일부 사용자 정보를 요청한다. + 에러가 발생 시 예외를 발생시킨다.
    const { data: userProfile, error } = await supabase.from("users").select("profileImageUrl").eq("id", signInData.user.id).single();
    if (error) {
      throw error;
    }

    // 로그인 성공 시 -> Supabase에서 발급한 Access Token + Refresh Token을 통해 응답 결과를 반환한다.
    return res.status(200).json({
      code: "SIGN_IN_SUCCESS",
      message: "로그인에 성공했습니다.",
      success: true,
      body: {
        id: signInData.user.id,
        email: signInData.user.email,
        profilImageUrl: userProfile.profileImageUrl,
        accessToken: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: "SIGN_IN_ERROR",
      success: false,
      error,
    });
  }
});

export default router;
