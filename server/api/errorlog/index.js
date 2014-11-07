'use strict';

var express = require('express');
var controller = require('./errorlog.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id/:value', controller.show);
router.post('/', controller.update);
//router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;