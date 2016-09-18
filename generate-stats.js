var fs = require('fs')
var util = require('util')
var stream = require('stream')
var es = require('event-stream');

var lineCount = 0;
var authorCn = 0;
var currentAuthor = '';
var validLine;

var reflist = {};
var s = fs.createReadStream('data/references-clean.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        s.pause();
        validLine = false;
        lineCount += 1;

        if(line){
          if(!reflist[line]){
              reflist[line] = {
                count : 1
              }
          } else {
            reflist[line].count++;
          }
        }
        s.resume();
    })
    .on('error', function(e){
        console.log('Error while reading file.');
        console.log(e);
    })
    .on('end', function(){
        var top100 = [];
        for (var p in reflist) {
            if (reflist.hasOwnProperty(p)) {
                top100.push({paper: p, count: reflist[p].count });
            }
        }
        top100.sort(function(a, b) {
            return parseFloat(b.count) - parseFloat(a.count);
        });
        top100 = top100.slice(0,20);

        fs.writeFile('data/reference-stats.json', JSON.stringify(top100), function(err) {
            if(err) {
                return console.log(err);
            } else {

            console.log('Save stats to file.');
          }
        });
    })
);
