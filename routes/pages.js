//const data = require('../app');
const authController = require('../controllers/auth');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/database', (req, res) => {
    let data = authController.renderData();
    res.render('database', {data: data});
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/auth/register', (req, res) => {
    let message = authController.register();
    res.render('register', { message: message})
})

router.get('/login', (req, res) => {
    res.render('login');
});


module.exports = router;