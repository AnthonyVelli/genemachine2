app.factory('MouseDownFact', function(){
	var MouseDownFact = {};
    var initialW;
    var initialH;
    var initialClient = {};
    MouseDownFact.selectPixels = function(e) {
        $("#big-ghost").remove();
        $(".ghost-select").addClass("ghost-active");
        $(".ghost-select").css({
            'left': e.pageX,
            'top': e.pageY
        });
        initialClient.x = e.offsetX;
        initialClient.y = e.offsetY;

        initialW = e.pageX;
        initialH = e.pageY;

    };

    MouseDownFact.openSelector = function(e) {
        var w = Math.abs(initialW - e.pageX);
        var h = Math.abs(initialH - e.pageY);

        $(".ghost-select").css({
            'width': w,
            'height': h
        });
        if (e.pageX <= initialW && e.pageY >= initialH) {
            $(".ghost-select").css({
                'left': e.pageX
            });
        } else if (e.pageY <= initialH && e.pageX >= initialW) {
            $(".ghost-select").css({
                'top': e.pageY
            });
        } else if (e.pageY < initialH && e.pageX < initialW) {
            $(".ghost-select").css({
                'left': e.pageX,
                "top": e.pageY
            });
        }

    };

    MouseDownFact.completeSelection = function(e){
        
        var $box = $('.ghost-select')[0];
        
        var width = $box.offsetWidth;
        var top = $box.offsetTop;
        var left = $box.offsetLeft;
        var height = $box.offsetHeight;
        $("body").append("<div id='big-ghost' class='big-ghost' x='" + left + "' y='" + top + "'></div>");
        $('.big-ghost').css({
                'width': width,
                'height':height,
                'top': top,
                'left': left
            });

        $(".ghost-select").removeClass("ghost-active");
        $(".ghost-select").css({
                'width': 0,
                'height':0,
                'top': 0,
                'left': 0
            });
        return(getPlacement(e));
    };

    var getPlacement = function(e){
        var selection = {};
        console.log(e);
        console.log(initialClient);
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
        console.log(selection);

        return selection;
    };

	return MouseDownFact;

});