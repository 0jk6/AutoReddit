const express = require('express');
const getToken = require('../core/getAccessToken');
const submitPost = require('../core/submit');
const router = express.Router();

let token = "";

router.get("/authorize_callback",async (req, res)=>{
    try{
        let code = req.query.code;
        let accessTokenBody = JSON.parse(await getToken(code));
        let accessToken = accessTokenBody['access_token'];
        token = accessToken;
        req.session.token = accessToken;
        console.log(`maxage: ${req.session.cookie.maxAge}`);
        res.redirect("/upload")
    }
    catch(err){
        console.log(err);
        res.json({message:"something went wrong."})
    }
});

//upload route
router.get("/upload", (req, res)=>{
    if(req.session.token == ""){
        res.redirect("/dashboard");
    }
    else{
        res.render("upload.ejs", {"token":req.session.token, "data":""});
    }
})

router.post("/upload", (req, res)=>{
    let imgUrl = req.body.imgUrl;
    console.log(req.body);
    if(imgUrl == ""){
        res.redirect("/upload");
    }
    else{
        req.session.imgUrl = imgUrl;

        res.redirect("/submit");
    }
})


//submit route
router.get("/submit", (req, res)=>{
    if(req.session.token == ""){
        res.redirect("/dashboard");
    }
    else if(req.session.imgUrl == "" || req.session.imgUrl=="undefined"){
        res.render("upload.ejs", {"token":req.session.token, "data":"Please add an image and click the upload button and then click the next button."});
    }
    else{
        res.render("submit.ejs",{"token":req.session.token, "res":""});
    }
});

router.post("/submit", async(req, res)=>{
    try{
        let token = req.session.token;
        
        let subredditString = req.body.subreddit;
        let nsfw = req.body.nsfw;
        let title = req.body.title;
        let imgUrl = req.session.imgUrl;

        let subredditArray = subredditString.split(",");
        console.log(subredditArray);

        console.log(req.body)
        console.log(imgUrl)
        for(let i=0; i<subredditArray.length; i++){
            console.log("sleeping for 1000 milliseconds...");
            await sleep(1000);
            console.log(`posting on r/${subredditArray[i]}`);
            await submitPost(token, imgUrl, subredditArray[i], nsfw, title);
        }
        res.render("submit.ejs", {"token":req.session.token, "res":subredditArray.length});
    }
    catch(err){
        console.log(err);
        res.json({message:"session expired. login again."});
    }
})

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}


module.exports = router;