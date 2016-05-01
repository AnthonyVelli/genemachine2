app.directive('colorlist', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/home/colors_directive_template.html',
        scope: {
        	colors: '='
        }
    };
});