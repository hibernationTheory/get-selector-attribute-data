var casper = require('casper').create();
var main = require('./main.js');

main('./config.json').then(function(results) {
	console.log(JSON.stringify(results));
	casper.exit();
});
