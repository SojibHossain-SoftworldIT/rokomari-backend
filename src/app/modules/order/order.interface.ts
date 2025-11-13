import { Types } from "mongoose";

export type TShipping = {
  name: string;
  type: "free" | "percentage" | "amount";
};

export type TTotalAmount = {
  subTotal: number;
  tax: number;
  shipping: TShipping;
  discount: number;
  total: number;
};

export type TCustomerInfo = {
  firstName: string;
  lastName: string;
  pickupLocation: string;
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  country: string;
  city: string;
  area: string;
  zone: string;
  postalCode?: string;
};

export type TPaymentInfo = {
  cardNumber: string;
  expireDate: string;
  cvc: string;
  nameOnCard: string;
};

export type TOrderInfo = {
  orderBy: Types.ObjectId;
  productInfo: Types.ObjectId;
  trackingNumber?: String;
  status:
    | "pending"
    | "processing"
    | "at-local-facility"
    | "out-for-delivery"
    | "cancelled"
    | "completed";
  isCancelled: boolean;
  quantity: number;
  totalAmount: TTotalAmount;
};

export type TOrder = {
  orderInfo: TOrderInfo[];
  customerInfo: TCustomerInfo;
  paymentInfo: TPaymentInfo | "cash-on";
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
};
