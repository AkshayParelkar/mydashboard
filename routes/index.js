var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var numhntopstories = 10;
var requestsync = require('urllib-sync').request;

var hnapi = {
	'topstories': 'https://hacker-news.firebaseio.com/v0/topstories.json',
	'ask': 'https://hacker-news.firebaseio.com/v0/askstories',
	'base': 'https://hacker-news.firebaseio.com/v0/item/'
};

var googleapi = {
	'gmail': '',
	'drive': ''
};

items = {
	'topstories': [],
	'ask': [],
	'gmail': [],
	'drive': []
};

/*
 * items is a JSON object that for storing info on:
 * hnnews
 * hnask
 * gmail
 * drive
**/
function updateDashboard(disp, requestUrl, callback) {
	// HN API: news
	var req = https.get(hnapi.topstories, function(res) {
        var responseString = '';
    
        // Buffer the body entirely for processing as a whole
        res.on('data', function(data) {
        	//console.log(responseString);
            responseString += data;
        });

        res.on('end', function() {
            callback(responseString, disp);
        });
    });

    req.on('error', function(e) {
        //console.log('problem with request' + e.message);
    });
    req.end();
}

/* GET home page. */
router.get('/', function(req, res, next) {
	updateDashboard(res, hnapi.topstories, function(storyIds, disp) {
        var storyIdsJSON = JSON.parse(storyIds); 
        //console.log('storyIdsJSON'); 
        //console.log(storyIdsJSON);
        storyIdsJSON = storyIdsJSON.splice(0, numhntopstories);
        console.log(storyIdsJSON);
        var completed_requests = 0;
        var storyJSON = [];
        var responses = [];
        var disp = res;
        storyIdsJSON.forEach(function(storyId) {
        	url = hnapi.base + JSON.stringify(storyId) + '.json';
        	//console.log(url);
        	https.get(url, function(res) {
        		res.on('data', function(chunk) {
        			responses.push(JSON.parse(chunk.toString()));
        			//console.log(chunk.toString());
        		});

        		res.on('end', function() {
        			if (completed_requests++ == numhntopstories - 1) {
        				console.log('body:', responses.join());
        				disp.render('index', {items: responses});
        			}
        		});
        	});
        });
        /*
        for (var i = 0; i < 10; i++) {
        	storyId = storyIdsJSON[i];
        	var res = requestsync(hnapi.base + JSON.stringify(storyId) + '.json');
        	//console.log(res.data.toString());
        	storyJSON.push(JSON.parse(res.data.toString()));
        };
		console.log(storyJSON);
        disp.render('index', { items: storyJSON })
    	*/

    });
});

module.exports = router;
