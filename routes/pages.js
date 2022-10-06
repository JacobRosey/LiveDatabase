//const data = require('../app');
const authController = require('../controllers/auth');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/database', async (req, res) => {
    //Console log is happening before renderData even starts, so need to make 
    //sure that render data is complete before moving on 
    //let data = await authController.renderData();
    let data = new Promise((resolve, reject, error) => {
        if (error) {
            reject();
        }
        resolve(authController.renderData());
    }).then(() => {
        console.log("here's the data: " + data.data)
        res.render('database', { data: data.data });
    })

});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});


module.exports = router;