import { TTotalAmount } from "./../order/order.interface";
import { Types } from "mongoose";

export type TCartItemProduct = {
  productId: Types.ObjectId[];
  quantity: number;
  totalAmount: number;
};

export type TAddress = {
  type: "billing" | "shipping";
  title: string;
  country: string;
  city: string;
  state: string;
  "zip-code": string;
  street: string;
};

export type TCartItem = {
  userId: Types.ObjectId;
  productInfo: TCartItemProduct;
};

export type TWishlist = {
  userId: Types.ObjectId;
  products: Types.ObjectId;
};

export type TOrders = {
  orderInfo: Types.ObjectId;
  totalAmount: TTotalAmount;
};

export type TCustomer = {
  userId: Types.ObjectId;
  address: TAddress[];
  cardInfo: null;
  cartItem: TCartItem[];
  wishlist: TWishlist[];
  orders: TOrders[];
};
