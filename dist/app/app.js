"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://www.bdmbazar.com",
        "https://bdm-bazar.vercel.app",
        "https://rokomari-admin-panel.vercel.app",
        "https://www.bdmbazar.com",
        "https://rokomari-customer-seven.vercel.app",
        "*"
    ],
    credentials: true,
}));
//app routes
app.use("/api/v1", routes_1.default);
//root route
app.get("/", (req, res) => {
    res.send("Rokomari server boosted on....🔥🔥🚀");
});
// //global error handler
app.use(globalErrorHandler_1.default);
// //not found route
app.use(notFound_1.default);
exports.default = app;
