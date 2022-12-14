const mysql = require('mysql');
const bcrypt = require('bcryptjs');

//Connect to Jaws DB 
const db = mysql.createConnection(process.env.JAWSDB_URL);

exports.register = (req, res) => {
    console.log(req.body);

    const { user, password, passwordConfirm } = req.body;

    db.query('SELECT username FROM Users WHERE username = ?', [user], async (err, result) => {
        if (err) {
            console.log(err);
        }
        if (user.length <= 6) { 
            //Need to make these messages show a red banner,
            //right now it shows green banner as if the registration succeeded
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

//Export SQL Users table to handlebars template
exports.renderData = () => {
    var sqlData = [];
    const promise = new Promise((resolve, reject) => {
        db.query('SELECT * FROM users',function (error, results, fields) {
            if (error) throw error;
            else {
                if (results.length > 0) {
                    for (i = 0; i < results.length; i++) {
                        let sqlRow = {
                            key: results[i].prim_key,
                            user: results[i].username,
                            hash: results[i].hash
                        }
                        sqlData.push(sqlRow);
                    }
                    console.log(sqlData);
                    resolve(sqlData);
                }
            } reject();

        });
    })
    return promise;

}
