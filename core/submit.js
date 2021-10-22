const request = require('request')


function submitPost(accessToken, imgUrl, subreddit, nsfw, title){
    let url = 'https://oauth.reddit.com/api/submit'

    let headers = {
        'Content-type': 'application/x-www-form-urlencoded',
        "Authorization": "bearer " + accessToken,
        "User-Agent": "manage your reddit easily in the maxi time created in some idea of mine by u/_jaypatel"
    }
    if(nsfw == null || nsfw == "")
        nsfw = "false";
    let data = {
        'sr': subreddit,
        'api_type': "json",
        'title': title,
        'spoiler': false,
        'nsfw' : nsfw,
        'resubmit': false,
        'sendreplies': false,
        'text':"This is raw api test",
        'kind':'image',
        'url':imgUrl,
        "extension": "json"
    }

    var options = {
        url, headers, form:data
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

module.exports = submitPost;