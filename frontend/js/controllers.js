app.controller('MainController', ['$scope', 'data_service', '$location', '$rootScope','$filter',
  function($scope, data_service, $location, $rootScope, $filter){

    $scope.projects = null;
    $scope.currentProjectIndex = 0;
    $scope.dataPromice = data_service.getProjects();

    $rootScope.resetVisualisation = false;

    init();


    function addNotify(notify, style){
        if($rootScope.Notification){
            $rootScope.Notification.add(notify, style);
        }
    }

      function clearNotifications(){
          if($rootScope.Notification){
              $rootScope.Notification.clear();
          }
      }


    function init(){
        $scope.dataPromice.then(function(dataResponse) {
            $scope.projects = dataResponse.data;
            $scope.currentProjectIndex = getCurrentProject($scope.projects.length);
            changeProjectUrl($scope.currentProjectIndex);
        });

        initViewOptions();
        initRootNavigation();
        initSidePanel();

    }


    function getCurrentProject(amount){
        var url_param = $location.search().pr;

        if(url_param && url_param < amount) {
            return url_param;
        }
        return 0;
    }

    function initViewOptions(){
        $scope.view = {
            name : $location.$$path.slice(1),
            options:[]
        };

        $rootScope.currentViewMethods = function(func){
            $scope.toogleSidePanel();
            $rootScope.currentViewMethods[func].apply(this);
            addNotify( {name: $rootScope.currentViewMethods[func].message, information:""});
        };
    }


    function changeProjectUrl(project){
         $location.search({pr:project});
    }

    function initRootNavigation(){

        $scope.changeProject = function(index, view){

            if($scope.currentProjectIndex != index){
                data_service.StatesStore.resetAll();
                $scope.currentProjectIndex = index;
                resetVisualisation();
            }

            $scope.changeView( view || 'plans');
        };


        $scope.changeView = function(view) {
            var path = '/'+ view;
            if ($scope.view.name != view) {
                if (view != "vis") {
                    if (data_service.visualisation.isStarted() && !data_service.visualisation.isPaused()) {
                        data_service.visualisation.pauseVis();
                    }
                }
                data_service.wheelzoom.destroyAll();
                clearNotifications();

                $scope.view.name = view;
                $scope.view.options.length = 0;
                $scope.toogleSidePanel();

                addNotify( $filter('view_notify')(view) );
            }

            $location.path(path);
            changeProjectUrl($scope.currentProjectIndex);

        };

        function resetVisualisation(){
            data_service.visualisation.resetVis();
            $rootScope.resetVisualisation = true;
        }
    }




    function initSidePanel(){
        $scope.toogleSidePanel = function(){
            if($scope.open) {
                $scope.open = false;
            }
        };

        $scope.goTo = function(url){
            console.log('url ' + url);
            window.location = url;
        };

    }

}]);



app.controller('VisController', ['$scope', 'data_service', '$rootScope', function($scope, data_service, $rootScope){

    var visState, vis, canvas, view;

    $scope.proj = null;

    init();


    function init(){
        $scope.dataPromice.then(function(dataResponse) {
            view = $scope.view.name;
            $scope.proj = dataResponse.data[$scope.currentProjectIndex];

            visState = data_service.visualisation.getVisState();
            vis = visState[0];
            canvas = visState[1];


            if(!data_service.visualisation.isStarted()) {
                vis.init();
                loadObjects();
                vis.animate();
                canvas = $("#vis_container > canvas");

            } else {
                $(canvas).appendTo('#vis_container');
                if($rootScope.resetVisualisation){
                    loadObjects();
                    $rootScope.resetVisualisation = false;
                }
                $rootScope.currentViewMethods.toogleRoof.state = !!data_service.StatesStore.get(view);
                vis.animate();
            }
        });

        initViewOptions();

    }

    function loadObjects(){
        vis.load("projects/" + $scope.proj.name+"/object/1.js", "1");
        vis.load("projects/" + $scope.proj.name+"/object/2.js", "2");
    }


    function initViewOptions(){
        $scope.view.options = [
            {title: "roof", func: "toogleRoof"},
            {title: "resetVis", func : "resetView"}
        ];

        $rootScope.currentViewMethods.resetView = function(){
            vis.resetView();
            $rootScope.currentViewMethods.resetView.message = 'VIEW: RESET'
        };

        $rootScope.currentViewMethods.toogleRoof = function(){
            vis.roof();

            if($rootScope.currentViewMethods.toogleRoof.state){
                $rootScope.currentViewMethods.toogleRoof.state = false;
                $rootScope.currentViewMethods.toogleRoof.message = 'With roof';

            } else {
                $rootScope.currentViewMethods.toogleRoof.state = true;
                $rootScope.currentViewMethods.toogleRoof.message = 'Without roof';
            }

            data_service.StatesStore.set(view, $rootScope.currentViewMethods.toogleRoof.state);
        };
    }

    $scope.$on('$destroy', function () {
       var visState = data_service.visualisation;

        if(visState.isStarted()){
            visState.setVisState(vis, canvas);
        }
    });



}]);


app.controller('PhotoController', ['$scope', '$rootScope', 'data_service', '$window',function($scope, $rootScope, data_service, $window){

    var view, currentProjectIndex, zoomElement;

    $scope.gallery = [];
    $scope.selectedImg = {};
    $scope.galleryNavigation = null;


    init();

    function init(){

        initViewOptions();

        $scope.dataPromice.then(function(dataResponse) {
            view = $scope.view.name;
            currentProjectIndex = $scope.currentProjectIndex;

            $scope.gallery = dataResponse.data[currentProjectIndex][view];

            $scope.galleryNavigation = (function(){
                var length =  $scope.gallery.length,
                    iter = 0;

                function next(){
                    $scope.selectedImg.src = (++iter < length)
                        ? $scope.gallery[iter]
                        : $scope.gallery[iter = 0];
                    $scope.selectedImg.iter = iter;
                }

                function prev(){
                    $scope.selectedImg.src = (--iter > -1 )
                        ? $scope.gallery[iter]
                        : $scope.gallery[iter = length-1];
                    $scope.selectedImg.iter = iter;
                }


                return {
                    next: function(apply){

                        if(apply){
                            $scope.$apply(function(){
                                next();
                            });
                        } else {
                            next();
                        }
                        data_service.StatesStore.set(view, iter);

                    },
                    prev: function(apply){

                        if(apply){
                            $scope.$apply(function(){
                                prev();
                            });
                        } else {
                            prev();
                        }


                        data_service.StatesStore.set(view, iter);
                    },
                    change: function(i){
                        iter = i;
                        $scope.selectedImg.src = $scope.gallery[iter];
                        $scope.selectedImg.iter = iter;
                        data_service.StatesStore.set(view, iter);
                    }
                }
            }());

            $scope.galleryNavigation.change(data_service.StatesStore.get(view));

            angular.element(window).on('keydown', keyD);
        });

        $scope.getThumbUrl = function(url){
            return url.split(view).join(view + '/thumb');
        };

    }

    function initViewOptions(){
        $scope.view.options = [
            {title: "zoom", func : "Zoom"}
        ];

        $rootScope.currentViewMethods.Zoom = function(){
            var current_img = $scope.selectedImg.src;

            if($rootScope.currentViewMethods.Zoom.state){

                removeZoomEventListeners();
                data_service.wheelzoom.destroy(current_img);
                $rootScope.currentViewMethods.Zoom.state = false;

                $rootScope.currentViewMethods.Zoom.message = "ZOOM: disabled";



            } else {
                addZoomEventListeners();

                zoomElement = angular.element(document.querySelector('#'+view+"img"))[0];
                data_service.wheelzoom.init(zoomElement);

                $rootScope.currentViewMethods.Zoom.state = true;
                $rootScope.currentViewMethods.Zoom.message = "ZOOM: enabled";
            }
        };


        function removeZoomEventListeners(){
            angular.element(window).off('orientationchange', resetZoom);
            angular.element(window).off('resize', resetZoom);
        }

        function addZoomEventListeners(){
            angular.element(window).on('resize', resetZoom);
            angular.element(window).on('orientationchange', resetZoom);
        }
    }


    function resetZoom(){
        var current_img = $scope.selectedImg.src;
        if($rootScope.currentViewMethods.Zoom.state){
            data_service.wheelzoom.reset(current_img);
        }
    }


    function keyD($event){
        var keyCode = $event.which || $event.keyCode;
        switch (keyCode){
           case 37:
                $scope.galleryNavigation.prev(true);
                break;
           case 39:
                $scope.galleryNavigation.next(true);
                break;
           default:
                return;
        }
    }

    $scope.$on('$destroy', function () {
        angular.element(window).off('orientationchange', resetZoom);
        angular.element(window).off('resize', resetZoom);
        angular.element(window).off('keydown', keyD);
    });

}]);



app.controller('InfoController', ['$scope', function($scope){
    var currentProjectIndex = $scope.currentProjectIndex;

    $scope.proj = null;
    $scope.dataPromice.then(function(dataResponse) {
        $scope.proj = dataResponse.data[currentProjectIndex];
    });
}]);


app.controller('NotificationController', ['$scope', '$rootScope', 'data_service',function($scope, $rootScope, data_service){

    $scope.notifications = [];

    $rootScope.Notification = function(){

        var MAX_COUNT = 3,
            current_count = 0,
            current_id = -1,
            show_time = 2000;


        function addNotify(_notify){

            if( !data_service.notifyStorage.allowNotify(_notify.notify_id) ) return;

            current_id = (++current_id < MAX_COUNT*3) ? current_id : 0;

            var notify = {
                body: _notify,
                id : current_id,
                notify_style: (!!_notify.information)? 'complex' : 'simple'
            };

            if(current_count == MAX_COUNT){
                $scope.notifications.shift();
               current_count--;
            }

            new Promise(function(res,rej){
                $scope.notifications.push(notify);
                    current_count++;
                    setTimeout( function(){ res(notify.id) }, getShowTime(notify));
                })
                .then(function(id){
                    var arr = $scope.notifications;
                        if(arrContainProp(arr, 'id', id)){
                            $scope.$apply(function(){
                                $scope.notifications.shift();
                                current_count--;
                            });
                        }
                    }
                );
        }

        function getShowTime(notify){
            return (notify.body.information && notify.body.information.length > 0)
                ? show_time * notify.body.information.length
                : show_time;
        }


        function arrContainProp(arr, prop, val){
            return arr.some(function(el){
                    return el[prop] == val;
            });
        }

        function removeAll(){

            if(!!$scope.notifications.length){
                current_count = 0;
                $scope.notifications.length = 0;
            }
        }


        function removeById(id, index){
           $scope.notifications.splice(index,1);
            current_count--;
        }

        return {
            add         :    addNotify,
            clear       :    removeAll,
            removeById  :    removeById
        }
    }();


}]);