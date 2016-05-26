app.factory('MouseDownFact', function(){
	var MouseDownFact = {};
    var initialW;
    var initialH;
    var initialClient = {};
    var $ghost;
    var ghostCounter = 0;

    MouseDownFact.setGhost = function(ghost) {
        $ghost = ghost;
    };

    MouseDownFact.selectPixels = function(e) {
        if (e.shiftKey){
            $ghost.find('span').addClass("ghost-red");
        } else {
            $ghost.find('span').addClass("ghost-green");
        }
        $ghost.addClass("ghost-active");
        $ghost.css({
            'left': e.pageX,
            'top': e.pageY,
        });
        initialClient.x = e.offsetX;
        initialClient.y = e.offsetY;

        initialW = e.pageX;
        initialH = e.pageY;

    };

    MouseDownFact.openSelector = function(e) {
        var w = Math.abs(initialW - e.pageX);
        var h = Math.abs(initialH - e.pageY);
        
        $ghost.css({
            'width': w,
            'height': h
        });
        if (e.pageX <= initialW && e.pageY >= initialH) {
            $ghost.css({
                'left': e.pageX
            });
        } else if (e.pageY <= initialH && e.pageX >= initialW) {
            $ghost.css({
                'top': e.pageY
            });
        } else if (e.pageY < initialH && e.pageX < initialW) {
            $ghost.css({
                'left': e.pageX,
                "top": e.pageY
            });
        }
        

    };

    MouseDownFact.completeSelection = function(e){
        console.log('mouseup');

        var bigGhostSpot = {};

        bigGhostSpot.width = parseInt($ghost.css('width').replace('px'));
        bigGhostSpot.top = parseInt($ghost.css('top').replace('px'));
        bigGhostSpot.left = parseInt($ghost.css('left').replace('px'));
        bigGhostSpot.height = parseInt($ghost.css('height').replace('px'));
        $("body").append("<div id='big-ghost"+ghostCounter+"' class='big-ghost' x='" + bigGhostSpot.left + "' y='" + bigGhostSpot.top + "'></div>");
        var ghostGreen = $ghost.find('span').hasClass("ghost-green");
        if (ghostGreen){
            $('#big-ghost'+ghostCounter).addClass("ghost-green");
            $ghost.find('span').removeClass("ghost-green");
        } else {
            $('#big-ghost'+ghostCounter).addClass("ghost-red");
            $ghost.find('span').removeClass("ghost-red");
        }
        $ghost.removeClass("ghost-active");
        $('#big-ghost'+ghostCounter).css({
                'left': bigGhostSpot.left,
                'top': bigGhostSpot.top,
                'width': bigGhostSpot.width,
                'height': bigGhostSpot.height
            });
        $ghost.css({
            'width': 0,
            'height': 0
        });

        ghostCounter++;

        
        return {selection: getPlacement(e), positive: ghostGreen};
        
        
    };

    var getPlacement = function(e){
        var selection = {};
        if (initialClient.x >= e.offsetX){
            selection.left = e.offsetX;
            selection.width = initialClient.x - e.offsetX;
        } else {
            selection.left = initialClient.x;
            selection.width =  e.offsetX - initialClient.x;
        }
        if (initialClient.y >= e.offsetY){
            selection.top = e.offsetY;
            selection.height = initialClient.y - e.offsetY;
        } else {
            selection.top = initialClient.y;
            selection.height =  e.offsetY - initialClient.y;
        }
        return selection;
    };

	return MouseDownFact;

});