import express from "express";
import User from "../../models/user.model.ts";

const router = express.Router();

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
  const { email, password } = req.body as { email: string; password: string };

  // Sequelize Model로 정의한 User 테이블에서 이메일에 일치한 사용자 정보를 가져온다.
  const user = await User.findOne({
    where: {
      email,
    },
    attributes: ["id", "email", "password"],
  });

  // 사용자 정보가 존재하지 않는 경우 -> 실패 응답을 전송한다.
  if (!user) {
    return res.status(401).json({
      code: "SIGN_IN_FAILED",
      message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      success: false,
    });
  }

  // 사용자 정보가 존재하는 경우 -> 비밀번호 일치 여부를 확인한다.
  // const isPasswordMatch = await comparePassword(password, user.password); -> 회원가입 이후 bcrypt 정확히 수행 후 리팩토링
  if (password !== user.password) {
    return res.status(401).json({
      code: "SIGN_IN_FAILED",
      message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      success: false,
    });
  }

  // 사용자 정보가 존재하면서 비밀번호까지 일치한 경우 성공 응답을 전송한다.
  return res.status(200).json({
    code: "SIGN_IN_SUCCESS",
    message: "로그인에 성공했습니다.",
    success: true,
    body: {
      id: user.id,
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    },
  });
});

export default router;
