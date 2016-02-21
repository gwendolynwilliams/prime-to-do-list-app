var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
//var data = require('./routes/data');  //tried using this for data route

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/Gwen';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 5000);

//app.use('/data', data); //tried using this for data route - ended up leaving my data routes in this file

app.post('/tasks', function(req, res) {

    var addTask = {
        task: req.body.task
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO tasks (task, completed) VALUES ($1, $2);',
            [addTask.task, false],
            function(err, result) {
                done();
                if(err) {
                    console.log('Error inserting data: ', err);
                    res.send(false);
                } else {
                    res.send(addTask);
                }
            });
    });

});

app.get('/tasks', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM tasks ORDER BY id ASC;');

        //Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //close connection
        query.on('end', function() {
            done();
            console.log(results);
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }

    });
});

app.post('/completeTask', function(req, res) {

    var taskId = req.body.id;
    console.log(req.body.id);

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('UPDATE tasks SET completed = TRUE WHERE id = ' + taskId + ';');
        console.log(query);

        //close connection
        query.on('end', function() {
            done();
            console.log(taskId);
            return res.json(taskId);
        });

        if(err) {
            console.log(err);
        }

    });
});

app.post('/deleteTask', function(req, res) {

    var taskId = req.body.id;
    console.log(req.body.id);

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('DELETE FROM tasks WHERE id = ' + taskId + ';');
        console.log(query);

        //close connection
        query.on('end', function() {
            done();
            console.log(taskId);
            return res.json(taskId);
        });

        if(err) {
            console.log(err);
        }

    });
});

app.get('/*', function(req, res) {
    //request and response
    console.log('here is the request: ', req.params);
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.listen(app.get('port'), function() {
    console.log('Server is ready on port ' + app.get('port'));
});

