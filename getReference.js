var cheerio = require('cheerio');
var fs      = require('fs')
/*
fs.readFile('pages/a-ethics', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var $ = cheerio.load(data);
    var references = [];
    var strContent = "";
    $('h2').each(function(index, item){
        if(index>0 && $(item).text() === '7. References and Further Reading') {
            console.log('found item');
            var nextSib = $(item).next().next('.hang');
            console.log(nextSib.length);
            $(nextSib).each(function(index, item){
                $(item).find('ul').remove();
                $(item).find('li').each(function(index, item){
                    references.push($(item).html().trim().replace('&#xA0;',' ').replace('&#xA0;',' ').replace('<em>','').replace('</em>',''));
                });
            });
        }
    });
    console.log(references);
});
*/
var data={};

fs.readdir('./pages/', function(err,files){
    if (err) throw err;
    var c=0;
    files.forEach(function(file){
        c++;
        fs.readFile('./pages/'+file, 'utf-8', function(err, data){
            if (err) throw err;
            if (0===--c) {
                processFile(data);
            }
        });
    });
});

function processFile(data){
    var $ = cheerio.load(data);
    var strContent = "";
    $('h2').each(function(index, item){
        if(index>0 && $(item).text().indexOf('References and Further Reading') !== -1) {
            var nextSib = $(item).next().next('.hang');
            $(nextSib).each(function(index, item){
                $(item).find('ul').remove();
                $(item).find('li').each(function(index, item){
                    console.log($(item).html().trim().replace('&#xA0;',' ').replace('&#xA0;',' ').replace('<em>','').replace('</em>',''));
                });
            });
        }
    });
}