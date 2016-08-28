var casper = require('casper').create();
// uncomment below for outputting the data to disk
//var fs = require('fs');
var main = require('./main.js');
var fs = require('fs');

main('./config.json', './config_searchSelection.json')
	.then(function(results) {
	var results = JSON.stringify(results, null, '\t');
	var outputFileName ='output.json';
	console.log(results);
	fs.write(outputFileName, results);
	casper.exit();
});
