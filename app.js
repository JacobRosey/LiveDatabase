const express = require('express');
const mysql = require('mysql');
const exphbs = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

//Resume download not working

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 3000;

//Static files
app.use(express.static('public'));

//Templating Engine with handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

//Create Database Connection
const db = mysql.createConnection({
    connectionLimit: 100,
    //acquireTimeout  : 30000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const publicDirectory = path.join(__dirname, './public/');
app.use(express.static(publicDirectory));

//Parsing middleware
app.use(express.urlencoded({ extended: false }));

//Parse JSON
app.use(express.json());

db.connect((err) => {
    if (err) throw err; //Failed to connect
    console.log('Connected to ' + process.env.DB_NAME);
});

app.listen(port || 3200, () => {
    console.log(`Server started on Port ${port}`)
});

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/database', require('./routes/pages'));
app.use('/login', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/register', require('./routes/pages'));

app.route('/database')
    .put(async function (req, res) {
        let key = req.body.key;
        let name = req.body.name;
        let pass = req.body.pass;

        //Hash the password 8 times using bcrypt
        let hashedPass = await bcrypt.hash(pass, 8);

        db.query('UPDATE Users SET ? WHERE prim_key = ' + key + '', { username: name, hash: hashedPass }, (err, result) => {
            if (err) {
                console.log(err);
            }
            return res.render('database', { //This statement is not working??
                message: 'You edited ' + key
            })
        })
    })
    .delete(function (req, res) {
        let key = req.body.key;
        db.query('DELETE FROM Users WHERE prim_key = ' + key + '', (err, result) => {
            if (err) {
                console.log(err);
            }
            return res.render('database', {
                message: 'You deleted ' + key
            })
        })
    })


//I don't know why this doesn't work
app.route('/login')
    .get(async function (req, res) {
        console.log('hello')
        if(err){
            console.log(err);
        }
        const {user, pass} = req.query;
        /*let user = req.params.user;
        let pass = req.params.pass;
        console.log(user, pass)*/

        db.query('SELECT FROM Users WHERE Username = ' + user + '', (err, result) => {
            if (err) {
                console.log(err)
            }
            console.log(result)
        })

        await bcrypt.compare(pass, hash, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result == true) {
                console.log('passwords are a match')
                res.redirect('/database');
            }
        })
    });
        /*
db.query('SELECT FROM Users WHERE Username = '+user+'', (err, result) => {
    if(err){
        console.log(err);
    }
    if(user.length < 6){
        return res.render('login', {
            message: 'Username must be at least 6 characters'
        });
    }
    if(results < 0){
        return res.render('login', {
            message: 'There is no such username in the database!'
        });
    }
    db.query('SELECT FROM Users WHERE ')
    return res.render('login', {
        message: 'You have successfully logged in!'
    })
})*/
    //})
//End Connection
//db.end();

