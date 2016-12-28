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

app.factory('storage', function() {
  let service = {};

  service.questions;
  service.index;

  return service;
});


// ========================
// CONTROLLERS
// ========================

app.controller('CategoriesController', function(api, $cookies, $rootScope, $scope, $state) {
  api.getCategories()
    .then((results) => {
      $rootScope.categories = results.data.categories;
      $rootScope.categories.forEach((category) => {
        category.switch = true;
      });
      // angular.copy makes deep copy of an object (useful for taking a snapshot of an object)
      $rootScope.selectedCategories = angular.copy($rootScope.categories);
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

  $scope.toggleAll = function(state) {
    $rootScope.categories.forEach((category) => {
      if (state === 'on') {
        category.switch = true;
      }
      else if (state === 'off') {
        category.switch = false;
      }
    });
  };
});


app.controller('MainController', function(api, $cookies, $rootScope, $scope, $state, $stateParams, storage) {
  $rootScope.pageClass = 'main';
  $rootScope.witModal = false;
  $rootScope.catModal = false;
  $scope.questions = [];
  $scope.index = storage.index || 0;
  $scope.currentQuestion = [];
  let data = null;

  // if there is no existing questions array in use, pull all questions from the db
  if (storage.questions) {
    storage.questions.forEach((question) => {
      $scope.questions.push(question);
    });
    $scope.currentQuestion = [$scope.questions[$scope.index]];
  }
  else {
    api.getQuestions(data)
      .then((results) => {
        results.data.questions.forEach((question) => {
          $scope.questions.push(question);
        });
        $scope.currentQuestion = [$scope.questions[$scope.index]];
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  }


  $scope.changeQuestion = function(direction) {
    if (direction === 'prev' && $scope.index > 0) {
      $scope.index--;
    }
    else if (direction === 'next' && $scope.index < $scope.questions.length - 1) {
      $scope.index++;
    }
    $scope.currentQuestion = [$scope.questions[$scope.index]];
    storage.index = $scope.index;
  };


  $rootScope.closeCatModal = function() {
    $rootScope.categories = angular.copy($rootScope.selectedCategories);
    console.log('rootScope.selectedCategories:', $rootScope.selectedCategories);
    console.log('rootScope.categories:', $rootScope.categories);
  };


  $rootScope.search = function() {
    $rootScope.selectedCategories = angular.copy($rootScope.categories);
    let allCategories = [];
    let selectedCategories = [];
    let data = {};
    $rootScope.categories.forEach((category) => {
      if (category.switch) {
        selectedCategories.push(category.name);
      }
      allCategories.push(category.name);
    });
    if (selectedCategories.length) {
      data.categories = selectedCategories;
    }
    else {
      data.categories = allCategories;
    }
    $scope.questions = [];
    $scope.index = 0;
    $scope.currentQuestion = [];
    api.getQuestions(data)
      .then((results) => {
        results.data.questions.forEach((question) => {
          $scope.questions.push(question);
        });
        $scope.currentQuestion = [$scope.questions[$scope.index]];
        storage.questions = $scope.questions;
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  };

  $scope.shuffle = function() {
    shuffle($scope.questions);
    $scope.index = 0;
    $scope.currentQuestion = [$scope.questions[$scope.index]];
    storage.questions = $scope.questions;
  };

});


app.controller('QuestionsController', function(api, $cookies, $rootScope, $scope, $state) {
  $rootScope.pageClass = 'question';
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
