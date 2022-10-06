//const data = require('../app');
const authController = require('../controllers/auth');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/database', (req, res) => {

    setTimeout(() => {
        let data = authController.renderData();
        console.log("here's the data: " + data)
        res.render('database', { data: data });
    }, 2000)

});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});


module.exports = router;