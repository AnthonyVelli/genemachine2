app.config(function ($stateProvider) {
    $stateProvider.state('Home', {
        url: '/',
        controller: 'Home',
        templateUrl: '/js/home/home.html'
    });
});

app.controller('Home', function($scope, HomeFact, MouseDownFact){
	var ctx1;
	var ctx2;	
	HomeFact.ReSize('deer')
		.then(function(resizedImg){
			var imgDimensions = {imgX: resizedImg.length, imgY: resizedImg[0].length};
			$('#canvas1').data(imgDimensions);
			ctx1 = $('#canvas1').get(0).getContext('2d');
			ctx2 = $('#canvas2').get(0).getContext('2d');
			HomeFact.DrawImage(ctx1, HomeFact.ConverttoImageData(ctx1, resizedImg));
		})
		.catch(function(error){
			console.error('error');
			console.error(error);
		});

	
	$scope.selectPixels = function(e) {
		MouseDownFact.selectPixels(e);
		$('#canvas1').bind("mousemove", MouseDownFact.openSelector);
        $('#canvas1').bind("mouseup", filterBySelect);
		console.log($scope.$id);
	};

	var filterBySelect = function(e){
		$('#canvas1').unbind("mousemove", MouseDownFact.openSelector);
        $('#canvas1').unbind("mouseup", filterBySelect);
		var selectedRange = MouseDownFact.completeSelection(e);
      	HomeFact.SetPixelSample(ctx1, selectedRange.left, selectedRange.top, selectedRange.width, selectedRange.height);
      	var filteredImage = HomeFact.FilterImagebySample(ctx1, $('#canvas1').data().imgX, $('#canvas1').data().imgY, 0);
      	$scope.sample = HomeFact.GetPixelSample().pixelarr;
		$scope.$digest();
        HomeFact.DrawImage(ctx2, filteredImage);
    };

});


	// function rgbToHex(ctx, left, top, width, height) {
	//     var arr = rgbToHex(ctx.getImageData(left, top, width, height));
	// 	var colorArr = [];
	// 	for (var x = 0; x < arr.data.length; x+=4){
	// 		colorArr.push([arr.data[x], arr.data[x+1], arr.data[x+2]]);
	// 	}
	// 	var colorObj = {};
	// 	var mergedColorObj = {};
	// 	colorArr.forEach(function(x){
	// 		var RedString = x[0].toString();
	// 		while (RedString.length < 3) {
	// 			RedString = '0'+RedString;
	// 		}
	// 		var GreenString = x[1].toString();
	// 		while (GreenString.length < 3) {
	// 			GreenString = '0'+GreenString;
	// 		}
	// 		var BlueString = x[2].toString();
	// 		while (BlueString.length < 3) {
	// 			BlueString = '0'+BlueString;
	// 		}

	// 		if (!mergedColorObj[RedString+GreenString+BlueString]) {mergedColorObj[RedString+GreenString+BlueString] = 1 } {
	// 			mergedColorObj[RedString+GreenString+BlueString]++;
	// 		}

	// 		if (!colorObj[x[0]]) {
	// 			colorObj[x[0]] = {};
	// 			colorObj[x[0]][x[1]] = {};
	// 			colorObj[x[0]][x[1]][x[2]] = 1;
	// 		} else if (!colorObj[x[0]][x[1]]) {
	// 			colorObj[x[0]][x[1]] = {};
	// 			colorObj[x[0]][x[1]][x[2]] = 1;
	// 		} else if (!colorObj[x[0]][x[1]][x[2]]) {
	// 			colorObj[x[0]][x[1]][x[2]] = 1;
	// 		} else {
	// 			colorObj[x[0]][x[1]][x[2]]++;
	// 		}
	// 	});
	// 		console.log(mergedColorObj);

	// }





	// img1.onload = function(){
	// 	var ctx1Pixels = drawImage(ctx1, img1);
	// 	// drawPixelArray(ctx2, ctx1Pixels);
	// };
	// img2.onload = function(){
	// 	var ctx2Pixels = drawImage(ctx2, img2);
	// 	// drawPixelArray(ctx2, ctx1Pixels);
	// };
	



	// function drawImage(ctx, img){
	// 		console.log(img.width, img.height);
	// 		var aspectRatio = 500 / img.naturalWidth;
	// 		var width = 500;
	// 		var height = img.naturalHeight * aspectRatio;
	// 		// img.width = width;
	// 		// img.height = height;

			
	// 		console.log(img.width, img.height);
	// 		ctx.drawImage(img, 0,0);
	// 		// return createPixelArray(ctx);
	// }


