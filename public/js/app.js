const app = angular.module('convo-buddy', ['ui.router']);

// ========================
// SERVICE
// ========================

app.factory('api', function($http, $state) {
  let service = {};

  service.getQuestions = function(data) {
    let url = '/api/getQuestions';
    return $http({
      method: 'GET',
      data,
      url
    });
  };

  return service;
});


// ========================
// CONTROLLERS
// ========================

app.controller('MainController', function(api, $scope, $state) {
  $scope.questions = [];
  $scope.index = 0;

  api.getQuestions()
    .then((results) => {
      console.log('successfully returned');
      console.log(results);
      results.data.questions.forEach((question) => {
        $scope.questions.push(question);
      });
    })
    .catch((err) => {
      console.log('unsuccessful');
      console.log(err.message);
    });

  $scope.prevQuestion = function() {
    $scope.index--;
  };
  $scope.nextQuestion = function() {
    $scope.index++;
  };
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
