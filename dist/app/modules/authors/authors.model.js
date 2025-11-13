"use strict";
// Author Schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorModel = void 0;
const mongoose_1 = require("mongoose");
const authorModel = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: String,
    followersCount: { type: Number, default: 0 },
    description: String,
});
exports.AuthorModel = (0, mongoose_1.model)("Author", authorModel);
