var oboe    = require('oboe');
var fs      = require('fs');

var apiId  = '85952',
    apiKey = 'Lh2WmumszByBoz2U';

var categories = {
	url : 'http://philpapers.org/philpapers/raw/categories.json'
};

var category = {
	url    : 'http://api.philpapers.org/browse/',
	params : '?format=json&apiId='+ apiId + '&apiKey=' + apiKey
};


function fileExists(fileName, catId, exists, noexist){
	fs.open(fileName,'r',function(err,fd){
	    if (err && err.code=='ENOENT') { 
	    	noexist();
	    } else {
	    	exists();
	    }
	});
}

function getCategoryIds(callback){
	oboe(fs.createReadStream('./categories.json')).done(function(categories) {
		var categoryIds =[];
		for(var i=0,ln=categories.length;i<ln;i++){
			categoryIds.push(categories[i][1]);
		}
		callback(categoryIds);
	})
	.fail(function(e) {
		console.log(e);
	});
}

function saveCategories(){
	oboe('http://philpapers.org/philpapers/raw/categories.json').done(function(categories) {
		fs.writeFile("categories.json", JSON.stringify(categories), function(err) {
		    if(err) {
		        return console.log(err);
		    }

	    	console.log('categories.json was saved!');
		}); 
	})
	.fail(function(e) {
		console.log(e);
	});
}

function saveCategoryById(catId){
	var categoryUrl = 'http://api.philpapers.org/browse/' + catId + '?format=json&apiId='+ apiId + '&apiKey=' + apiKey;
	console.log(categoryUrl);
	oboe(categoryUrl).done(function(category) {
		fs.writeFile("categories/"+ catId, JSON.stringify(category), function(err) {
		    if(err) {
		        return console.log(err);
		    }
	    	console.log('categories/' + catId + ' was saved!');
		}); 
	})
	.fail(function(e) {
		console.log(e);
	});
}

function saveAllCategories(){
	getCategoryIds(function(catIds){
		fs.readdir('categories/', function(err, catList){
		var gotCategories = catList;
		var totalGot = 0;
		var totalToGet = 0;
		for (var i=0,ln=catIds.length; i < ln; i++){
			if(gotCategories.indexOf(catIds[i] +'') !== -1){
				totalGot++;
			} else {
				totalToGet++;
				if(totalToGet < 2){
					//saveCategoryById(catIds[i])
				}
			}

			//saveCategoryById(catIds[i]);
		}

		console.log('total cats: ' + ln);
		console.log('total got: ' + totalGot);
		console.log('total to get: '+ (ln - totalGot));
		});

	});
}

saveAllCategories();
//getCategories();
//saveCategories();

/*

oboe(categoriesURL).done(function(categories) {
			console.log(categories.length);
			var stream = fs.createWriteStream("data.txt");
			stream.once('open', function(fd) {
			for(var j=0; j < 2; j++){
				var cat = categories[j][1];
				oboe(catUrl + cat + catParams).done(function(details) {
					var papersInCat = details.content[0].content;
						for(var i=0; i< papersInCat.length;i++){
		  					stream.write(details.content[0].content[i].id + '\n');
		  				}
					});
				});
			}
			}
		 })
		.fail(function(e) {
			console.log(e);
		});

	*/