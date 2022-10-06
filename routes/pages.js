//const data = require('../app');
const authController = require('../controllers/auth');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/database', (req, res) => {
    //Console log is happening before renderData even starts, so need to make 
    //sure that render data is complete before moving on 
    let data = await authController.renderData();
    console.log('Here is your data: '+ data);
    res.render('database', {data: data})
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});


module.exports = router;