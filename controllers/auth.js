const mysql = require('mysql');
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});*/
const db = mysql.createConnection(process.env.JAWSDB_URL);

//May just need to get rid of auth.js and move these to app.js
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
        console.log('right before db.query');
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

exports.renderData = async() => {
    var sqlData = [];
    await db.query('SELECT * FROM users',function (error, results, fields) {
        if (error) throw error;
        else {
            for (i = 0; i < results.length; i++) {
                let sqlRow = {
                    key: results[i].prim_key,
                    user: results[i].username,
                    hash: results[i].hash
                }
                sqlData.push(sqlRow);
                console.log('pushing sqlrow to sqldata')
                console.log(sqlRow)
            }
        }
    });
    console.log('returning sqlData');
    return sqlData;
}
