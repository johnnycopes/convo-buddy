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

  service.sendMessage = function(message) {
    let url = '/api/sendMessage';
    return $http({
      method: 'POST',
      data: {message: message},
      url
    });
  }

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
  $scope.isSelected = true;

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

  $rootScope.closeCatModal = function() {
    $rootScope.categories = angular.copy($rootScope.selectedCategories);
  };

  $scope.toggleCategories = function() {
    $scope.isSelected = !$scope.isSelected;
    $rootScope.categories.forEach((category) => {
      if (!$scope.isSelected) {
        category.switch = false;
      }
      else {
        category.switch = true;
      }
    });
  };

  $scope.toggleSelected = function(index) {
    if (!$rootScope.categories[index].switch) {
      $rootScope.categories[index].switch = true;
      $scope.isSelected = true;
    }
    else {
      $rootScope.categories[index].switch = false;
      $scope.isSelected = false;
    }
  };
});


app.controller('MainController', function(api, $cookies, $rootScope, $scope, $state, $stateParams, storage, $window) {
  // track state of modals and where to place bg-img
  $rootScope.pageClass = 'main';
  $rootScope.witModal = false;
  $rootScope.catModal = false;
  $scope.saqModal = false;

  // questions array. current question is necessary for fadein/fadeout animation to work
  $scope.questions = [];
  $scope.index = storage.index || 0;
  $scope.currentQuestion = [];

  // track progress of message in SAQ modal
  $scope.messageSending = false;
  $scope.messageSent = false;

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

  $scope.backToTop = function() {
    $window.scrollTo(0,0);
  };

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

  $rootScope.search = function() {
    $rootScope.selectedCategories = angular.copy($rootScope.categories);
    let allCategories = [];
    let selectedCategories = [];
    let data = {};
    $rootScope.isShuffled = false;

    $rootScope.categories.forEach((category) => {
      if (category.switch) {
        selectedCategories.push(category.name);
      }
      allCategories.push(category.name);
    });
    if (!selectedCategories.length) { // select all if none are selected
      $rootScope.categories.forEach((category) => {
        category.switch = true;
      });
      selectedCategories = allCategories;
    }
    data.categories = selectedCategories;
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
        $state.go('main');
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  };

  $scope.sendMessage = function() {
    $scope.messageSending = true;
    api.sendMessage($scope.userMessage)
      .then(() => {
        $scope.messageSending = false;
        $scope.messageSent = true;
        $scope.userMessage = "";
      })
      .catch((err) => {
        console.error('Error sending message');
        console.log(err.errors);
      });
  };

  $scope.toggleShuffle = function() {
    if (!$rootScope.isShuffled) {
      storage.unshuffledQuestions = angular.copy($scope.questions);
      shuffle($scope.questions);
      $rootScope.isShuffled = true;
    }
    else {
      $scope.questions = storage.unshuffledQuestions;
      $rootScope.isShuffled = false;
    }
    $scope.index = 0;
    $scope.currentQuestion = [$scope.questions[$scope.index]];
    storage.questions = $scope.questions;
  };
});


app.controller('QuestionsController', function(api, $cookies, $rootScope, $scope, $state, $window) {
  $rootScope.pageClass = 'question';
  $scope.content = {};
  $scope.isClosed = true;

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

  $scope.backToTop = function() {
    $window.scrollTo(0,0);
  };

  $scope.toggleDrawer = function(questions) {
    questions.toggle = !questions.toggle;
  };

  $scope.toggleDrawers = function() {
    $scope.isClosed = !$scope.isClosed;
    for (let key in $scope.content) {
      if (!$scope.isClosed) {
        $scope.content[key].toggle = true;
      }
      else {
        $scope.content[key].toggle = false;
      }
    }
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
