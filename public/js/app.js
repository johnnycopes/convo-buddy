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
// FACTORY
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
  $scope.questions = [];
  $scope.index = 0;
  $scope.currentQuestion = [];
  let data = null;

  api.getQuestions(data)
    .then((results) => {
      results.data.questions.forEach((question) => {
        $scope.questions.push(question);
      });
      // shuffle($scope.questions);
      $scope.currentQuestion = [$scope.questions[$scope.index]];
    })
    .catch((err) => {
      console.error('Error retreiving questions');
      console.log(err.errors);
    });

  // $scope.slideRight = false;
  // $scope.slideLeft = false;
  $scope.prevQuestion = function() {
    if ($scope.index > 0) {
      $scope.index--;
      $scope.currentQuestion = [$scope.questions[$scope.index]];
    }
  };
  $scope.nextQuestion = function() {
    if ($scope.index < $scope.questions.length - 1) {
      $scope.index++;
      $scope.currentQuestion = [$scope.questions[$scope.index]];
    }
  };

  // $scope.resetSearch = function() {
  //   $cookies.remove('customSearchData');
  //   $state.go($state.current, {}, {reload: true});
  // };

  $rootScope.search = function() {
    let selectedCategories = [];
    console.log($rootScope.categories);
    $rootScope.categories.forEach(function(category) {
      if (category.switch) {
        selectedCategories.push(category.name);
      }
    });
    let data = {
      categories: selectedCategories
    };
    $scope.questions = [];
    $scope.index = 0;
    $scope.currentQuestion = [];
    api.getQuestions(data)
      .then((results) => {
        results.data.questions.forEach((question) => {
          $scope.questions.push(question);
        });
        // shuffle($scope.questions);
        $scope.currentQuestion = [$scope.questions[$scope.index]];
      })
      .catch((err) => {
        console.error('Error retreiving questions');
        console.log(err.errors);
      });
  };

});


app.controller('QuestionsController', function(api, $cookies, $rootScope, $scope, $state) {
  $rootScope.pageClass = 'questions';
  $scope.content = {};

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
    console.log('hey');
    questions.toggle = !questions.toggle;
  };
});


// ========================
// STATES
// ========================

app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    // .state({
    //   name: 'categories',
    //   url: '/categories',
    //   templateUrl: '/templates/categories.html',
    //   controller: 'CategoriesController'
    // })
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
