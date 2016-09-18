var fs = require('fs')
var util = require('util')
var stream = require('stream')
var es = require('event-stream');

var lineCount = 0;
var authorCn = 0;
var currentAuthor = '';
var validLine;

var refdata = [];

var s = fs.createReadStream('data/references-clean.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        s.pause();
        validLine = false;
        lineCount += 1;
        if(line){
          if(refdata.indexOf(line) != -1){
            // TODO need to count where the reference has been mentioned more than once
          }
          refdata.push(line);
        }
        s.resume();
    })
    .on('error', function(e){
        console.log('Error while reading file.');
        console.log(e);
    })
    .on('end', function(){
        console.log('Read entire file.')
        console.log('Number of lines: ' + lineCount)

        fs.writeFile('data/reference-stats.json', JSON.stringify(refdata), function(err) {
            if(err) {
                return console.log(err);
            }
        });
    })
);
