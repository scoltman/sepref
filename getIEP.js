(function () {
  'use strict';
  var request = require('request');
  var async = require('async');
  var env = require('jsdom').env;
  var urlBase = 'http://www.iep.utm.edu/'
  var alphaURLs = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  var URLs = [];
  for(var i=0;i<alphaURLs.length;i++){
    URLs.push(urlBase + alphaURLs[i]);
  }
  var bodies = [];
function iterator(URL, done){
  var options = {};
  request(URL, function(err, resp, body){
    var data = [];
    if(!err && resp.statusCode == 200)
    {
      bodies.push(body);

      done(null);
    } else {
      return done(err);
    }
  });
}

async.eachSeries(URLs, iterator, function (err){
  // global callback for async.eachSeries
  if(err){
    console.log(err)
  } else {
    for(var i=0; i<bodies.length;i++){
      var body = bodies[i];
      env(body, function (errors, window) {
        var $ = require('jquery')(window);
        var flag = true;
        $('.index-list li a').each(function(){
            var entry = {};
            var path = $(this).attr('href');
            if(path.substring(0,1) !== '#'){
              console.log(path.substring(0,path.length-1));
            }
        });
      });
    }
  }
});

}());
