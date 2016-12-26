const app = angular.module('convo-buddy', ['ngAnimate', 'ngCookies', 'ngTouch', 'ui.router']);

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
// SERVICES
// ========================

app.factory('api', function($cookies, $http, $state) {
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
    let params = {};
    if (data) {
      params.categories = JSON.stringify(data.categories);
    }
    return $http({
      method: 'GET',
      params,
      url
    });
  };

  return service;
});


app.factory('questions', function() {
  let service = {};

  service.
});


// ========================
// CONTROLLERS
// ========================

app.controller('CategoriesController', function(api, $cookies, $rootScope, $scope, $state) {
  api.getCategories()
    .then((results) => {
      $rootScope.categories = results.data.categories;
    })
    .catch((err) => {
      console.error('Error retreiving categories');
      console.log(err.message);
    });

  $scope.toggleSelected = function(index) {
    if (!$rootScope.categories[index].switch) {
      $rootScope.categories[index].switch = true;
    }
    else {
      $rootScope.categories[index].switch = false;
    }
  };
});


app.controller('MainController', function(api, $cookies, $rootScope, $scope, $state, $stateParams) {
  $rootScope.pageClass = 'main';
  $rootScope.witModal = false;
  $rootScope.catModal = false;
  $rootScope.questions = [];
  $rootScope.index = 0;
  $rootScope.currentQuestion = [];
  let data = null;

  console.log($rootScope.questions.length);
  if ($rootScope.questions.length === 0) {
    api.getQuestions(data)
      .then((results) => {
        results.data.questions.forEach((question) => {
          $rootScope.questions.push(question);
        });
        // shuffle($scope.questions);
        $rootScope.currentQuestion = [$scope.questions[$scope.index]];
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  }

  $scope.prevQuestion = function() {
    if ($rootScope.index > 0) {
      $rootScope.index--;
      $rootScope.currentQuestion = [$rootScope.questions[$rootScope.index]];
    }
  };
  $scope.nextQuestion = function() {
    if ($rootScope.index < $rootScope.questions.length - 1) {
      $rootScope.index++;
      $rootScope.currentQuestion = [$rootScope.questions[$rootScope.index]];
    }
  };

  $rootScope.search = function() {
    let allCategories = [];
    let selectedCategories = [];
    let data = {};
    $rootScope.categories.forEach(function(category) {
      allCategories.push(category.name);
      if (category.switch) {
        selectedCategories.push(category.name);
      }
    });
    if (selectedCategories.length) {
      data.categories = selectedCategories;
    }
    else {
      data.categories = allCategories;
    }
    $rootScope.questions = [];
    $rootScope.index = 0;
    $rootScope.currentQuestion = [];
    api.getQuestions(data)
      .then((results) => {
        results.data.questions.forEach((question) => {
          $rootScope.questions.push(question);
        });
        $rootScope.currentQuestion = [$rootScope.questions[$rootScope.index]];
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  };

  $scope.shuffle = function() {
    shuffle($rootScope.questions);
    $rootScope.index = 0;
    $rootScope.currentQuestion = [$rootScope.questions[$rootScope.index]];
  };

});


app.controller('QuestionsController', function(api, $cookies, $rootScope, $scope, $state) {
  $rootScope.pageClass = 'questions';
  $scope.content = {};

  // combine these two using bluebird
  api.getCategories()
    .then((results) => {
      results.data.categories.forEach((category) => {
        let categoryName = category.name
        $scope.content[categoryName] = [];
      });
    })
    .catch((err) => {
      console.error('Error retreiving categories');
      console.log(err.message);
    });

  api.getQuestions()
    .then((results) => {
      results.data.questions.forEach((question) => {
        question.categories.forEach((category) => {
          if ($scope.content[category.name]) {
            $scope.content[category.name].push(question.text);
          }
        });
      });
    })
    .catch((err) => {
      console.error('Error retreiving questions');
      console.log(err.message);
    });

  $scope.toggleDrawer = function(questions) {
    questions.toggle = !questions.toggle;
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
      name: 'questions',
      url: '/questions',
      templateUrl: '/templates/questions.html',
      controller: 'QuestionsController'
    })
    ;
    $urlRouterProvider.otherwise('/');
});
