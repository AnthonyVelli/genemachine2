app.factory('ColorFact', function(){
	var ColorGroup = function(pixelArr){
    	this.totalpixels = 0;
    	this.pixelarr = [];
    	if (pixelArr){
    		  pixelArr.forEach(function(pixel){
    		  this.place(pixel);
    	   }, this); 
        }
        this.filteredBySection = [];

    };

    ColorGroup.prototype.place = function(pixel){
    	this.totalpixels++;
    	if (!this.pixelarr.find(function(ele){
    		return ele.placepixel(pixel);
    	})) {
    		this.pixelarr.push(new Color(pixel));
    	}
    };


    ColorGroup.prototype.filter = function(arr, imgDimensions){
        var width = Math.ceil(imgDimensions.y/10 );
        var height = Math.ceil(imgDimensions.x/10);
      	arr.forEach(function(ele){
    		if (Boolean(this.pixelarr.find(function(ele2){
    			return ele2.compare(ele.image.data);
    		}, this))) {
                this.addToSection(ele, 'approved', width, height);
            } else {
                this.addToSection(ele, 'denied', width, height);
            } 
    	}, this);
        return this.filteredBySection;
    };

    ColorGroup.prototype.returnApproved = function(){
        return this.filteredBySection.reduce(function(origin, ele){
            if (ele.approved){
                return origin.concat(ele.approved);
            } else {
                return origin;
            }
        }, []);
    };
    ColorGroup.prototype.returnDenied = function(){
        return this.filteredBySection.reduce(function(origin, ele){
            if (ele.denied){
                return origin.concat(ele.denied);
            } else {
                return origin;
            }
        }, []);
    };

    ColorGroup.prototype.addToSection = function(ele, section, width, height){
        var idx = (Math.floor(ele.x / width)) + (Math.floor(ele.y / height)*10);
        if (!this.filteredBySection[idx]){
             this.filteredBySection[idx] = {};
             this.filteredBySection[idx].total = 1;
             this.filteredBySection[idx][section] = [ele];
        } else if (!this.filteredBySection[idx][section]) {
            this.filteredBySection[idx].total++;
            this.filteredBySection[idx][section] = [ele];
        } else {
            this.filteredBySection[idx].total++;
            this.filteredBySection[idx][section].push(ele);
        }
    };
    // ColorGroup.prototype.addToApproved = function(ele, section){
    //     var idx = (Math.floor(ele.x / width)) + (Math.floor(ele.y / height)*10);
    //     if (!this.filteredBySection[idx]){
    //          this.filteredBySection[idx] = {};
    //          this.filteredBySection[idx].total = 1;
    //          this.filteredBySection[idx].approved = [ele];
    //     } else if (!this.filteredBySection[idx].approved) {
    //         this.filteredBySection[idx].total++;
    //         this.filteredBySection[idx].approved = [ele];
    //     } else {
    //         this.filteredBySection[idx].total++;
    //         this.filteredBySection[idx].approved.push(ele);
    //     }
    // };

    // ColorGroup.prototype.addToDenied = function(ele){
    //     var idx = (Math.floor(ele.x / width)) + (Math.floor(ele.y / height)*10);
    //     if (!this.filteredBySection[idx]){
    //          this.filteredBySection[idx] = {};
    //          this.filteredBySection[idx].total = 1;
    //          this.filteredBySection[idx].denied = [ele];
    //     } else if (!this.filteredBySection[idx].denied) {
    //         this.filteredBySection[idx].total++;
    //         this.filteredBySection[idx].denied = [ele];
    //     } else {
    //         this.filteredBySection[idx].total++;
    //         this.filteredBySection[idx].denied.push(ele);
    //     }
    // };

    ColorGroup.prototype.filterBySection = function(){
        this.filteredBySection.forEach(function(ele){
            if (ele.approved && ele.approved.length / ele.total < 0.05) {
                 ele.denied = ele.denied.concat(ele.approved);
                ele.approved = [];
            }
        }, this);
        this.filteredBySection.forEach(function(ele){
            if (ele.denied && ele.denied.length / ele.total < 0.60) {
                 ele.approved = ele.approved.concat(ele.denied);
                ele.denied = [];
            }
        }, this);
    };


    // ColorGroup.prototype.filterBySection = function(arr){ 
    // 	var noOutliers = this.ColorGroups.filter(function(ele){
    // 		return ele.count > threshold;
    // 	});
    // 	return arr.filter(function(ele){
    // 		if (Boolean(this.ColorGroups.find(function(ele2){
    // 			return ele2.compare(ele.image.data);
    // 		}))) {return true; } 
    // 	}, this);
    // };

    var Color = function(pixel){
    	this.refpixel = pixel;
    	this.count = 1;
    };

    Color.prototype.compare = function(pixel){
    	if (Math.abs(this.refpixel[0] - pixel[0]) > 5) {
    		return false;
    	} else if (Math.abs(this.refpixel[1] - pixel[1]) > 5) {
    		return false;
    	} else if (Math.abs(this.refpixel[2] - pixel[2]) > 5) {
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
    // ColorGroup.prototype.report = function(){
    //  var pixelsByColor = 0;
    //  // console.log('Unfiltered - '+this.totalpixels);
    //  this.pixelarr.forEach(function(ele){
    //      // console.log(ele.refpixel + ' Count = '+ele.count+' - '+ele.count/this.totalpixels);
    //      pixelsByColor += ele.count;
    //  }, this);
    //  // console.log('TOTAL - '+pixelsByColor);
    //  // console.log('Filtered - '+this.significantCount);
    //  this.significantArr.forEach(function(ele){
    //      // console.log(ele.refpixel + ' Count = '+ele.count+' - '+ ele.count/this.significantCount);
    //  }, this);
    // };
        // ColorGroup.prototype.setThreshold = function(threshold){
    //  var minimumCount = Math.round(threshold * this.totalpixels);
    //  this.significantArr = this.pixelarr.filter(function(ele){
    //      return ele.count >= minimumCount;
    //  });
    //  this.significantCount = this.significantArr.reduce(function(origin, ele) {
    //      return ele.count + origin;
    //  },0);

    // };
	return {
        ColorGroup: ColorGroup,
        Color: Color
    };

});

