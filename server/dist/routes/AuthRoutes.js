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
const router = (0, express_1.Router)();
router.put('/addcontact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, phone } = req.body;
        yield User_1.default.updateOne({ _id: id }, {
            $push: {
                contacts: { name, phone }
            }
        });
        res.status(201).send('Contact added');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.get('/contacts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const contacts = yield User_1.default.findById(id).select('contacts');
        res.status(200).send(contacts === null || contacts === void 0 ? void 0 : contacts.contacts);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.delete('/deleteContact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const { _id } = req.body;
        let contacts = yield User_1.default.findById(id).select('contacts');
        let contactsFiltered = (_d = contacts === null || contacts === void 0 ? void 0 : contacts.contacts) === null || _d === void 0 ? void 0 : _d.filter(contact => contact._id.toString() !== _id);
        yield User_1.default.updateOne({ _id: id }, {
            contacts: contactsFiltered
        });
        res.status(200).json(contactsFiltered);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.put('/editContact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const id = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        const { name, phone, _id } = req.body;
        yield User_1.default.updateOne({
            _id: id, contacts: { $elemMatch: { _id: _id } }
        }, {
            $set: { 'contacts.$.name': name, 'contacts.$.phone': phone }
        });
        res.status(200).json('Contact edited');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.default = router;
