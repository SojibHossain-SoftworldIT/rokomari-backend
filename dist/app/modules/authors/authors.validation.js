"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuthorZodSchema = exports.authorZodSchema = void 0;
const zod_1 = require("zod");
exports.authorZodSchema = zod_1.z.object({
    name: zod_1.z.string({ error: "Author name is required!" }),
    image: zod_1.z.string().optional(),
    followersCount: zod_1.z.number().min(0).optional(),
    description: zod_1.z.string().optional(),
});
exports.updateAuthorZodSchema = exports.authorZodSchema.partial();
