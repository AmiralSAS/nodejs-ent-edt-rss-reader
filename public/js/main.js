jQuery(function ($){
    'use strict';
    var socket = io.connect();
    var template = $("#templateTarget").clone();
    console.log(template);
    var feedurl = [];
    feedurl[0] = "https://sedna.univ-fcomte.fr/direct/gwtdirectplanning/rss?data=bd72d825015315fea96513244aa666636c57429c2e59eabab5b89fd64d32094debf28fac6d8ee86193a1cf11c1e118100c06f73294a028d434b37e90be3096b59ef5e799eaa34c26";
    feedurl[1] = "https://sedna.univ-fcomte.fr/direct/gwtdirectplanning/rss?data=bd72d825015315fea96513244aa666636c57429c2e59eaba8a9ded144fb48e0cebf28fac6d8ee86193a1cf11c1e118100c06f73294a028d434b37e90be3096b59ef5e799eaa34c26";
    feedurl[2] = "https://sedna.univ-fcomte.fr/direct/gwtdirectplanning/rss?data=bd72d825015315fea96513244aa66663fc952a091129c33761912fe7260cb507ebf28fac6d8ee86193a1cf11c1e118100c06f73294a028d434b37e90be3096b59ef5e799eaa34c26";


    socket.on("connectionValid", function(){
        console.log("connectionValid");
    });

    $("#buttonTest").click(function(){
        console.log("clientSendRssUrl");
        socket.emit("clientSendRssUrl", {
            feedUrl : feedurl[0]
        });
    });

    socket.on("returnFeed", function(datas){
      addContent(datas);
    });

    function addContent( datas ){
      // var content = Mustache.render(template, datas);
      var content = Mustache.render("<ul><li>Cours   : {{details.lesson}}</li><li>Groupe  : {{details.group}}</li><li>Reste   : {{datas.details.diverse}}</li><li>Date    : {{date.day}}/{{date.month}}/{{date.year}}</li><li>Heure   : {{date.hourBegin.hour}}h{{date.hourBegin.minute}} - {{date.hourEnd.hour}}h{{date.hourEnd.minute}}</li></ul>", datas);
      $("#testContent").append( content );

        // console.log("Cours   : %s", datas.details.lesson);
        // console.log("Groupe  : %s", datas.details.group);
        // console.log("Reste   : %s", datas.details.diverse);
        // console.log("Date    : %s/%s/%s", 
        //   datas.date.day,
        //   datas.date.month,
        //   datas.date.year);
        // console.log("Heure   : %sh%s - %sh%s", 
        //   datas.date.hourBegin.hour,
        //   datas.date.hourBegin.minute,
        //   datas.date.hourEnd.hour,
        //   datas.date.hourEnd.minute);
    }

});