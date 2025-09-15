import { WithdrawalControllers } from "./withdrawals.controller";
import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import { createWithdrawalZodSchema } from "./withdrawals.validations";

const router = express.Router();

router.post(
  "/",
  validateRequest(createWithdrawalZodSchema),
  WithdrawalControllers.createWithdrawal
);

router.get("/", WithdrawalControllers.getWithdrawals);
router.get("/:id", WithdrawalControllers.getSingleWithdrawal);

// router.patch(
//   "/:id",
//   validateRequest(createWithdrawalZodSchema.partial()),
//   WithdrawalControllers.updateWithdrawal
// );

// router.delete("/:id", WithdrawalControllers.deleteWithdrawal);

export const WithdrawalRoutes = router;
