"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesModel = void 0;
const mongoose_1 = require("mongoose");
const attributesArrSchema = new mongoose_1.Schema({
    value: {
        type: String,
        required: [true, "Attribute value is required!"],
    },
    meta: {
        type: String,
        required: [true, "Attribute meta is required!"],
    },
}, { _id: false } // Optional: no _id for subdocuments
);
const attributesSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.AttributesModel = (0, mongoose_1.model)("attribute", attributesSchema);
