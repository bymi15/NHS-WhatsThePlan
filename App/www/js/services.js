angular.module('app.services', ['firebase'])

.service('sharedProperties', function () {
        var MarkerY = 27.72;
        var MarkerX = 85.36;
        var location = "Something";
        return {
            getLocation: function () {
                return location;
            },
            setLocation: function(value) {
                location = value;
            },
            getMarkerX: function () {
                return MarkerX;
            },
            setMarkerX: function(value) {
                MarkerX = value;
            },
            getMarkerY: function () {
                return MarkerY;
            },
            setMarkerY: function(value) {
                MarkerY = value;
            }


        };
    })






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

    func.updateUser = function(uid, gender, dateOfBirth, nationality, maritalStatus, gpName, gpSurgery){
        ref.child(uid).update({
            gender: gender,
            dateOfBirth: dateOfBirth,
            nationality: nationality,
            maritalStatus: maritalStatus,
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

    func.updateNote = function(uid, id, title, consultant, location, datetime, notes){
        var refUser = firebase.database().ref('notes/' + uid);
        refUser.child(id).update({
            title: title,
            consultant: consultant,
            location: location,
            datetime: datetime,
            notes: notes
        });
    }

    func.removeNote = function(uid, id){
        var refUser = firebase.database().ref('notes/' + uid);
        refUser.child(id).remove();
    }


    return func;
}])

.factory('Appointment', [function(){
    var ref = firebase.database().ref('appointments');

    var func = {};

    //returns a promise
    func.getAppointments = function(uid){
        return ref.child(uid).once('value');
    }

    func.createAppointment = function(uid,thisLocation,thisTime,thisDate,thisDescription,thisDoctor,markerX,markerY){
        ref.child(uid).push({
            location:thisLocation,
            doctor:thisDoctor,
            time:thisTime,
            date:thisDate,
            description:thisDescription,
            markerX:markerX,
            markerY:markerY
        });
    }

    func.removeAppointment = function(uid, id){
        var refUser = firebase.database().ref('appointments/' + uid);
        refUser.child(id).remove();
    }

    return func;
}])

.factory('Careplan', [function(){
    var ref = firebase.database().ref('careplan');

    var func = {};

    //returns a promise
    func.getCareplan = function(uid){
        return ref.child(uid).once('value');
    }

    func.addCareplan = function(uid, title, consultant, location, datetime, notes){
        ref.child(uid).push({
            title: title,
            consultant: consultant,
            location: location,
            datetime: datetime,
            notes: notes
        });
    }

    func.updateCareplan = function(uid, id, title, consultant, location, datetime, notes){
        var refUser = firebase.database().ref('notes/' + uid);
        refUser.child(id).update({
            title: title,
            consultant: consultant,
            location: location,
            datetime: datetime,
            notes: notes
        });
    }

    func.removeCareplan = function(uid, id){
        var refUser = firebase.database().ref('notes/' + uid);
        refUser.child(id).remove();
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
              pattern: "[a-z ]+",
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

//contains REST HTTP request functions for accessing the EHRScape REST API
.factory('Ehrscape', [function($http){

    var func = {};

    var baseUrl = 'https://test.operon.systems/rest/v1';

    var username = "oprn_hcbox";
    var password = "XioTAJoO479";

    //var authorization = "Basic " + btoa(username + ":" + password);

    var sessionId;

    var headers = {
      headers: {
        "Ehr-Session": sessionId
      }
    };

    //helper functions
    var requestPost = function(endpoint, data) {
      return $http.post(baseUrl + endpoint, data, headers);
    }

    var requestGet = function(endpoint) {
      return $http.get(baseUrl + endpoint, headers);
    }

    var requestDelete = function(endpoint) {
      return $http.delete(baseUrl + endpoint, headers);
    }

    var requestPut = function(endpoint, data) {
      return $http.put(baseUrl + endpoint, data, headers);
    }

    var saveComposition = function(ehrId, templateId, compositionData) {
      var queryParams = {
        "ehrId": ehrId,
        templateId: templateId,
        format: 'FLAT',
        committer: 'zcabbhm'
      };

      return requestPost("/composition", compositionData);
    }

    //service functions
    func.startSession = function() {
      return $http.post(baseUrl + "/session", {username: username, password: password}).then(function(res){
        sessionId = res.data.sessionId;
      });
    }

    func.closeSession = function() {
      return $http.delete(baseUrl + "/session", headers);
    }

    func.createPatient = function(firstNames, lastNames, gender, dateOfBirth) {
      requestPost("/ehr", {}).then(function(res){
        var ehrId =  res.data.ehrId;
      });

      //build the party data
      var partyData = {
        firstNames: firstNames,
        lastNames: lastNames,
        gender: gender,
        dateOfBirth: dateOfBirth,
        partyAdditionalInfo: [
        {
          key: "ehrId",
          value: ehrId
        }
        ]
      };

      requestPost("/demographics/party", partyData).then(function(res){
        if(res.data.party.action == 'CREATE') {
          return res.data.party.meta.href;
        }else{
          return false;
        }
      });
    }

    func.addBodyWeight = function(ehrId, weight) {
      var compositionData = {
          "ctx/time": "2014-3-19T13:10Z",
          "ctx/language": "en",
          "ctx/territory": "GB",
          "vital_signs/body_weight/any_event/body_weight": parseFloat(weight)
      };

      requestPost("/ehr", {}).then(function(res){
        var ehrId =  res.data.ehrId;
      });

      //build the party data
      var partyData = {
        firstNames: firstNames,
        lastNames: lastNames,
        gender: gender,
        dateOfBirth: dateOfBirth,
        partyAdditionalInfo: [
        {
          key: "ehrId",
          value: ehrId
        }
        ]
      };

      requestPost("/demographics/party", partyData).then(function(res){
        if(res.data.party.action == 'CREATE') {
          return res.data.party.meta.href;
        }else{
          return false;
        }
      });
    }


    return func;

}])
