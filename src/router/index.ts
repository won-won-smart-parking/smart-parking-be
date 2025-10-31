import express from "express";
import { carRouter, parkingRouter, paymentRouter, searchRouter, userRouter } from "./routes/index.ts";

const router = express.Router();

// Router 객체 경로 미들웨어(Path middleware) 등록
// 동작 순서: 요청(Request) -> middleware1 -> middleware2 -> ... -> middleware{N} -> router -> Response
router.use("/users", userRouter);
router.use("/payment", paymentRouter);
router.use("/parking", parkingRouter);
router.use("/search", searchRouter);
router.use("/car", carRouter);

export default router;
