/**
 * Created by מתן on 15/12/2016.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('profile', {title: 'profile'});
});

module.exports = router;


