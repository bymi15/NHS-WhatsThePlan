angular.module('app.services', ['firebase'])

.factory('User', [function(){
    var ref = firebase.database().ref('users');

    var func = {};

    //returns a promise
    func.getUser = function(uid){
        return ref.child(uid).once('value');
    }

    func.createUser = function(uid, fullName, gender, dateOfBirth, nationality, maritalStatus, nhsNumber, gpName, gpSurgery){
        ref.child(uid).set({
            fullName: fullName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            nationality: nationality,
            maritalStatus: maritalStatus,
            nhsNumber: nhsNumber,
            gpName: gpName,
            gpSurgery: gpSurgery
        });
    }

    return func;
}])

.factory('Appointment', [function(){
    var ref = firebase.database().ref('appointments');

    var func = {};

    //returns a promise
    func.getAppointment = function(uid){
        return ref.child(uid).once('value');
    }

    func.createAppointment = function(uid,otherUid,thisLocation,thisTime,thisDate,thisDescription,thisDoctor,markerX,markerY){
        ref.child(otherUid).set({
            aa:"12",
            uid:uid,
            location:thisLocation,
            doctor:thisDoctor,
            time:thisTime,
            date:thisDate,
            description:thisDescription,
            markerX:markerX,
             markerY:markerY
        });
    }

    return func;
}])



.factory('validater', [function(){
    var func = {};

    func.validateLogin = function(email, password){
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

        return validation;
    }

    func.validateSignup = function(email, password, confirmPassword){
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

        if(password != confirmPassword){
            validation  = {};
            validation.confirmPassword = "Passwords do not match";
        }

        return validation;
    }

    return func;
}])

//contains utility functions such as displaying alerts, loading, etc.
.factory('utils', ['$ionicLoading','$ionicPopup', function($ionicLoading,$ionicPopup){

    var func = {};

    func.showLoading = function(){
      $ionicLoading.show({
        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
        animation: 'fade-in', // The animation to use
        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
        showDelay: 0 // The delay in showing the indicator
      });
    };

    func.hideLoading = function(){
      $ionicLoading.hide();
    };


    func.showAlert = function(title, message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });
    };

    return func;

}])

.service('BlankService', [function(){

}]);
