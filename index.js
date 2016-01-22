var main = require('./main.js');

main('./casperConfig.json').then(function(x) {
	console.log(JSON.stringify(x));
});
