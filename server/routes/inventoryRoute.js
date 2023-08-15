const express = require("express");
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const route = express.Router();

route.post("/add", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.send({
                success: false,
                message: "Invalid Email"
            })
        }
        if(req.body.inventoryType === 'in' && user.userType !== 'donar') {
            throw new Error("This Email is not registered as a Donar");
        }
        if(req.body.inventoryType === 'out' && user.userType !== 'hospital') {
            throw new Error("This Email is not registered as a Hospital");
        }
        if(req.body.inventoryType === "out") {
            const requestedGroup = req.body.bloodGroup;
            const requestedQuantity = req.body.quantity;
            const loggedInOrganization = new mongoose.Types.ObjectId(req.body.userId);

            const totalInOfRequestGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization: loggedInOrganization,
                        inventoryType: "in",
                        bloodGroup: requestedGroup
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: {$sum: "$quantity"}
                    }
                }
            ]);
            const totalIn = totalInOfRequestGroup[0]?.total || 0;

            const totalOutOfRequestGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization: loggedInOrganization,
                        inventoryType: "out",
                        bloodGroup: requestedGroup
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: {$sum: "$quantity"}
                    }
                }
            ]);
            const totalOut = totalOutOfRequestGroup[0]?.total || 0;

            const availableQuantityOfRequestedBloodGroup = totalIn - totalOut;
            if(availableQuantityOfRequestedBloodGroup < requestedQuantity) {
                throw new Error(`Only ${availableQuantityOfRequestedBloodGroup} (ML) of ${requestedGroup.toUpperCase()} Blood is available! Sorry for Inconvenience`);
            }

            req.body.hospital = user._id;
        }
        else {
            const userWithExistingBloodGroup = await Inventory.findOne({donar: user._id});
            if(userWithExistingBloodGroup) {
                if(userWithExistingBloodGroup.bloodGroup !== req.body.bloodGroup) {
                    throw new Error(`Your Blood Group is ${userWithExistingBloodGroup.bloodGroup.toUpperCase()}`);
                }
            }
            req.body.donar = user._id;
        }

        const inventory = new Inventory(req.body);
        await inventory.save();
        return res.send({
            success: true,
            message: "Inventory Added Successfully"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

route.get("/get", authMiddleware, async (req, res) => {
    try {
        const inventory = await Inventory.find({organization: req.body.userId}).populate("hospital").populate("donar").sort({createdAt: -1});
        return res.send({
            success: true,
            data: inventory
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

route.get("/filter", authMiddleware, async (req, res) => {
    try {
        const user = await User.find({_id: req.body.userId});
        let inventory = null;
        if(user[0].userType === "donar") {
            inventory = await Inventory.find({inventoryType: "in", donar: new mongoose.Types.ObjectId(req.body.userId)}).populate("donar").populate("organization").sort({createdAt: -1});
        }
        if(user[0].userType === "hospital") {
            inventory = await Inventory.find({inventoryType: "out", hospital: new mongoose.Types.ObjectId(req.body.userId)}).populate("hospital").populate("organization").sort({createdAt: -1});
        }
        return res.send({
            success: true,
            data: inventory
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

route.post("/history", authMiddleware, async (req, res) => {
    try {
        const user = await User.find({_id: req.body.userId});
        let inventory = null;
        if(user[0].userType === "donar") {
            if(req.body.filters.limit) {
                inventory = await Inventory.find({inventoryType: "in", donar: new mongoose.Types.ObjectId(req.body.userId)}).populate("donar").populate("organization").limit(req.body.filters.limit).sort({createdAt: -1});
            }
            else {
                inventory = await Inventory.find({inventoryType: "in", organization: new mongoose.Types.ObjectId(req.body.filters.organizationId), donar: new mongoose.Types.ObjectId(req.body.userId)}).populate("donar").populate("organization").sort({createdAt: -1});
            }
        }
        if(user[0].userType === "hospital") {
            if(req.body.filters.limit) {
                inventory = await Inventory.find({inventoryType: "out", hospital: new mongoose.Types.ObjectId(req.body.userId)}).populate("hospital").populate("organization").limit(req.body.filters.limit).sort({createdAt: -1});
            }
            else {
                inventory = await Inventory.find({inventoryType: "out", organization: new mongoose.Types.ObjectId(req.body.filters.organizationId), hospital: new mongoose.Types.ObjectId(req.body.userId)}).populate("hospital").populate("organization").sort({createdAt: -1});
            }
        }
        if(user[0].userType === "organization") {
            inventory = await Inventory.find({organization: req.body.userId}).populate("hospital").populate("donar").limit(req.body.filters.limit).sort({createdAt: -1});
        }
        return res.send({
            success: true,
            data: inventory
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

module.exports = route;