app.config(function ($stateProvider) {
    $stateProvider.state('Home', {
        url: '/',
        controller: 'Home',
        templateUrl: '/js/home/home.html',
        resolve: {
        	resizedImg: HomeFact => {
        		return HomeFact.ReSize('lion')
					.then(resizedImg => resizedImg)
					.catch(error => {
						console.error('error');
						console.error(error);
					});
				}
		}
	});
});


app.controller('Home', function($scope, HomeFact, ColorFact, resizedImg, MouseDownFact){
	var baseImage;
	var imgDimensions = {imgX: resizedImg.length, imgY: resizedImg[0].length};
	var $canvas1 = $('#canvas1');
	var ctx1 = $('#canvas1').get(0).getContext('2d');
	var ctx2 = $('#canvas2').get(0).getContext('2d');
	var trained = {};
	trained.positive = [];
	trained.negative = [];
	$scope.posSample = [];
	$scope.negSample = [];
	var imageData = HomeFact.ConverttoImageData(ctx1, resizedImg);
	HomeFact.DrawImage(ctx1, imageData);
	baseImage = HomeFact.CreatePixelGroups(ctx1, 0, 0, imgDimensions.imgX, imgDimensions.imgY);
	$scope.allcolors = baseImage.ColorArr;
	MouseDownFact.setGhost($(".ghost-select"));
	$('#canvas1').bind("mousedown", selectPixels);

	$scope.clear =function(){
		trained.positive = [];
		trained.negative = [];
		$scope.posSample = [];
		$scope.negSample = [];
		console.log($('.big-ghost'));
		$('.big-ghost').remove();
		ctx2.clearRect(0, 0, imgDimensions.imgX, imgDimensions.imgY);
	};

	$scope.draw =function(){
		ctx2.clearRect(0, 0, imgDimensions.imgX, imgDimensions.imgY);
      	var posImageData = trained.positive.reduce((orig, selection) => orig.concat(selection.imageData), []);
      	var negImageData = trained.negative.reduce((orig, selection) => orig.concat(selection.imageData), []);
		HomeFact.SVM(posImageData, negImageData)
		.then(function(machineSuggested){

			HomeFact.ConvertRawtoImageData(ctx2, machineSuggested);
		})
		.catch(function(err){console.error(err); });
	};
	function selectPixels (e) {
		$canvas1.unbind("mousedown", selectPixels);
		MouseDownFact.selectPixels(e);
		$canvas1.bind("mousemove", MouseDownFact.openSelector);
        $canvas1.bind("mouseup", addSelection);
	}

	function addSelection(e) {
		$canvas1.unbind("mousemove", MouseDownFact.openSelector);
        $canvas1.unbind("mouseup", addSelection);
        var selected = MouseDownFact.completeSelection(e);
        var newColorGroup = HomeFact.CreatePixelGroups(ctx1, selected.selection.left, selected.selection.top, selected.selection.width, selected.selection.height);
        console.log(newColorGroup);
        if (selected.positive) {
        	trained.positive.push(newColorGroup);
        	$scope.posSample = $scope.posSample.concat(newColorGroup.ColorArr);
        } else {
			trained.negative.push(newColorGroup);
			$scope.negSample = $scope.negSample.concat(newColorGroup.ColorArr);
        }

		$scope.$digest();
		$canvas1.bind("mousedown", selectPixels);
    }
});
