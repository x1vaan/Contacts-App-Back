"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const FreeAccess_1 = __importDefault(require("./routes/FreeAccess"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const { MONGO_URI, SECRET } = process.env;
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch((error) => console.log(error));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use('/', FreeAccess_1.default);
app.use((req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    jsonwebtoken_1.default.verify(token, '' + SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message });
        }
        req.user = decoded;
        next();
    });
});
app.use('/auth', AuthRoutes_1.default);
exports.default = app;
