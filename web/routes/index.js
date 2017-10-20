'use strict'
var express = require('express');
var router = express.Router();
//import  A,{MyClass,B} from '../classes/A';



/* GET home page. */
//道具墙
router.get('/', function(req, res, next) {
  //let a = new MyClass();
  //MyClass.hello();
 
  //a.print("dddd");
  res.render('index', { title: 'Express' });
});

//葡萄酒工艺 1~5对应 5个视频
//http://localhost:3000/gy?vid=1~5
router.get('/gy', function(req, res, next) {
  res.render('gy', { mp4: req.query.vid  });
});

//葡萄藤
router.get('/ptt', function(req, res, next) {
  res.render('ptt');
});

//大航海时代
router.get('/hhsd', function(req, res, next) {
  res.render('hhsd');
});

router.get('/c', function(req, res, next) {
  res.render('console');
});


module.exports = router;
