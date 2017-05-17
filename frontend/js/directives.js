app.directive('logo', function(){
    return {
        restrict: 'E',
        templateUrl: 'svg_icons/logo.html',
        replace: true
    }
});

app.directive('loading', function () {
    return {
        restrict: 'E',
        templateUrl: 'parts/loading.html',
        replace: true
    }
});


app.directive('mainMenu', function(){
    return {
        restrict: 'E',
        templateUrl: 'parts/menu.html',
        replace: true
    }

});

app.directive('controlPanel', function(){
    return {
        restrict: 'E',
        templateUrl: 'parts/control_panel.html',
        replace: true
    }
});


app.directive('svgIcon', function(){
    return {
        restrict: 'E',
        templateUrl: 'svg_icons/icons.html',
        replace: true,
        scope:{
            name: '@'
        },
        link: function(scope){
            scope._name = '#' + scope.name;
        }
    }

});

app.directive('imgPreloading', function(){
    return {
        restrict: 'E',
        templateUrl: 'parts/imgPreload.html',
        replace: true,
        scope: {
            ident: '@',
            source: '@'
        },
        link: function(scope){
            var src = scope.source;

            scope.$watch('source',function(){
                src = scope.source;
                scope._src = thumbUrl(src);
                scope.st = false;

                new Promise(function (resolve, reject) {
                    var img = new Image();
                    img.onload = function () {

                     scope.img_class = (img.width > img.height)?'landscape':'portrait';
                     //setTimeout(function(){resolve(src);}, 3000);
                     resolve(src);
                    };
                    img.onerror = function () {
                        reject();
                    };
                    img.src = src;
                }).then(function(url){
                        scope.$apply(function() {
                            scope.st = true;
                            scope._src = url;
                        });
                    });
            });

            function thumbUrl(url){
                var src = url.split('/');
                src.push(src[src.length-1]);
                src[src.length-2] = 'thumb';
                return src.join('/');
            }
        }
    }

});

app.directive('scrollIf', function () {
    return function(scope, element, attrs) {
        scope.$watch(attrs.scrollIf, function(value) {
            if (value) {

                var width = window.innerWidth;
                var pos = $(element).position().left + $(element).parent().scrollLeft(),
                    offset = width/2-77.5;

                $(element).parent().animate({
                    scrollLeft : pos - offset
                }, 300);
            }
        });
    }
});

app.directive('scrollTo', function () {
    return function(scope, element, attrs) {
        scope.$watch(attrs.scrollTo, function(value) {
            if (value) {
                var width = window.innerWidth,
                    height = window.innerHeight;

                var pos = $(element).position().top + $(element).parent().parent().scrollTop(),
                    offset = (width > height && width < 900)? 34: 0;

                $(element).parent().parent().animate({
                    scrollTop : pos + offset
                }, 300);
            }
        });
    }
});


app.directive('notification' , function(){
    return {
        restrict: 'E',
        controller: 'NotificationController',
        templateUrl: 'parts/notification.html',
        replace: true
    }
});
