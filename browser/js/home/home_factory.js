app.factory('HomeFact', function($http, ColorFact){
	var HomeFact = {};
	var pixelSample;
  var rawPixelSample;
	var pixelEntire;
    var imgDimensions = {};

	HomeFact.ReSize = function(animal){
		return $http.get('/api/images/'+animal)
		.then(function(resized){
			return resized.data;
		});
	};

    HomeFact.SetImage = function(ctx, x, y){
        imgDimensions.x = x;
        imgDimensions.y = y;
        pixelEntire = getImageData(ctx, 0, 0, x, y);
        var grouping = new ColorFact.ColorGroup();
        pixelEntire.forEach(function(ele){
            grouping.place(ele.image.data);
        });
        return grouping.pixelarr;
    };

	HomeFact.SetPixelSample = function(ctx, left, top, width, height){
        rawPixelSample = getImageData(ctx, left, top, width, height);
        pixelSample = new ColorFact.ColorGroup();
        rawPixelSample.forEach(function(ele){
            pixelSample.place(ele.image.data);
        });
        return rawPixelSample;
	};
	HomeFact.GetPixelSample = function(){
		return pixelSample;
	};
  HomeFact.SVM = function(){
    var rawerPixelSample = rawPixelSample.map(function(each){
      return[[each.image.data[0], each.image.data[1], each.image.data[2]], 1];
    });
    return $http.post('/api/images', rawerPixelSample)
      .then(function(learnt){
        console.log("i have returned!!!!");
        return learnt.data;
      });
  };

    HomeFact.FilterImagebyPrediction = function(predicted){
        return pixelEntire.filter(function(ele){
          predicted.find(function(predictedEle){
            return predictedEle[0][0] == ele.image.data[0] && predictedEle[0][1] == ele.image.data[1] && predictedEle[0][2] == ele.image.data[2];
        });
        });
    };

    HomeFact.FilterImagebySample = function(){
        var sections = pixelSample.filter(pixelEntire, imgDimensions);
        var approved = pixelSample.returnApproved();
        // var hunted = pixelSample.beginHunt(pixelEntire, imgDimensions);
        // pixelSample.filterBySection();
        var approvedPostFilter = pixelSample.returnApproved();
        return [approved, approvedPostFilter];
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

    HomeFact.ConvertRawtoImageData = function(ctx, pxlArr){
     var drawer = ctx.createImageData(1, 1);
        pxlArr.forEach(function(ele){
             drawer.data[0] = ele[0][0];
             drawer.data[1] = ele[0][1];
             drawer.data[2] = ele[0][2];
             drawer.data[3] = 255;
             ctx.putImageData(drawer, ele[1], ele[2]);
        });
    };

    function getImageData(ctx, left, top, width, height){
       	var pixelArr = [];
	    for (var x = left; x < left+width; x++){
	    	for (var y = top; y < top+height; y++){
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

  //   function sectionImageData(pixelArr){
  //   	var pixelImageSectioned = getImageData(pixelArr, width, height);
		// pixelImageSectioned = pixelImageSectioned.map(function(section){
		// 	var stats = new ColorFact.ColorGroup([]);
		// 		section.forEach(function(pxl){
		// 			stats.place(pxl.image.data);
		// 		});
		// 	return {stats: stats, pixels: section};
		// });
  //   	var widthSize = Math.ceil(imgDimensions.y/10 );
  //   	var heightSize = Math.ceil(imgDimensions.x/10);
  //   	var dividedPixelArr = [];
  //   	pixelArr.forEach(function(ele){
  //   		var idx = (Math.floor(ele.x / widthSize)) + (Math.floor(ele.y / heightSize)*10);
  //   		if (!dividedPixelArr[idx]){
  //   			 dividedPixelArr[idx]= [];
  //   		}
  //   		dividedPixelArr[idx].push(ele);
  //   	});
  //   	return dividedPixelArr;
  //   }

	

	return HomeFact;

});


