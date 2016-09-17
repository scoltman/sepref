var fs = require('fs')
var util = require('util')
var stream = require('stream')
var es = require('event-stream');

var lineCount = 0;
var authorCn = 0;
var currentAuthor = '';
var validLine;
var s = fs.createReadStream('data/references-raw.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        s.pause();
        validLine = false;
        lineCount += 1;

        // only process if it isn't a deliberately ignored line
        if (!ignoreThese.some(function(v) { return line.indexOf(v) >= 0; })) {

          // if line has '–––' replace with the previously mentioned author
          // TODO fix bug for spaced dashes '– – –'
          if(line.match(/[\–\-]{3,},?/i)) {
            // TODO fix null bug with currentAuthor sometimes not being set
            if(currentAuthor) {
              line = line.replace(/[\–\-]{3,},?/i,currentAuthor);
              validLine = true;
            }
          } else {
            currentAuthor = line.match(/([A-zÀ-ÿ,.'’ ]+)\(?[0-9]{4}/i);
            if(currentAuthor) {
              currentAuthor = currentAuthor[1].trim();
              validLine = true;
            }

          }

          fs.appendFile('data/references-clean.txt', line+'\n', function(err) {
              if(err) {
                  return console.log(err);
              }
          });
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
    })
);



var ignoreThese = [
  'Novalis, Logological Fragments'

]
