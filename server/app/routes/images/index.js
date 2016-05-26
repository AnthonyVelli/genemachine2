'use strict';
var router = require('express').Router();
var _ = require('lodash');
var Jimp = require('jimp');
const svm = require('node-svm');
module.exports = router;
var imgPath = __dirname.replace(/app.*/, 'db/images/');
var sourceIMG = [];
var pixelArr = [];


router.get('/:animal', function (req, res, next) {
	sourceIMG = [];
	pixelArr = [];
	Jimp.read(imgPath+req.params.animal+'.jpg')
	.then(function(img){
		img.scaleToFit(500,450);
		var width = img.bitmap.width;
		var height = img.bitmap.height;
		for (var x = 0; x < width; x++){
			pixelArr[x] = [];
			for (var y = 0; y < height; y++){
				var color = Jimp.intToRGBA(img.getPixelColor(x, y));
				sourceIMG.push([color.r, color.g, color.b, x, y]);
				pixelArr[x][y] = Jimp.intToRGBA(img.getPixelColor(x, y));

			}
		}
		res.send(pixelArr);
	})
	.catch(next);
});


router.post('/', function(req, res, next){

	var clf = new svm.CSVC();
	var predicted = [];
	clf.train(req.body)
	.progress(function(rate){
		console.log(rate);
	})
	.then(function(args){
		console.log(args[1]);
		sourceIMG.forEach(function(each){
			var prediction = clf.predictSync(each);
			if (prediction === 1) {
				predicted.push(each);
			}
		});
		res.send(predicted);
	})
	.catch(next);
});
