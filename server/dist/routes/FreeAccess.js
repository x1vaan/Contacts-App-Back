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
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SECRET } = process.env;
const router = (0, express_1.Router)();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const oldUser = yield User_1.default.findOne({ email: email });
        if (oldUser)
            return res.status(409).send('User already registered');
        yield User_1.default.create({ name, email, password });
        res.status(201).send('User registered');
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const usuario = yield User_1.default.findOne({ email });
        if (!usuario)
            return res.status(403).send('User not registered');
        const isValid = yield bcrypt_1.default.compare(password, usuario.password);
        if (isValid) {
            const token = jsonwebtoken_1.default.sign({ email: email, id: usuario._id, name: usuario.name }, "" + SECRET, { expiresIn: '24h' });
            return res.status(200).json(token);
        }
        else {
            return res.status(401).send('Password not valid');
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
