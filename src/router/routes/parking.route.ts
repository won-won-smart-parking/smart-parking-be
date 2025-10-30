import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, Parking Route!!");
});

export default router;
