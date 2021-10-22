const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validateEmail = require("../core/utils");

const router = express.Router();

const userSchema = mongoose.model("userSchema");
const planSchema = mongoose.model("planSchema");

router.get("/register", (req, res)=>{
    res.render("register.ejs", {"data":""});
})

router.post("/register", (req, res)=>{
    const {name, email, password} = req.body;
    console.log(req.body);
    if(!email || !password || !name){
        return res.render("register.ejs",{"data":"Please fill all the fields."});
        //return res.status(422).json({error:"please fill all the fields"});
    }
    else{
        if(validateEmail(email)==false){
            return res.render("register.ejs", {"data":"Invalid email!"});
        }
        userSchema.findOne({email:email}).then((savedUser)=>{
            if(savedUser){
                return res.render("register.ejs", {"data":"That email was already registered!"});
                //return res.status(422).json({error:"user already exists."});
            }
            else{
                //save the data;
                bcrypt.hash(password,12).then(hashedpassword=>{
                    const user = new userSchema({
                        email:email,
                        password:hashedpassword,
                        name:name
                    })
    
                    user.save().then(user=>{
                        const plan = new planSchema({
                            id:user._id,
                            email:user.email,
                            plan:"0"
                        })
                        plan.save();
                        res.redirect("/login");
                        //res.json({message:"saved successfully"})
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                })
            }
        }).catch(err=>{
            console.log(err);
        })
    }
})


router.get("/login", (req, res)=>{
    if(req.session.userId != null)
        res.redirect("/dashboard");
    else{
        res.render("login.ejs", {"data":""});
    }
})


router.post("/login", async (req, res)=>{
    //de-structure the user's input
    const {email, password} = req.body;
    if(!email || !password){
        return res.render("login.ejs",{"data":"Please fill all the fields."});
        //return res.status(422).json({error:"please fill all the fields"});
    }
    else{
        await userSchema.findOne({email:email}).then(savedUser=>{
            if(!savedUser){
                return res.render("login.ejs",{"data":"Invalid email or password"});
                //return res.status(422).json({error:"Invalid email or password"})
            }
            else{
                bcrypt.compare(password, savedUser.password).then(doMatch=>{
                    if(doMatch==true){
                        req.session.userId = (savedUser._id).toString();
                        req.session.token = "";
                        req.session.imgUrl = "";
                        res.redirect("/dashboard");
                    }
                    else{
                        res.render("login.ejs",{"data":"Invalid email or password"});
                        //res.status(422).json({error:"invalid email or password"});
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        })
    }
})

module.exports = router;