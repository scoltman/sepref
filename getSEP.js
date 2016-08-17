(function () {
  'use strict';
  var request = require('request');
  var env = require('jsdom').env;
  request('http://plato.stanford.edu/contents.html', function(err, resp, body)
  {
    var data = [];
  	if(!err && resp.statusCode == 200)
  	{
      env(body, function (errors, window) {

        var $ = require('jquery')(window);
        var flag = true;
        $('#content li a').each(function(){
            var entry = {};
            var path = $(this).attr('href');
            if(path.substring(0,1) !== '#'){
              console.log('http://plato.stanford.edu/'+ path.substring(0,path.length-1));
            }
        });
      });
  	} else{
      console.log(err);
    }
  });
  // first argument can be html string, filename, or url

}());
