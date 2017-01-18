/**
 * Created by מתן on 11/12/2016.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('registration', {title: 'registration'});
});

module.exports = router;