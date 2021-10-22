# AutoReddit - a simple web app that helps you post images on multiple subreddits under a minute

## How to use this?
Go to ```keys.js``` file and put your keys there. ```CLIENT_ID and CLIENT_SECRET``` can be obtained from https://www.reddit.com/prefs/apps

```REDIRECT_URI``` is the one that you specified while getting your ```CLIENT_ID and CLIENT_SECRET``` from Reddit.

Then, go to ```views/dashboard.ejs``` file and change the ```REDIRECT_URI``` in the 19th line.

Once you did that, you can run the ```server.js``` file and start using the web app.