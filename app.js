var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var routes = require('./routes/routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/tasks', routes);

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Server is ready on port ' + app.get('port'));
});

