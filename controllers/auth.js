const mysql = require('mysql');
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

exports.register = (req, res) => {
    console.log(req.body);

    const { user, password, passwordConfirm } = req.body;

    db.query('SELECT username FROM Users WHERE username = ?', [user], async (err, result) => {
        if (err) {
            console.log(err);
        }
        if(user.length <= 6){
            return res.render('register', {
                message: 'Username must be 6 or more characters'
            });
        }
        if (result.length > 0) {
            return res.render('register', {
                message: 'That username is not available!'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Your passwords do not match!'
            });
        }
        //Hash the password 8 times using bcrypt
        let hashedPass = await bcrypt.hash(password, 8);
        console.log(hashedPass);
        db.query('INSERT INTO Users SET ?', { username: user, hash: hashedPass }, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('register', {
                    message: 'User Registered!'
                });
            }
        }
        )
    });
}

exports.renderData = () => {
    var sqlData = [];
    db.query('SELECT * FROM Users',function (error, results, fields) {
        if (error) throw error;
        else {
            for (i = 0; i < results.length; i++) {
                if (results[i].hasOwnProperty("prim_key" && "username" && "hash")) {
                    let sqlRow = {
                        key: results[i].prim_key,
                        user: results[i].username,
                        hash: results[i].hash
                    };
                    sqlData.push(sqlRow);
                }
            }
        }
    });
    console.log(sqlData)
    return sqlData;
}