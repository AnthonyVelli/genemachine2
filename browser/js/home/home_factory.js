app.factory('HomeFact', function($http){
	var HomeFact = {};
	var pixelSample;
	var canvas = [];

	HomeFact.ReSize = function(animal){
		return $http.get('/api/images/'+animal)
		.then(function(resized){
			return resized.data;
		});
	};

	HomeFact.SetCanvas = function(ctx1, ctx2){
		canvas.push(ctx1);
		canvas.push(ctx2);
	};

	HomeFact.SetPixelSample = function(ctx, left, top, width, height){
		var pixelArrDataSample = getImageColors(ctx, left, top, width, height);
		pixelSample = new ColorGroups(pixelArrDataSample);
	};
	HomeFact.GetPixelSample = function(){
		return pixelSample;
	};

	HomeFact.FilterImagebySample = function(ctx, x, y, threshold){
		var pixelImage = getImageData(ctx, x, y);
		pixelSample.setThreshold(threshold);
		return pixelSample.filter(pixelImage);
	};


	HomeFact.DrawImage = function(ctx, imageArr){
		imageArr.forEach(function(ele){
	    	ctx.putImageData(ele.image, ele.x, ele.y);
	    });
	};

	HomeFact.ConverttoImageData = function(ctx, pxlArr){
		var imageData = [];
	    pxlArr.forEach(function(x, xidx){
	    	x.forEach(function(y, yidx){
	    		var drawer = ctx.createImageData(1, 1);
	    		drawer.data[0] = pxlArr[xidx][yidx].r;
	    		drawer.data[1] = pxlArr[xidx][yidx].g;
	    		drawer.data[2] = pxlArr[xidx][yidx].b;
	    		drawer.data[3] = pxlArr[xidx][yidx].a;
	    		imageData.push({image: drawer, x: xidx, y: yidx});
	    	});
	    });
	    return imageData;
	};

    function getImageData(ctx, width, height){
       	var pixelArr = [];
	    for (var x = 0; x < width; x++){
	    	for (var y = 0; y < height; y++){
	    		pixelArr.push({x: x, y: y, image: ctx.getImageData(x, y, 1,1)});
	        }
	    }
	    return pixelArr;
    }


	function getImageColors(ctx, left, top, width, height){
		var pixelArr = [];
	    for (var x = left; x <= left + width; x++){
	    	for (var y = top; y <= top + height; y++){
	    		pixelArr.push(ctx.getImageData(x, y, 1,1).data);
	        }
	    }
	    return pixelArr;
	}

    function sectionImageData(pixelArr, width, height){
    	var pixelImageSectioned = getImageData(pixelArr, width, height);
		pixelImageSectioned = pixelImageSectioned.map(function(section){
			var stats = new ColorGroups([]);
				section.forEach(function(pxl){
					stats.place(pxl.image.data);
				});
			return {stats: stats, pixels: section};
		});
    	var widthSize = Math.ceil(width/10 );
    	var heightSize = Math.ceil(height/10);
    	var dividedPixelArr = [];
    	pixelArr.forEach(function(ele){
    		var idx = (Math.floor(ele.x / widthSize)) + (Math.floor(ele.y / heightSize)*10);
    		if (!dividedPixelArr[idx]){
    			 dividedPixelArr[idx]= [];
    		}
    		dividedPixelArr[idx].push(ele);
    	});
    	return dividedPixelArr;
    }

	var ColorGroups = function(pixelArr){
    	this.totalpixels = 0;
    	this.pixelarr = [];
    	if (pixelArr){
    		pixelArr.forEach(function(pixel){
    		this.place(pixel);
    	}, this);
    	this.significantArr = [];
    	this.significantCount = 0;
    	}
    };

    ColorGroups.prototype.place = function(pixel){
    	this.totalpixels++;
    	if (!this.pixelarr.find(function(ele){
    		return ele.checkpixel(pixel);
    	})) {
    		this.pixelarr.push(new Color(pixel));
    	}
    };

    ColorGroups.prototype.report = function(){
    	var pixelsByColor = 0;
    	// console.log('Unfiltered - '+this.totalpixels);
    	this.pixelarr.forEach(function(ele){
    		// console.log(ele.refpixel + ' Count = '+ele.count+' - '+ele.count/this.totalpixels);
    		pixelsByColor += ele.count;
    	}, this);
    	// console.log('TOTAL - '+pixelsByColor);
    	// console.log('Filtered - '+this.significantCount);
    	this.significantArr.forEach(function(ele){
    		// console.log(ele.refpixel + ' Count = '+ele.count+' - '+ ele.count/this.significantCount);
    	}, this);
    };

    ColorGroups.prototype.setThreshold = function(threshold){
    	var minimumCount = Math.round(threshold * this.totalpixels);
    	this.significantArr = this.pixelarr.filter(function(ele){
    		return ele.count >= minimumCount;
    	});
    	this.significantCount = this.significantArr.reduce(function(origin, ele) {
    		return ele.count + origin;
    	},0);

    };

    ColorGroups.prototype.filter = function(arr){
      	return arr.filter(function(ele){
    		if (Boolean(this.significantArr.find(function(ele2){
    			return ele2.compare(ele.image.data);
    		}))) {return true; } 
    	}, this);
    };


    ColorGroups.prototype.filterBySection = function(arr, breadth){
    	var threshold = parseInt(this.totalpixels * breadth);
  
    	var noOutliers = this.ColorGroups.filter(function(ele){
    		return ele.count > threshold;
    	});
    	return arr.filter(function(ele){
    		if (Boolean(this.ColorGroups.find(function(ele2){
    			return ele2.compare(ele.image.data);
    		}))) {return true; } 
    	}, this);
    };

    var Color = function(pixel){
    	this.refpixel = pixel;
    	this.count = 1;
    };

    Color.prototype.compare = function(pixel){
    	if (Math.abs(this.refpixel[0] - pixel[0]) > 13) {
    		return false;
    	} else if (Math.abs(this.refpixel[1] - pixel[1]) > 13) {
    		return false;
    	} else if (Math.abs(this.refpixel[2] - pixel[2]) > 13) {
    		return false;
    	} else {
    		return true;
    	}
    };

    Color.prototype.checkpixel = function(pixel){
    	if (this.compare(pixel)){
    		this.count++;
    		return true;
    	} else {
    		return false;
    	}
    };

	return HomeFact;

});