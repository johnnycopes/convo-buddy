const app = angular.module('convo-buddy', ['ui.router']);

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    //swap
    var tmp = array[index];
    array[index] = array[i];
    array[i] = tmp;
  }
}

// ========================
// FACTORY
// ========================

app.factory('api', function($http, $state) {
  let service = {};

  service.getCategories = function() {
    let url = '/api/getCategories';
    return $http({
      method: 'GET',
      url
    });
  };

  service.getQuestions = function(data) {
    let url = '/api/getQuestions';
    return $http({
      method: 'GET',
      params: {
        categories: JSON.stringify(data.categories),
        search: data.search
      },
      url
    });
  };

  return service;
});


// ========================
// CONTROLLERS
// ========================

app.controller('ContentController', function(api, $scope, $state) {
  api.getCategories()
    .then((results) => {
      $scope.categories = results.data.categories;
    })
    .catch((err) => {
      console.error('Error retreiving categories');
      console.log(err.message);
    });

  $scope.toggleSelected = function(index) {
    if (!$scope.categories[index].switch) {
      $scope.categories[index].switch = true;
    }
    else {
      $scope.categories[index].switch = false;
    }
  };

  $scope.search = function() {
    let categories = [];
    $scope.categories.forEach(function(category) {
      if (category.switch) {
        categories.push(category.name);
      }
    });
    let data = {
      categories,
      search: true
    };
    api.getQuestions(data)
      .then((results) => {
        console.log(results.data);
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  };
});

app.controller('MainController', function(api, $scope, $state, $stateParams) {
  $scope.questions = [];
  $scope.index = 0;
  let data = {
    categories: []
  };
  api.getQuestions(data)
    .then((results) => {
      results.data.questions.forEach((question) => {
        $scope.questions.push(question);
      });
      shuffle($scope.questions);
    })
    .catch((err) => {
      console.error('Error retreiving questions');
      console.log(err.errors);
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
    })
    .state({
      name: 'content',
      url: '/content',
      templateUrl: '/templates/content.html',
      controller: 'ContentController'
    });
    $urlRouterProvider.otherwise('/');
});
