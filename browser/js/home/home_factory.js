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

  HomeFact.CreatePixelGroups = function(ctx, left, top, width, height) {
    var newColor = new ColorFact.ColorGroup(getImageData(ctx, left, top, width, height));
    newColor.createColors();
    return newColor;
  };


  HomeFact.DrawImage = function(ctx, imageArr){
    imageArr.forEach(function(ele){
      ctx.putImageData(ele.image, ele.x, ele.y);
    });
  };


  HomeFact.SVM = function(posImage, negImage){
    var rawerPixelSample = posImage.map(function(each){
      return[[each.x, each.y, each.image.data[0], each.image.data[1], each.image.data[2]], 1];
    });
    negImage.forEach(each => rawerPixelSample.push([[each.x, each.y, each.image.data[0], each.image.data[1], each.image.data[2]], 0]));
    console.log(rawerPixelSample.length);
    return $http.post('/api/images', rawerPixelSample)
    .then(function(learnt){
      console.log("i have returned!!!!");
      return learnt.data;
    });
  };

  HomeFact.GetPixelSample = function(){
    return pixelSample;
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
     drawer.data[0] = ele[0];
     drawer.data[1] = ele[1];
     drawer.data[2] = ele[2];
     drawer.data[3] = 255;
     ctx.putImageData(drawer, ele[3], ele[4]);
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

return HomeFact;
});


