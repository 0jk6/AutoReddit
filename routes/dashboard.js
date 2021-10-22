const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();


const userSchema = mongoose.model("userSchema");
const planSchema = mongoose.model("planSchema");

router.get("/dashboard", async (req, res)=>{
    let userId = req.session.userId;

    let userDetails = await getUserDetails(userId);

    res.render("dashboard.ejs", {"data": userDetails, "token":req.session.token});
});

async function getUserDetails(userId){
    try{
        const user = await userSchema.findOne({_id:userId});
        const userPlan = await planSchema.findOne({id:userId});
        let userDetails = {
            "name":user.name,
            "email":user.email,
            "plan":userPlan.plan
        }
        return userDetails;
    }
    catch(err){
        console.log("Login required");
        return null;
    }
}

module.exports = router;