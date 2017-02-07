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

.factory('Notes', [function(){
    var ref = firebase.database().ref('notes');

    var func = {};

    //returns a promise
    func.getNotes = function(uid){
        return ref.child(uid).once('value');
    }

    //returns a promise
    func.getNote = function(uid, id){
        var refUser = firebase.database().ref('notes/' + uid);
        return refUser.child(id).once('value');
    }

    func.addNote = function(uid, title, consultant, location, datetime, notes){
        ref.child(uid).push({
            title: title,
            consultant: consultant,
            location: location,
            datetime: datetime,
            notes: notes
        });
    }

    return func;
}])

.factory('validater', ['moment', function(moment){
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

    func.validateSignup = function(email, password, confirmPassword, fullName, gender, dateOfBirth, nationality, maritalStatus, nhsNumber, gpName, gpSurgery){
        //validate
        var genderChoices = ["Male", "Female"];
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
          },
          fullName: {
            presence: true,
            format: {
              pattern: "[a-z]+",
              flags: "i",
              message: "can only contain alphabet letters"
            },
            length: {
              maximum: 100
            }
          },
          gender: {
            presence: true,
            inclusion: genderChoices
          },
          dateOfBirth: {
            presence: true,
            datetime: {
              dateOnly: true
            }
          },
          nationality: {
            presence: true,
            format: {
              pattern: "[a-z]+",
              flags: "i",
              message: "can only contain alphabet letters"
            }
          },
          maritalStatus: {
            presence: true,
            format: {
              pattern: "[a-z]+",
              flags: "i",
              message: "can only contain alphabet letters"
            }
          },
          nhsNumber: {
            presence: true,
            format: {
              pattern: "([0-9]{3} [0-9]{3} [0-9]{4})",
              flags: "i",
              message: "must be a valid NHS number"
            }
          },
          gpName: {
            presence: true,
            format: {
              pattern: "[a-z]+",
              flags: "i",
              message: "can only contain alphabet letters"
            },
            length: {
              maximum: 100
            }
          },
          gpSurgery: {
            presence: true,
            length: {
              maximum: 200
            }
          }
        };
        validate.extend(validate.validators.datetime, {
          // The value is guaranteed not to be null or undefined but otherwise it could be anything.
          parse: function(value, options) {
            return +moment(value, "dd-MM-yyyy");
          },
          // Input is a unix timestamp
          format: function(value, options) {
            var format = options.dateOnly ? "dd-MM-yyyy" : "hh:mm:ss dd-MM-yyyy";
            return moment(value).format(format);
          }
        });

        var validation = validate({email: email, password: password, fullName: fullName, gender: gender, dateOfBirth: dateOfBirth, nationality: nationality, maritalStatus: maritalStatus, nhsNumber: nhsNumber, gpName: gpName, gpSurgery: gpSurgery}, constraints);

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
