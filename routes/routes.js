var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/Gwen';
}

    router.post('/', function(req, res) {
        console.log('hi!');

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

    router.get('/', function(req, res) {

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

    router.post('/completeTask', function(req, res) {

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

    router.post('/deleteTask', function(req, res) {

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

module.exports = router;

