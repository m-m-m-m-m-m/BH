var app = angular.module('ProjectsViewer',['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/projects',
        {
            templateUrl: 'parts/projects.html'
        })
        .when('/vis',
        {controller: 'VisController',
            templateUrl: 'parts/vis.html'
        })
        .when('/plans',
        {
            controller: 'PhotoController',
            templateUrl: 'parts/photo.html'
        })

        .when('/front',
        {
            controller: 'PhotoController',
            templateUrl: 'parts/photo.html'
        })

        .when('/photo',
        {
            controller: 'PhotoController',
            templateUrl: 'parts/photo.html'
        })

        .when('/info',
        {
            controller: 'InfoController',
            templateUrl: 'parts/info.html'
        })

        .otherwise({ redirectTo: '/projects' });
}]);

/*
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);*/



