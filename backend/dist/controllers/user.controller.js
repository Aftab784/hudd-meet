"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
exports.asyncHandler = asyncHandler;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../models/user.model");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password } = req.body;
    const requiredObj = zod_1.z.object({
        name: zod_1.z.string().min(3).max(10),
        username: zod_1.z
            .string()
            .min(3)
            .max(100)
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
            .regex(/^[a-zA-Z]/, "Username must start with a letter"),
        password: zod_1.z
            .string()
            .min(8)
            .max(20)
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    });
    const parsedData = requiredObj.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Error in inputs",
            error: parsedData.error.errors,
        });
    }
    try {
        const existingUser = yield user_model_1.UserModel.find({ username });
        if (existingUser.length > 0) {
            return res
                .status(http_status_1.default.CONFLICT)
                .json({ message: "User already exists" });
        }
        // Generate salt and hash password using crypto
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        const hash = hashPassword(password, salt);
        const saltedHash = `${salt}:${hash}`;
        yield user_model_1.UserModel.create({
            name,
            username,
            password: saltedHash,
        });
        return res.status(http_status_1.default.CREATED).json({
            message: "Signed up successfully"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Server error ${err}`,
        });
    }
});
exports.register = register;
const hashPassword = (password, salt) => {
    return crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_model_1.UserModel.findOne({ username });
        if (!user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                message: "Invalid credentials"
            });
        }
        // Assume user.password is stored as "salt:hash"
        const [salt, storedHash] = user.password.split(":");
        const hash = hashPassword(password, salt);
        if (hash !== storedHash) {
            // Invalid credentials
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_USER_SECRET, { expiresIn: "1h" });
        return res.status(http_status_1.default.OK).json({
            message: "Signed in successfully",
            token
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Server error"
        });
    }
});
exports.login = login;
