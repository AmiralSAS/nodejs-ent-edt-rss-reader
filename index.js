var colors                              = require("colors");
var http                                = require("http");
var url                                 = require("url");
var fs                                  = require("fs");
var express                             = require("express");
app                                     = express();
var server                              = http.createServer(app);
var io                                  = require('socket.io').listen(server);
var FeedParser                          = require('feedparser')
var request                             = require('request');

var port                                = process.env.PORT || 80;


server.listen( port );
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});
console.log( "      Server listening on port : ".cyan.bold + port );


io.sockets.on('connection', function(socket){
  socket.emit("connectionValid");

  socket.on('clientSendRssUrl', function(datas){
    console.log("      clientSendRssUrl - %s".cyan.bold, datas.feedUrl);
    
    if (typeof(datas.feedUrl) != "string") {
      console.log("      ERROR - input not a string".red.bold);
      return false;
    }
    if ( (datas.feedUrl.indexOf("http://") != 0 ) && (datas.feedUrl.indexOf("https://") != 0 ) ) {
      console.log("      ERROR - protocol is not http/https".red.bold);
      return false;
    }
    if ( datas.feedUrl.indexOf("://sedna.univ-fcomte.fr/") == -1) {
      console.log("      ERROR - website is not sedna.univ-fcomte.fr".red.bold);
      return false;
    }

    getRssInformations( datas.feedUrl );
  });

  /**
    A function in getRssInformations() require 
    to be in io.sockets.on(...) otherwise it bug
  **/

  function getRssInformations( rssStreamUrl ){
    request( rssStreamUrl )
      .pipe(new FeedParser())
      .on('error', function(error) {
        console.log("      ===== ERROR =====".red.bold);
        console.error(error);
      })
      .on('meta', function (meta) {
        console.log("      ===== META =====".yellow.bold);
        console.log('      %s'.yellow, meta.title);
      })
      .on('readable', function () {
        var stream = this, item;
        while (item = stream.read()) {
          console.log("      ===== SUCCESS =====".green.bold);
          console.log('      %s'.green, item.title);
          var jsonStream = formalizeDatas( item );
          socket.emit("returnFeed", jsonStream);
        }
      });
  }

  function formalizeDatas( inputDatas ){
    var selectedInputDatas = inputDatas.description;
    var datas = {};
    var tmpDatas = selectedInputDatas.split("</p>");

    tmpDatas[0] = tmpDatas[0].replace("<p>", "");
    tmpDatas[1] = tmpDatas[1].replace("<p>", "");

    datas.date = extractDate( tmpDatas[0] );
    datas.details = extractDetails( tmpDatas[1] );
    datas.details.lesson = inputDatas.title;

    return datas;
  }

  function extractDate( inputDate ){
    var result = {};
    var tmpHours = inputDate.slice( inputDate.indexOf(' ') +1);
    var tmpDate = inputDate.slice( 0, inputDate.indexOf(' '));
    var hourBeginFull = tmpHours.slice(0, tmpHours.indexOf('-')-1);;
    var hourEndFull = tmpHours.slice(tmpHours.indexOf('-')+2);

    tmpDate = tmpDate.split('/');
    result.day = tmpDate[0];
    result.month = tmpDate[1];
    result.year = tmpDate[2];

    result.hourBegin = {};
    result.hourBegin.hour = hourBeginFull.slice( 0, hourBeginFull.indexOf('h'));
    result.hourBegin.minute = hourBeginFull.slice( hourBeginFull.indexOf('h') +1);

    result.hourEnd = {};
    result.hourEnd.hour = hourEndFull.slice( 0, hourEndFull.indexOf('h'));
    result.hourEnd.minute = hourEndFull.slice( hourEndFull.indexOf('h') +1);

    return result;
  }

  function extractDetails( inputDetails ){
    var details = {};
    var tmpDetails = "";

    tmpDetails = inputDetails.replace('<b>Ressources</b><br />', '');
    tmpDetails = tmpDetails.slice(0, tmpDetails.lastIndexOf('<br/>'));
    tmpDetails = tmpDetails.split("<br/>");

    details.group = tmpDetails[0];
    details.diverse = tmpDetails.splice(1);
    // details.classroom = ;
    // details.prof = ;
    //
    // Can't specify those informations because RSS XML 
    // is badly designed to specificaly get those informations
    //  -> classroom and prof are sometimes inversed

    return details;
  }
  /**
    End functions
  **/

});