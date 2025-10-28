import express from "express";
import parkingRouter from "./routes/parking.route";
import paymentRouter from "./routes/payment.route";
import userRouter from "./routes/user.route";

const router = express.Router();

router.use("/users", userRouter);
router.use("/payment", paymentRouter);
router.use("/parking", parkingRouter);

export default router;
