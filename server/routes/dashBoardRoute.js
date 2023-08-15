const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");
const route = express.Router();

route.get("/blood-groups-data", authMiddleware, async (req, res) => {
    try {
        const allBloodGroups = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
        const bloodGroupsData = [];
        await Promise.all(
            allBloodGroups.map( async (bloodGroup) => {
                const totalIn = await Inventory.aggregate([
                    {
                        $match: {
                            bloodGroup: bloodGroup,
                            inventoryType: "in",
                            organization: new mongoose.Types.ObjectId(req.body.userId)
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {$sum: "$quantity"}
                        }
                    }
                ])

                const totalOut = await Inventory.aggregate([
                    {
                        $match: {
                            bloodGroup: bloodGroup,
                            inventoryType: "out",
                            organization: new mongoose.Types.ObjectId(req.body.userId)
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {$sum: "$quantity"}
                        }
                    }
                ])

                const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

                bloodGroupsData.push({
                    bloodGroup: bloodGroup,
                    totalIn: totalIn[0]?.total || 0,
                    totalOut: totalOut[0]?.total || 0,
                    available: availableBlood
                })
            })
        )
        return res.send({
            success: true,
            message: "Blood Group Data fetched successfully",
            data: bloodGroupsData
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        }) 
    }
})

module.exports = route;