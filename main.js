var require = patchRequire(require);

var Q = require('q');

function main(configFileName, cb) {
	// import modules and install event listeners
	var casper = require('casper').create({
		"viewportSize":
			{
				"width":1200,
				"height":800
			}
	});
	var fs = require('fs');
	var utils = require('utils');
	

	casper.on('error', function(message) {
	    //this.echo('error: ' + message);
	});

	casper.on('remote.message', function(message) {
	    //this.echo('remote message caught: ' + message);
	});

	function getSelectorAttrValue(resultSelector, resultType) {
		var results = [];
		var selectorMain = resultSelector["selector"];
		var selectorChildren = resultSelector["selectorChildren"];
		var links = document.querySelectorAll(selectorMain);

		for (var index = 0; index < links.length; index++ ) {
			var currEl = links[index];
			if (selectorChildren) {
				var currSubResult = {};
				for (var subIndex=0; subIndex<selectorChildren.length; subIndex++) {
					var currSubValue;
					var currSubSelectorItem = selectorChildren[subIndex];
					var currSubSelector = currSubSelectorItem['selector'];
					var currSubLabel = currSubSelectorItem['label'];
					var currSubSelectorType = currSubSelectorItem['type'];

					var currSubEl = currEl.querySelector(currSubSelector);
					if (!currSubEl) {
						continue;
					}
					if (currSubSelectorType === 'text') {
						currSubValue = currSubEl.textContent;
					} else {
						currSubValue = currSubEl.getAttribute(currSubSelectorType);
					}
					currSubResult[currSubLabel] = currSubValue;

				}
				results.push(currSubResult);
			} else {
				var value = currEl.getAttribute(resultType);
				results.push(value);
			}
		}
		return results;	
	}

	var links = [];
	var counter = 0;
	var searchResultAmounts = 0;
	var configData = fs.read(configFileName);
	configData = JSON.parse(configData);

	var amount = configData["options"]["pages"];
	var getScreenshots = configData["options"]["getScreenshots"] || false;
	var searchQuery = configData["options"]["searchQuery"];
	var waitDuration = configData["options"]["waitDuration"];
	var searchSelection = configData["options"]["searchSelection"];
	var searchConfig = configData[searchSelection];
	var url = searchConfig["url"];
	var inputSelector = searchConfig["inputSelector"];
	var formSelector = searchConfig["formSelector"];
	var nextButton = searchConfig["nextButton"];
	var resultAmountSelector = searchConfig["resultAmountSelector"];
	var resultSelector = searchConfig["resultSelector"];
	var resultType = searchConfig["resultType"];
	var baseUrl = searchConfig["baseUrl"] || url; 

	casper.start(url, function() {
		if (searchQuery) {
			this.fill('form', {q: searchQuery}, true);
		}
	});

	if (resultAmountSelector) {
		casper.waitForSelector(resultAmountSelector, function() {
			searchResultAmounts = this.evaluate(function(resultAmountSelector) {
				var el = document.querySelector(resultAmountSelector);
				var result = el.textContent;
				return result;
			}, resultAmountSelector);
		});
	};

	casper.then(function() {
		this.repeat(amount, function() {
			this.wait(waitDuration, function() {
				//this.echo('Opening the page: ' + this.getCurrentUrl());
				var result = this.evaluate(getSelectorAttrValue, resultSelector, resultType);
				links = links.concat(result);
				/*
				if (getScreenshots) {
					this.capture(dirPrepend + 'images/screen_capture_' + counter + '.png');
				}
				*/

				if (nextButton) {
					this.click(nextButton);
					counter++;
				}

			});
		});
	});

	casper.run(function () {
		var results;
		if (searchResultAmounts) {
			results = {"baseUrl":baseUrl, "numResults":searchResultAmounts, "links":links};
		} else {
			results = {"baseUrl":baseUrl, "links":links};
		}
		var jsonResult = JSON.stringify(results, null, '\t');
		cb(results);
		this.exit();
	});
}

function promiseMain(configFileName) {
	var deferred = Q.defer();
	main(configFileName, function(y) {
		deferred.resolve(y);
	});
	return deferred.promise;
}

module.exports = promiseMain;
