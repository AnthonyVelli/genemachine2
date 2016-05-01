app.factory('ColorFact', function(){
	var ColorGroup = function(pixelArr){
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

    ColorGroup.prototype.place = function(pixel){
    	this.totalpixels++;
    	if (!this.pixelarr.find(function(ele){
    		return ele.placepixel(pixel);
    	})) {
    		this.pixelarr.push(new Color(pixel));
    	}
    };

    ColorGroup.prototype.report = function(){
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

    ColorGroup.prototype.setThreshold = function(threshold){
    	var minimumCount = Math.round(threshold * this.totalpixels);
    	this.significantArr = this.pixelarr.filter(function(ele){
    		return ele.count >= minimumCount;
    	});
    	this.significantCount = this.significantArr.reduce(function(origin, ele) {
    		return ele.count + origin;
    	},0);

    };

    ColorGroup.prototype.filter = function(arr){
      	return arr.filter(function(ele){
    		if (Boolean(this.significantArr.find(function(ele2){
    			return ele2.compare(ele.image.data);
    		}))) {return true; } 
    	}, this);
    };


    ColorGroup.prototype.filterBySection = function(arr, breadth){
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

