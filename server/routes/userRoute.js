const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");
const route = express.Router();

route.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({email: req.body.email});
        if(userExists) {
            return res.send({
                success: false,
                message: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const user = new User(req.body);
        await user.save();

        return res.send({
            success: true,
            message: "User registered Successfully"
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
});

route.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.send({
                success: false,
                message: "User not found!"
            })
        }
        if(user.userType !== req.body.userType) {
            return res.send({
                success: false,
                message: `You are not registered as a ${req.body.userType.toUpperCase()}`
            })
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(!validPassword) {
            return res.send({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"});
        return res.send({
            success: true,
            message: "User logged successfully",
            data: token
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
});

route.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId });
        user.password = undefined;
        return res.send({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

route.get("/get-all-donars", authMiddleware, async (req, res) => {
    try {
        const loggedInOrganization = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueDonarIds = await Inventory.distinct("donar", {organization: loggedInOrganization});
        const uniqueDonars = await User.find({_id: {$in: uniqueDonarIds}}).sort({createdAt: -1});
        // console.log(uniqueDonars);
        return res.send({
            success: true,
            message: "Donars fetched successfully",
            data: uniqueDonars
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

route.get("/get-all-hospitals", authMiddleware, async (req, res) => {
    try {
        const loggedInOrganization = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueHospitalIds = await Inventory.distinct("hospital", {organization: loggedInOrganization});
        const uniqueHospitals = await User.find({_id: {$in: uniqueHospitalIds}}).sort({createdAt: -1});
        // console.log(uniqueDonars);
        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: uniqueHospitals
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

route.get("/get-all-organizations-for-donar", authMiddleware, async (req, res) => {
    try {
        const loggedInDonar = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrganizationIds = await Inventory.distinct("organization", {donar: loggedInDonar});
        const uniqueOrganizations = await User.find({_id: {$in: uniqueOrganizationIds}}).sort({createdAt: -1});
        
        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: uniqueOrganizations
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

route.get("/get-all-organizations-for-hospital", authMiddleware, async (req, res) => {
    try {
        const loggedInHospital = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrganizationIds = await Inventory.distinct("organization", {hospital: loggedInHospital});
        const uniqueOrganizations = await User.find({_id: {$in: uniqueOrganizationIds}}).sort({createdAt: -1});
        
        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: uniqueOrganizations
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

module.exports = route;