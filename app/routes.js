angular.module('routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider

  .when('/', {
    templateUrl: 'app/views/main.html',
    controller: 'mainController',
    controllerAs: 'main'
  })
  .otherwise({ redirectTo: '/' });
});
