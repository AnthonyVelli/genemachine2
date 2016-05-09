app.factory('VisionFact', function(){
    var Vision = function(current, world){
        this.startingPoint = current;
        this.currentCoordinate = current;
        this.lastMove = null;
        this.findings = [];
        this.foundObject = false;
        this.View = null;
        this.Situation = null;
        this.traveled = [];
        this.World = world;
        this.circumnavigation = false;
        this.travels = {n: false, s: false, e: false, w: false};
        this.redirects = 0;
    };


    Vision.prototype.LookAround = function(){
        var theView = {MoveNorth: {lookgood: 0, lookbad: 0}, MoveSouth: {lookgood: 0, lookbad: 0}, MoveEast: {lookgood: 0, lookbad: 0}, MoveWest: {lookgood: 0, lookbad: 0}};
        var theSituation = {bad: 0, good: 0};
        var horizontal = 0;
        var lookingWE = 'MoveWest';
        for (var x = this.currentCoordinate.x - 40; x <= this.currentCoordinate.x+40; x++){
        var lookingNS = 'MoveNorth';
        var vertical = 0;
            if (horizontal === 40){
                lookingWE = 'MoveEast';
            } else {
                horizontal++;
            }
            for (var y = this.currentCoordinate.y - 40; y < this.currentCoordinate.y+40; y++){
                if (vertical === 40){
                    lookingNS = 'MoveSouth';
                } else {
                    vertical++;
                }
                if ((x !== 0 || y !== 0) && this.World[x] && this.World[x][y]){
                    if (this.World[x][y].result) {
                        theSituation.good++;
                        theView[lookingWE].lookgood++;
                        theView[lookingNS].lookgood++;
                    } else {
                        theSituation.bad++;
                        theView[lookingWE].lookbad++;
                        theView[lookingNS].lookbad++;
                    }
                }
            }
        }
        theSituation.goodPercent = theSituation.good / (theSituation.good+theSituation.bad); 
        theSituation.badPercent = theSituation.bad / (theSituation.good+theSituation.bad); 
        this.Situation = theSituation;
        this.View = theView;
    };

    Vision.prototype.MoveSouth = function(moveSize){
        if (Boolean(this.traveled.find(function(ele){
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            coords.y+=moveSize;
            return ele.y === coords.y && ele.x === coords.x;
        }, this))) {
            this.redirects++;
            if (this.redirects > 3){
                this.redirects=0;
                this.MoveDefault(5);
            } else {
                this.MoveEast(moveSize);
            }
        } else {
            this.currentCoordinate.y+=moveSize;
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            this.traveled.push(coords);
            if (this.currentCoordinate.y > Math.round(this.World[0].length *0.5)){
                this.travels.s = true;
            }
        }
    };
    Vision.prototype.MoveNorth = function(moveSize){
        if (Boolean(this.traveled.find(function(ele){
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            coords.y-=moveSize;
            return ele.y === coords.y && ele.x === coords.x;
        }, this))) {
            this.redirects++;
            if (this.redirects > 3){
                this.redirects=0;
                this.MoveDefault(5);
            } else {
                this.MoveWest(moveSize);
            }
        } else {
            this.currentCoordinate.y-=moveSize;
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            this.traveled.push(coords);
            if (this.travels.s && this.travels.e && this.travels.w && this.currentCoordinate.y < Math.round(this.World[0].length *0.5)){
                this.travels.n = true;
            }
        }
    };

    Vision.prototype.MoveWest = function(moveSize){
        if (Boolean(this.traveled.find(function(ele){
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            coords.x -= moveSize;
            return ele.y === coords.y && ele.x === coords.x;
        }, this))) {
            this.redirects++;
            if (this.redirects > 3){
                this.redirects = 0;
                this.MoveDefault(5);
            } else {
                this.MoveSouth(moveSize);
            }
        } else {
            this.currentCoordinate.x-= moveSize;
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            this.traveled.push(coords);
            if (this.currentCoordinate.x < Math.round(this.World.length *0.5)){
                this.travels.w = true;
            }
        }
    };
    Vision.prototype.MoveEast = function(moveSize){
        if (Boolean(this.traveled.find(function(ele){
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            coords.x += moveSize;
            return ele.y === coords.y && ele.x === coords.x;
        }, this))) {
            this.redirects++;
            if (this.redirects > 3){
                this.redirects = 0;
                this.MoveDefault(5);
            } else {
                this.MoveNorth(moveSize);
            }
        } else {
            this.currentCoordinate.x += moveSize;
            var coords = {};
            coords.y = this.currentCoordinate.y;
            coords.x = this.currentCoordinate.x;
            this.traveled.push(coords);
            if (this.currentCoordinate.x > Math.round(this.World.length *0.5)){
                this.travels.e = true;
            }
        }
        // console.log('moving East');
    };
    Vision.prototype.MoveDefault = function(x){
        if (this.findings.length === 0){
            this.MoveSouth(x);
        } else {
            if (this.currentCoordinate.y < Math.round(this.World[0].length * 0.5)) {
                if (this.currentCoordinate.x < Math.round(this.World.length * 0.3)) {
                    this.MoveSouth(x);
                } else {
                    this.MoveWest(x);
                }
            } else {
                if (this.currentCoordinate.x > Math.round(this.World.length * 0.3)) {
                    this.MoveNorth(x);
                } else {
                    this.MoveEast(x);
                }
            }
        }
    };

    // Vision.prototype.Meander = function(){
    //     var closestDist = this.World.length;
    //     var closest;
    //     var northWall = this.currentCoordinate.y;
    //     var southWall = this.World[0].length - this.currentCoordinate.y;
    //     var eastWall = this.currentCoordinate.x;
    //     var westWall = this.World.length - this.currentCoordinate.x;
    //     // move: this.MoveWest}, east: {dist:  move: this.MoveNorth}, west: {dist: , move: this.MoveSouth}};
    //     if (northWall <= southWall)
    //     for (var x in this.wallDist){
    //         if (this.wallDist[x].dist < closestDist){
    //             closestDist = this.wallDist[x].dist;
    //             closest = this.wallDist[x];
    //         }
    //     }
    //     closest.move();

    // };

    Vision.prototype.ThinkAboutIt = function(world){
        var bestLooking = null;
        var bestLookingCount = 0;
        var worstLooking = null;
        var worstLookingCount = 0;
        var avgLooking = null;
        var avgLookingCount = 100;
        for (var x in this.View){
            if (this.View[x].lookgood > bestLookingCount) {
                bestLooking = x;
                bestLookingCount = this.View[x].lookgood;
            }
            if (this.View[x].lookbad > worstLookingCount) {
                worstLooking = x;
                worstLookingCount = this.View[x].lookbad;
            }
            if (Math.abs(this.View[x].lookgood - this.View[x].lookbad) < avgLookingCount){
                avgLooking = x;
                avgLookingCount = Math.abs(this.View[x].lookgood - this.View[x].lookbad);
            }
        }
        console.log(avgLooking);
        if (this.Situation.goodPercent > 0.80 && worstLooking) {
            console.log('moving toward bad');
            this[worstLooking](1);
        } else if (this.Situation.badPercent > 0.80 && bestLooking) {
            console.log('moving toward good');
            this[bestLooking](1);
        } else if (this.Situation.goodPercent > 0.30 && this.Situation.badPercent > 0.3 && avgLooking) {
            console.log('bullseye - moving default');
            this.findings.push(this.World[this.currentCoordinate.x][this.currentCoordinate.y]);
            this.MoveDefault(1);
        } else {
            console.log('moving default');
            this[avgLooking](1);
        }
        if (this.travels.e && this.travels.w && this.travels.s && this.travels.n && this.currentCoordinate.x === this.startingPoint.x){
            this.circumnavigation = true;
        }
    };

	
	return {
        Vision: Vision
    };

});

