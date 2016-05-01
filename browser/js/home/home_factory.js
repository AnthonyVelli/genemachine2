app.factory('HomeFact', function($http, ColorFact){
	var HomeFact = {};
	var pixelSample;
	var image;
    var canvas = [];

	HomeFact.ReSize = function(animal){
		return $http.get('/api/images/'+animal)
		.then(function(resized){
			return resized.data;
		});
	};

    HomeFact.SetImage = function(ctx, x, y){
        image = getImageData(ctx, x, y);
        var grouping = new ColorFact.ColorGroup();
        image.forEach(function(ele){
            grouping.place(ele.image.data);
        });
        return grouping.pixelarr;

    };

	HomeFact.SetPixelSample = function(ctx, left, top, width, height){
        var pixelArrDataSample = getImageData(ctx, left, top, width, height);
        pixelSample = new ColorFact.ColorGroup();
        pixelArrDataSample.forEach(function(ele){
            pixelSample.place(ele.image.data);
        });
        return pixelArrDataSample;
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

    function getImageData(ctx, left, top, width, height){
       	var pixelArr = [];
	    for (var x = left; x <= left+width; x++){
	    	for (var y = top; y <= top+height; y++){
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
			var stats = new ColorFact.ColorGroup([]);
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

	

	return HomeFact;

});

