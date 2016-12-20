const app = angular.module('convo-buddy', ['ui.router']);

// ========================
// SERVICE
// ========================

app.factory('api', function($http, $state) {
  let service = {};



  return service;
});


// ========================
// STATES
// ========================

app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state({
      name: 'main',
      url: '/',
      templateUrl: '/templates/main.html',
      controller: 'MainController'
    });
    $urlRouterProvider.otherwise('/');
});
