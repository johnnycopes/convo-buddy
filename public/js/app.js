'use strict';

var app = angular.module('convo-buddy', ['ngAnimate', 'ngCookies', 'ngTouch', 'ui.router']);

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

app.factory('api', function ($cookies, $http, $state) {
  var service = {};

  service.getCategories = function () {
    var url = '/api/getCategories';
    return $http({
      method: 'GET',
      url: url
    });
  };

  service.getQuestions = function (data) {
    var url = '/api/getQuestions';
    var params = {};
    if (data) {
      params.categories = JSON.stringify(data.categories);
    }
    return $http({
      method: 'GET',
      params: params,
      url: url
    });
  };

  return service;
});

app.factory('storage', function () {
  var service = {};

  service.questions;
  service.index;

  return service;
});

// ========================
// CONTROLLERS
// ========================

app.controller('CategoriesController', function (api, $cookies, $rootScope, $scope, $state) {
  $scope.isSelected = true;

  api.getCategories().then(function (results) {
    $rootScope.categories = results.data.categories;
    $rootScope.categories.forEach(function (category) {
      category.switch = true;
    });
    // angular.copy makes deep copy of an object (useful for taking a snapshot of an object)
    $rootScope.selectedCategories = angular.copy($rootScope.categories);
  }).catch(function (err) {
    console.error('Error retreiving categories');
    console.log(err.message);
  });

  $scope.toggleSelected = function (index) {
    if (!$rootScope.categories[index].switch) {
      $rootScope.categories[index].switch = true;
      $scope.isSelected = true;
    } else {
      $rootScope.categories[index].switch = false;
      $scope.isSelected = false;
    }
  };

  $rootScope.closeCatModal = function () {
    $rootScope.categories = angular.copy($rootScope.selectedCategories);
  };

  $scope.toggleCategories = function () {
    $scope.isSelected = !$scope.isSelected;
    $rootScope.categories.forEach(function (category) {
      if (!$scope.isSelected) {
        category.switch = false;
      } else {
        category.switch = true;
      }
    });
  };
});

app.controller('MainController', function (api, $cookies, $rootScope, $scope, $state, $stateParams, storage) {
  $rootScope.pageClass = 'main';
  $rootScope.witModal = false;
  $rootScope.catModal = false;
  $scope.questions = [];
  $scope.index = storage.index || 0;
  $scope.currentQuestion = [];
  $rootScope.isShuffled = false;
  $scope.unshuffledQuestions = [];
  var data = null;

  // if there is no existing questions array in use, pull all questions from the db
  if (storage.questions) {
    storage.questions.forEach(function (question) {
      $scope.questions.push(question);
    });
    $scope.currentQuestion = [$scope.questions[$scope.index]];
  } else {
    api.getQuestions(data).then(function (results) {
      results.data.questions.forEach(function (question) {
        $scope.questions.push(question);
      });
      $scope.currentQuestion = [$scope.questions[$scope.index]];
    }).catch(function (err) {
      console.error('Error retreiving questions');
      console.log(err.errors);
    });
  }

  $scope.changeQuestion = function (direction) {
    if (direction === 'prev' && $scope.index > 0) {
      $scope.index--;
    } else if (direction === 'next' && $scope.index < $scope.questions.length - 1) {
      $scope.index++;
    }
    $scope.currentQuestion = [$scope.questions[$scope.index]];
    storage.index = $scope.index;
  };

  $rootScope.search = function () {
    $rootScope.selectedCategories = angular.copy($rootScope.categories);
    var allCategories = [];
    var selectedCategories = [];
    var data = {};
    $rootScope.isShuffled = false;
    $rootScope.categories.forEach(function (category) {
      if (category.switch) {
        selectedCategories.push(category.name);
      }
      allCategories.push(category.name);
    });
    if (!selectedCategories.length) {
      $rootScope.categories.forEach(function (category) {
        category.switch = true;
      });
      selectedCategories = allCategories;
    }
    data.categories = selectedCategories;
    $scope.questions = [];
    $scope.index = 0;
    $scope.currentQuestion = [];
    api.getQuestions(data).then(function (results) {
      results.data.questions.forEach(function (question) {
        $scope.questions.push(question);
      });
      $scope.currentQuestion = [$scope.questions[$scope.index]];
      storage.questions = $scope.questions;
    }).catch(function (err) {
      console.error('Error retreiving questions');
      console.log(err.errors);
    });
  };

  $scope.toggleShuffle = function () {
    if (!$rootScope.isShuffled) {
      $scope.unshuffledQuestions = angular.copy($scope.questions);
      shuffle($scope.questions);
      $rootScope.isShuffled = true;
    } else {
      $scope.questions = $scope.unshuffledQuestions;
      $rootScope.isShuffled = false;
    }
    $scope.index = 0;
    $scope.currentQuestion = [$scope.questions[$scope.index]];
    storage.questions = $scope.questions;
  };
});

app.controller('QuestionsController', function (api, $cookies, $rootScope, $scope, $state, $window) {
  $rootScope.pageClass = 'question';
  $scope.content = {};
  $scope.isClosed = true;

  // combine these two using bluebird
  api.getCategories().then(function (results) {
    results.data.categories.forEach(function (category) {
      var categoryName = category.name;
      $scope.content[categoryName] = [];
    });
  }).catch(function (err) {
    console.error('Error retreiving categories');
    console.log(err.message);
  });

  api.getQuestions().then(function (results) {
    results.data.questions.forEach(function (question) {
      question.categories.forEach(function (category) {
        if ($scope.content[category.name]) {
          $scope.content[category.name].push(question.text);
        }
      });
    });
  }).catch(function (err) {
    console.error('Error retreiving questions');
    console.log(err.message);
  });

  $scope.backToTop = function () {
    $window.scrollTo(0, 0);
  };

  $scope.toggleDrawer = function (questions) {
    questions.toggle = !questions.toggle;
  };

  $scope.toggleDrawers = function () {
    console.log($scope.content);
    $scope.isClosed = !$scope.isClosed;
    for (var key in $scope.content) {
      if (!$scope.isClosed) {
        $scope.content[key].toggle = true;
      } else {
        $scope.content[key].toggle = false;
      }
    }
  };
});

// ========================
// STATES
// ========================

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state({
    name: 'main',
    url: '/',
    templateUrl: '/templates/main.html',
    controller: 'MainController'
  }).state({
    name: 'questions',
    url: '/questions',
    templateUrl: '/templates/questions.html',
    controller: 'QuestionsController'
  });
  $urlRouterProvider.otherwise('/');
});
