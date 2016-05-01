'use strict';
var router = require('express').Router();
var _ = require('lodash');
var Jimp = require('jimp');
module.exports = router;

var imgPath = __dirname.replace(/app.*/, 'db/images/');


router.get('/:animal', function (req, res, next) {
	Jimp.read(imgPath+req.params.animal+'.jpg')
	.then(function(img){
		img.scaleToFit(500,500);
		var width = img.bitmap.width;
		var height = img.bitmap.height;
		var pixelArr = [];
		var colorArr = [];
	    for (var x = 0; x < width; x++){
	    	pixelArr[x] = [];
	    	colorArr[x] = [];
	    	for (var y = 0; y < height; y++){
	    		colorArr[x][y] = img.getPixelColor(x, y);
	    		pixelArr[x][y] = Jimp.intToRGBA(colorArr[x][y]);
	    		
	        }
	    }
		res.send(pixelArr);
	})
	.catch(next);
});