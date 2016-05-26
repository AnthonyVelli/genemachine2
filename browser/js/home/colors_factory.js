app.factory('ColorFact', function(){
    

	var ColorGroup = function(imageData){
        this.imageData = imageData;
        this.pixelArrRaw = imageData.map(e => e.image.data);
    	this.totalpixels = imageData.length;
    	this.ColorArr = [];
    };

    ColorGroup.prototype.createColors = function(pixel){
        this.pixelArrRaw.forEach(rawPxl => this.place(rawPxl));
    };
    

    ColorGroup.prototype.place = function(pixel){
    	if (!this.ColorArr.find(ele => ele.placepixel(pixel))) {
    		this.ColorArr.push(new Color(pixel));
    	}
    };


    var Color = function(pixel){
    	this.refpixel = pixel;
    	this.count = 1;
    };

    Color.prototype.compare = function(pixel){
    	if (Math.abs(this.refpixel[0] - pixel[0]) > 10) {
    		return false;
    	} else if (Math.abs(this.refpixel[1] - pixel[1]) > 10) {
    		return false;
    	} else if (Math.abs(this.refpixel[2] - pixel[2]) > 10) {
    		return false;
    	} else {
    		return true;
    	}
    };

    Color.prototype.placepixel = function(pixel){
    	if (this.compare(pixel)){
    		this.count++;
    		return true;
    	} else {
    		return false;
    	}
    };

	return {
        ColorGroup: ColorGroup,
        Color: Color
    };

});

