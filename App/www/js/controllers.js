angular.module('app.controllers', ['ionic', 'firebase'])

.controller('menuCtrl', function ($scope, $stateParams) {


})

.controller('loginCtrl', function ($scope, $ionicPopup, $state) {

    $scope.data = {};

    $scope.signInEmail = function(){
      var email = $scope.data.email;
      var password = $scope.data.password;

        //validate
        var constraints = {
          email: {
            presence: true,
            email: true
          },
          password: {
            presence: true
          }
        };

        var validation = validate({email: email, password: password}, constraints);
        if(validation){
            if(validation.email){
              var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: validation.email
              });
              alertPopup.then();
              return;
            }else if(validation.password){
                var alertPopup = $ionicPopup.alert({
                  title: 'Error!',
                  template: validation.password
                });
                alertPopup.then();
                return;
            }
        }

      firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        // user successfully registered
        $state.go("main");
      }).catch(function(error) {
          // Handle Errors here./
          /*
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);*/

          var alertPopup = $ionicPopup.alert({
             title: 'Error!',
             template: error.message
          });
          alertPopup.then(function(res) {
            console.log('done');
          });
      });
    };
})

.controller('signupCtrl', function ($scope, $ionicPopup, $ionicSlideBoxDelegate, $state) {
    $scope.disableSwipe = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    }

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    }

    $scope.previousSlide = function() {
        $ionicSlideBoxDelegate.previous();
    }

    $scope.data = {};

    $scope.signupEmail = function(){
      var email = $scope.data.email;
      var password = $scope.data.password;

        //validate
        var constraints = {
          email: {
            presence: true,
            email: true
          },
          password: {
            presence: true,
            length: {
              minimum: 6,
              message: "must be at least 6 characters long"
            }
          }
        };

        var validation = validate({email: email, password: password}, constraints);
        if(validation){
            if(validation.email){
              var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: validation.email
              });
              alertPopup.then();
              return;
            }else if(validation.password){
                var alertPopup = $ionicPopup.alert({
                  title: 'Error!',
                  template: validation.password
                });
                alertPopup.then();
                return;
            }
        }

      firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        // user successfully registered
        $state.go("main");
      }).catch(function(error) {
          var alertPopup = $ionicPopup.alert({
             title: 'Error!',
             template: error.message
          });
          alertPopup.then(function(res) {
            console.log('done');
          });
      });

    };

})

.controller('mainCtrl', function ($scope, $stateParams) {


})

