var express = require('express');
var router = express.Router();

function updateDashboard() {
	
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'my dashboard' });
});

module.exports = router;
