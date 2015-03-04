jQuery(function ($){
    'use strict';
    var socket = io.connect();
    var template = $("#templateTarget").clone();
    console.log(template);
    var feedurl = [];
    // feedurl[0] = "https://sedna.univ-fcomte.fr/direct/gwtdirectplanning/rss?data=bd72d825015315feb8cbbaa6aa4760525f7efa635e9ed7a6c0b409cfe741de5fd8f366b5da3261bfa4003da0997decdfb08fc13fac6cfa4e6f336dfff824d5c8bbbba47e59a23ab74441aff2d26d81d1db7688b5014cdf6c157990d0456e1f4f";


    socket.on("connectionValid", function(){
        console.log("connectionValid");
    });

    $("#buttonTest").click(function(){
        $("#textarea_for_json_result").val( "" );
        console.log("clientSendRssUrl");

        socket.emit("clientSendRssUrl", {
            // feedUrl : feedurl[0]
            feedUrl : $("#rssUrl").val()
        });
    });

    socket.on("returnFeed", function(datas){
      addContent(datas);
      var result = JSON.stringify(datas);
      $("#textarea_for_json_result").val( $("#textarea_for_json_result").val() + result + "\n\n" );
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