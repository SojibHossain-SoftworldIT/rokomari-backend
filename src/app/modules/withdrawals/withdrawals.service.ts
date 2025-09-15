import { TWithdrawals } from "./withdrawals.interface";
import { WithdrawalModel } from "./withdrawals.model";

const createWithdrawalOnDB = async (payload: TWithdrawals) => {
  const result = await WithdrawalModel.create(payload);
  return result;
};

const getWithdrawalsFromDB = async () => {
  const result = await WithdrawalModel.find().populate("shopId");
  return result;
};

const getSingleWithdrawalFromDB = async (id: string) => {
  const result = await WithdrawalModel.findById(id).populate("shopId");
  return result;
};

const updateWithdrawalOnDB = async (
  id: string,
  payload: Partial<TWithdrawals>
) => {
  const result = await WithdrawalModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteWithdrawalFromDB = async (id: string) => {
  const result = await WithdrawalModel.findByIdAndDelete(id);
  return result;
};

export const withdrawalServices = {
  createWithdrawalOnDB,
  getWithdrawalsFromDB,
  getSingleWithdrawalFromDB,
  updateWithdrawalOnDB,
  deleteWithdrawalFromDB,
};
