app.factory('MouseDownFact', function(){
	var MouseDownFact = {};
    var initialW;
    var initialH;

    MouseDownFact.selectPixels = function(e) {
        // $("#big-ghost").remove();
        $(".ghost-select").addClass("ghost-active");
        $(".ghost-select").css({
            'left': e.pageX,
            'top': e.pageY
        });

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
        $(".colors-selected").addClass("ghost-active");
        $(".colors-selected").css({
                'top': 0,
                'left': 0
            });
        return({left: left, top: top, width: width, height: height});
    };

	return MouseDownFact;

});