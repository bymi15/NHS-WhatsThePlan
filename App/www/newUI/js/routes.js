angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('signup2', {
    url: '/signup2',
    templateUrl: 'templates/signup2.html',
    controller: 'signup2Ctrl'
  })

  .state('signup3', {
    url: '/signup3',
    templateUrl: 'templates/signup3.html',
    controller: 'signup3Ctrl'
  })

  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl'
  })

  .state('myProfile', {
    url: '/profile',
    templateUrl: 'templates/myProfile.html',
    controller: 'myProfileCtrl'
  })

$urlRouterProvider.otherwise('')

  

});