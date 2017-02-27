angular.module('app.controllers', ['ionic', 'firebase'])

.controller('menuCtrl', function ($scope, $stateParams) {


})

.controller('loginCtrl', function ($scope, $stateParams, $state) {

    $scope.goSignUp = function()
    {
        $state.go("signup");
    };

})

.controller('signupCtrl', function ($scope, $stateParams) {

    $scope.signupEmail = function(){

      var ref = firebase.database().ref();//new Firebase("https://whatstheplan-47a75.firebaseio.com");

      ref.createUser({
        email    : $scope.email,
        password : $scope.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
        }
      });

    };

})

.controller('mainCtrl', function ($scope, $stateParams) {


})

