//var fs = require('fs');
//var https = require('https');
var http = require('http');
var express = require('express');
var fileS = require('fs');
const mega = require('megajs')
var { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

var PORT = process.env.PORT|| 8080;
//

// Fill the appID and appCertificate key given by Agora.io
var appID = "9d8272590d614b45b23f0acaf03a73d0";
var appCertificate = "77286da60e2a4159b82f3241c75e6d92";

// token expire time, hardcode to 3600 seconds = 1 hour
var expirationTimeInSeconds = 3600
var role = RtcRole.PUBLISHER

var app = express();
app.disable('x-powered-by');
app.set('port', PORT);
app.use(express.favicon());
app.use(app.router);

var generateRtcToken = function (req, resp) {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var channelName = req.query.channelName;
    // use 0 if uid is not specified
    var uid = req.query.uid || 0
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel name is required' }).send();
    }


    var key = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

    resp.header("Access-Control-Allow-Origin", "*")
    //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

var generateRtmToken = function (req, resp) {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var account = req.query.account;
    if (!account) {
        return resp.status(400).json({ 'error': 'account is required' }).send();
    }

    var key = RtmTokenBuilder.buildToken(appID, appCertificate, account, RtmRole, privilegeExpiredTs);

    resp.header("Access-Control-Allow-Origin", "*")
    //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

var getCallHistory = function (req, res) {

}
var getUserPorfile = function (req, res) {

}
var getSite = function (req, res) {
    fs.createReadStream('myfile.txt').pipe(storage.upload('myfile.txt'))

    storage.upload({ name: 'myfile.txt' }, buffer, function (err, file) {

    })
}

app.get('/rtcToken', generateRtcToken);
app.get('/rtmToken', generateRtmToken);
app.get('call_history', getCallHistory);
app.get('/user_profil', getUserPorfile);


http.createServer(app).listen(app.get('port'), function () {
    console.log('AgoraSignServer starts at ' + app.get('port'));
});

//https.createServer(credentials, app).listen(app.get('port') + 1, function() {
//    console.log('AgoraSignServer starts at ' + (app.get('port') + 1));
//});