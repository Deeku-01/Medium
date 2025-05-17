"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParams = exports.updateBlog = exports.createBlog = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
// zod validation for backend 
exports.signupInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    username: zod_1.default.string(),
    password: zod_1.default.string().min(6)
});
// For signin
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
// For Create Blog 
exports.createBlog = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string()
});
// For Updating a Blog
exports.updateBlog = zod_1.default.object({
    id: zod_1.default.number(),
    title: zod_1.default.string(),
    content: zod_1.default.string()
});
// get /:id
exports.checkParams = zod_1.default.object({
    id: zod_1.default.number()
});
