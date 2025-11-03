import express from "express";
import type { SignUpRequestBodyType } from "types/auth.type.ts";
import { supabase, upload } from "../../configs/index.ts";
import { encodePassowrd } from "../../utils/bcrypt.ts";
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

    // 입력한 이메일 중복 여부를 검증한다.
    // - 중복되지 않았을 경우의 결과값: { error: null, data: null, count: 0, status: 200, statusText: 'OK' }
    // - 중복된 경우의 결과값: { error: null, data: null, count: 1, status: 200, statusText: 'OK' }
    const { count } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("email", newUserInfo.email);
    if (count && count > 0) {
      return res.status(409).json({
        code: "SIGN_UP_EMAIL_DUPLICATE",
        message: "입력하신 이메일은 이미 사용 중입니다.",
        success: false,
      });
    }

    const hashedPassword = await encodePassowrd(newUserInfo.password); // 비밀번호를 bcrypt를 통해 사용자가 입력한 비밀번호를 암호화시킨다.
    const profileImageUrl = await uploadProfileImage(profileImageFile); // 사용자 프로필 이미지를 업로드하고 이미지 경로를 반환받는다. (null | string)

    // 위 절차가 모두 에러 없이 통과한 경우 Supabase DB에 유저 정보를 추가한다.
    const { error } = await supabase.from("users").insert({
      ...newUserInfo,
      password: hashedPassword,
      profileImageUrl,
    });

    // Supabase DB에 접근하여 오류가 발생한 경우 예외를 발생시킨다.
    if (error) {
      throw error;
    }

    // 성공 응답 전송
    return res.status(200).json({
      code: "SIGN_UP_SUCCESS",
      message: "회원가입이 정상적으로 완료되었습니다.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: "SIGN_UP_ERROR",
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
// router.post("/sign-in", async (req, res) => {
//   const { email, password } = req.body as { email: string; password: string };

//   // Sequelize Model로 정의한 User 테이블에서 이메일에 일치한 사용자 정보를 가져온다.
//   const user = await User.findOne({
//     where: {
//       email,
//     },
//     attributes: ["id", "email", "password"],
//   });

//   // 사용자 정보가 존재하지 않는 경우 -> 실패 응답을 전송한다.
//   if (!user) {
//     return res.status(401).json({
//       code: "SIGN_IN_FAILED",
//       message: "아이디 또는 비밀번호가 일치하지 않습니다.",
//       success: false,
//     });
//   }

//   // 사용자 정보가 존재하는 경우 -> 비밀번호 일치 여부를 확인한다.
//   // const isPasswordMatch = await comparePassword(password, user.password); -> 회원가입 이후 bcrypt 정확히 수행 후 리팩토링
//   if (password !== user.password) {
//     return res.status(401).json({
//       code: "SIGN_IN_FAILED",
//       message: "아이디 또는 비밀번호가 일치하지 않습니다.",
//       success: false,
//     });
//   }

//   // 사용자 정보가 존재하면서 비밀번호까지 일치한 경우 성공 응답을 전송한다.
//   return res.status(200).json({
//     code: "SIGN_IN_SUCCESS",
//     message: "로그인에 성공했습니다.",
//     success: true,
//     body: {
//       id: user.id,
//       accessToken: "accessToken",
//       refreshToken: "refreshToken",
//     },
//   });
// });

export default router;
