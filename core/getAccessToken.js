const request = require('request');

const {REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, USER_AGENT} = require("../keys");

function getToken(code){
    let url = "https://www.reddit.com/api/v1/access_token";

    let headers = {"User-Agent": USER_AGENT}

    let data = {
        "code":code,
        "grant_type":"authorization_code",
        "redirect_uri":REDIRECT_URI
    }

    let options = {
    url,
    headers,
    form:data,
    auth: {
        "username": CLIENT_ID,
        "password": CLIENT_SECRET
    }
    }

    return new Promise((resolve, reject)=>{
        request.post(options,function (error, response, body) {
                if (!error && response.statusCode==200) {
                    resolve(body)
                }
                else{
                    reject(error)
                }
            }
        );
    });    
}


module.exports = getToken;