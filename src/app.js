'use strict';

var express = require('express'),
	nunjucksEngine = require('express-nunjucks'),
	events = require('events'),
	bodyParser = require('body-parser');


var dispatcher = new events.EventEmitter();
var app = express();

// allow using json post
app.use(bodyParser.json());

// set static assets path

app.use('/static', express.static(__dirname + '/public'));

app.set('views', __dirname + '/templates');
app.set('view engine', 'njk');

const njk = nunjucksEngine(app, {
	watch: true,
	noCache: true
});

app.get('/', function (req, res) {
	res.render('landing');
});

var colors = ['#000000', '#A52A2A', '#228B22', '#191970', '#FF6347', '#FFD700'], index = 0;
app.get('/initialize', function (req, res) {
	var color = colors[index];
	if(index >= colors.length){
		index = 0;
	}
	index ++;

	res.json({
		color: color
	});
});

app.get('/subscribe', function (req, res) {
	res.set('Content-Type', 'text/plain;charset=utf-8');
	res.set('Cache-Control', 'no-cache, must-revalidate');

	dispatcher.once('draw-line', function (line) {
		console.log(line);
		return res.end(line);
	});
});

app.post('/draw-line', function (req, res) {
	dispatcher.emit('draw-line', JSON.stringify(req.body));
	res.set('Content-Type', 'text/plain;charset=utf-8');
	res.end('ok');
});

app.listen(3000, function () {
	console.log('The fronted server is running at port 3000')
});

exports.get = function () {
	return app;
};
