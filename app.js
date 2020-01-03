const express = require('express');
const app = express();
const con = require('./db_connection');
const Joi = require('joi');
const bodyParser = require('body-parser');
const multer = require('multer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/students', (req, res) => {

    con.query("SELECT * FROM students", (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/students/:id', (req, res) => {
    sql = "SELECT * FROM students WHERE id = ?";
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.send('The student with the given ID was not found')
        } else {
            res.send(result);
        }
    });
});

app.post('/api/students', (req, res) => {
    const {
        error
    } = validateStudent(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    var sql = 'INSERT INTO students (`name`,`rombel`,`rayon`,`sex`,`phone`) VALUES ("' + req.body.name + '","' + req.body.rombel + '","' + req.body.rayon + '","' + req.body.sex + '","' + req.body.phone + '")';
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.sendStatus(201);
    });
});


app.put('/api/students/:id', (req, res) => {
    const {
        error
    } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    con.query("SELECT * FROM students WHERE id = ?", [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.send('The student with the given ID was not found');
        } else {
            updateData(req.params.id);
        }
    });

    function updateData(id) {
        const sql = 'UPDATE students SET `name` = "' + req.body.name + '" ,`rombel` = "' + req.body.rombel + '", `rayon` = "' + req.body.rayon + '",`sex` = "' + req.body.sex + '",`phone` = "' + req.body.phone + '" WHERE id = ' + id;
        con.query(sql, (err, result) => {
            if (err) throw err;
            res.send('updated');
        });
    }
});

app.delete('/api/students/:id', (req, res) => {
    con.query("DELETE FROM students WHERE id=" + req.params.id, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send('Success deleted student');
        } else {
            res.status(400).send('The student with the given ID was not found');
        }
    });
});

function validateStudent(student) {
    const schema = {
        name: Joi.string().min(5).required(),
        rombel: Joi.string().min(5).required(),
        rayon: Joi.string().min(5).required(),
        sex: Joi.string().min(4).required(),
        phone: Joi.string().min(12).required(),
    }
    return Joi.validate(student, schema);
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${ port }..... `));