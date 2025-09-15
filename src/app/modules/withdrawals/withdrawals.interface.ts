import { Types } from "mongoose";

type TStatus = "approved" | "on-hold" | "processing" | "pending" | "rejected";

export type TWithdrawals = {
  shopId: Types.ObjectId;
  amount: number;
  paymentMethod: "cash-on";
  status: TStatus;
  description: string;
  note: string;
};
