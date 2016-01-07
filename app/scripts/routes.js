angular.module('routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider

  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'mainController',
    controllerAs: 'main'
  })
  .otherwise({ redirectTo: '/' });
});
