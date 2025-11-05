import { type RequestHandler } from "express";
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "../configs/index.ts";

/*
  ----------------------------------------------------
  AccessToken 예외-처리 미들웨어
  ----------------------------------------------------
  - AUTH_HEADER_SYNTAX_ERROR -> AccessToken의 형식이 잘못된 경우 발생하는 예외
  - ACCESS_TOKEN_EXPIRED_ERROR -> AccessToken의 유효 시간이 만료된 경우 발생하는 예외
  - AUTH_HEADER_MISSING -> AccessToken이 전달이 안된 경우 발생하는 예외
*/
export const accessTokenMiddleware: RequestHandler = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer Token에서 AccessToken만 분리하여 변수에 저장한다.

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);

    // AccessToken에 일부 에러가 발생한 경우 예외를 발생시킨다.
    if (error) {
      throw error;
    }

    // 사용자 정보를 무사히 전달받았을 경우, req.user에 User 정보를 저장 후 다음 미들웨어로 넘어간다.
    req.user = data.user;
    next();
  } catch (error) {
    // Supabase에 의해 생긴 에러인 경우
    if (error instanceof AuthError) {
      switch (error.code) {
        case "no_authorization": {
          return res.status(error.status || 401).json({
            code: "AUTH_HEADER_SYNTAX_ERROR",
            message: "Access Token의 형식이 잘못되었습니다.",
            success: false,
          });
        }
        case "bad_jwt": {
          return res.status(error.status || 403).json({
            code: "ACCESS_TOKEN_EXPIRED_ERROR",
            message: "Access Token의 유효 기간이 만료되었습니다.",
            success: false,
          });
        }
        default: {
          return res.status(error.status || 400).json({
            code: "AUTH_HEADER_MISSING",
            message: "Access Token이 Authorization 헤더에 포함하지 않고 요청을 보냈습니다.",
            success: false,
          });
        }
      }
    }

    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "서버 내부 인증 과정에서 오류가 발생했습니다.",
      success: false,
    });
  }
};
