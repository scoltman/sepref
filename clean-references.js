var fs = require('fs')
var util = require('util')
var stream = require('stream')
var es = require('event-stream');

var lineCount = 0;
var authorCn = 0;
var currentAuthor = '';
var validLine;

var ignoreThese = [
  'Novalis, Logological Fragments',
  'Loeb edition with Englishtranslation'
];

fs.unlinkSync('data/references-clean.txt');

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

          // there seems to be some missing spaces between words, this should get some of them.
          line = line.replace(/([a-z])([A-Z])/, '$1 $2');
          line = line.replace(/([A-zÀ-ÿ]),([A-zÀ-ÿ])/i, '$1, $2');
          line = line.replace(/([A-zÀ-ÿ]):([A-zÀ-ÿ])/i, '$1: $2');
          line = line.replace(/([A-zÀ-ÿ])\.([A-zÀ-ÿ])/i, '$1. $2');
          line = line.replace(/[0-9]{2,}–[0-9]{2,}\./, '');
          line = line.replace(/, [0-9]{2,3}:/, '');
          line = line.replace('pp. ', '');
          line = line.replace(/([0-9]{4})[a-z]{1}/, '$1');
          line = line.replace('Rawls, John,', 'Rawls, J.,');
          line = line.replace('Oxford: Basil Blackwell.', 'Oxford: Blackwell.');
          line = line.replace('Lewis, David,', 'Lewis, D.,');
          line = line.replace('Nozick, Robert,', 'Nozick, R.,');
          line = line.replace('Kripke, Saul,', 'Kripke, S.,');
          line = line.replace('Stevenson, Charles,', 'Stevenson, C.,');
          line = line.replace('Steiner, Hillel,', 'Steiner, H.,');
          line = line.replace('Hawley, Katherine,', 'Hawley, K.,');
          line = line.replace('Russell, Bertrand,', 'Russell, B.,');
          line = line.replace('Burge, Tyler,', 'Burge, T.,');
          line = line.replace('Dummett, Michael,', 'Dummett, M.,');
          line = line.replace('Wright, Crispin,', 'Wright, C.,');
          line = line.replace('Raz, Joseph,', 'Raz, J.,');
          line = line.replace('Anarchy, State and Utopia,', 'Anarchy, State, and Utopia,');
          line = line.trim();
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
