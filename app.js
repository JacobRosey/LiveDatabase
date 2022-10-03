const express = require('express');
const mysql = require('mysql');
const exphbs = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

//Resume download not working

dotenv.config({ path: './.env' });

const app = express();

//Static files
app.use(express.static('public'));

//Templating Engine with handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

let db;
if(process.env.JAWSDB_URL) {
    db = mysql.createConnection(process.env.JASWSDB_URL)
} else {
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "simplelogin"
    });
}

const port = process.env.PORT || 3000;
//Create Database Connection LOCALLY 
/*
const db = mysql.createConnection({
    connectionLimit: 100,
    //acquireTimeout  : 30000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
*/  
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

app.route('/login/:user/:pass')
    .get(function (req, res, err) {
        var pword;
        if (err) {
            console.log(err);
        }
        const { user, pass } = req.params;
        console.log(user, pass)
        //Promise to get matching username from mySQL then compare passwords with bcrypt
        const dbPromise = new Promise((resolve, reject) => {
            db.query("SELECT * FROM Users WHERE username = '" + user + "'", (err, result) => {
                if (err) {
                    console.log(err)
                    reject();
                }
                if (result.length == 0) {
                    console.log('This user does not exist in DB');
                    reject();
                }
                if (result.length > 0) {
                    console.log('This user exists in DB');
                    pword = result[0].hash;
                    resolve(pword);
                }
            })
        });
        dbPromise
        .then(() => {
            bcrypt.compare(pass, pword).then(function(result) {
                if (err) {
                    console.log(err);
                }
                if (result == true) {
                    console.log('Passwords are a match')
                    //res.redirect('/database');
                    res.send("Login Successful!");
                }else{
                    console.log('Passwords do not match')
                    res.send("Incorrect Password!");
                }
            })
        }).catch(()=>{
            console.error('Something went wrong');
            res.send("This username does not exist!")
        })
    });
    //})
//End Connection
//db.end();

