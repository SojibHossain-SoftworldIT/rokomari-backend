import { Schema, model } from "mongoose";
import { TAttributes, TAttributesArr } from "./attributes.interface";

const attributesArrSchema = new Schema<TAttributesArr>(
  {
    value: {
      type: String,
      required: [true, "Attribute value is required!"],
    },
    meta: {
      type: String,
      required: [true, "Attribute meta is required!"],
    },
  },
  { _id: false } // Optional: no _id for subdocuments
);

const attributesSchema = new Schema<TAttributes>(
  {
    name: {
      type: String,
      required: [true, "Attribute name is required!"],
    },
    slug: {
      type: String,
      required: false,
    },
    attributes: {
      type: [attributesArrSchema],
      required: [true, "Attributes array is required!"],
    },
  },
  { timestamps: true }
);

export const AttributesModel = model("attribute", attributesSchema);
