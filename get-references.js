var request  = require('request');
var env      = require('jsdom').env;
var fs       = require('fs');
var base = 'http://plato.stanford.edu/';
var filePath = 'data/references.txt';

function saveReferencesToFile(file, references, url, callback){
  fs.appendFile(file, references, function(err) {
      if(err) {
          return console.log(err);
      }
      if(references.length > 0){
        console.log('References were saved for ' + url);
      } else {
        console.log('No references were saved for ' + url);
      }
      callback();
  });
}

function getReferences(url, callback){
  var references = '';
  console.log('Getting references for ' + url);
  request(url, function(err, resp, body)
  {
    var data = [];
  	if(!err && resp.statusCode == 200)
  	{
      env(body, function (errors, window) {

        var $ = require('jquery')(window);
        var flag = true;
        $('#bibliography li').each(function(){
            var entry = {};
            var text = $(this).text().replace(/(\r\n|\n|\r)/gm,"");
            references += text + '\n';

        });
        saveReferencesToFile(filePath, references, url, callback);
      });
  	} else{
      //console.log(err);
      saveReferencesToFile(filePath, references, url, callback);
    }
  });
}

function getEntryUrls(base){
  var entryUrls = [];
  var uniqueUrls = [];
  request(base + 'contents.html', function(err, resp, body)
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
              entryUrls.push(base + path.substring(0, path.length-1));
            }
        });

        $.each(entryUrls, function(i, el){
            if($.inArray(el, uniqueUrls) === -1) uniqueUrls.push(el);
        });

        console.log('Found ' + uniqueUrls.length + ' urls. Attempting to get references.');
        getAllReferences(uniqueUrls);
      });
  	} else{
      console.log(err);
    }
  });
  // first argument can be html string, filename, or url
}


function getAllReferences(urls){
  var currentUrl = 0;
  (function getUrlRefs(){
    if(urls[currentUrl]){
      getReferences(urls[currentUrl],function(){
          currentUrl++;
          getUrlRefs();
      });
    }
  })();

}
getEntryUrls(base);
//getReferences('http://plato.stanford.edu/entries/abduction')
