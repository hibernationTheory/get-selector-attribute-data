var casper = require('casper').create();
// uncomment below for outputting the data to disk
//var fs = require('fs');
var main = require('./main.js');

main('./config.json').then(function(results) {
	var prettyResults = JSON.stringify(results, null, 2);
	console.log(prettyResults);
	// uncomment below for outputting the data to disk
	//fs.write('./output.json', prettyResults);
	casper.exit();
});
