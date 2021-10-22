const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const ipfilter = require('express-ipfilter').IpFilter;
const MongoDBSession = require('connect-mongodb-session')(session);

const app = express();

const {MongoURI} = require("./keys");

mongoose.connect(MongoURI, 
  {useNewUrlParser:true, useUnifiedTopology:true}
  ).then((req)=>{
      console.log("Connected to MongoDB");
});

const store = new MongoDBSession({
  uri : MongoURI,
  collection : "sessions"
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(ipfilter(ips)); //filter out those digital ocean and linode IPs

require('./models/schema');
const redditAuth = require("./routes/redditAuth");
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");

app.use(session({
    secret:"totallyauniquerandomstringthatnoonecanguessorbruteforce",
    resave:false,
    saveUninitialized:false,
    cookie:{
      maxAge: 60 * 60 * 1000,
      secure:false
    },
    store:store
}));

app.use("/",redditAuth);
app.use("/",authRoute);
app.use("/",dashboardRoute);
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

const PORT = process.env.PORT;

app.get("/", (req, res)=>{
  res.render("index.ejs");
});

app.get("/destroy", (req, res)=>{
  req.session.destroy((err)=>{
    res.redirect("/");
  });
});

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}.`);
});