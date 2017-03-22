angular.module('app.services', ['firebase'])

.service('sharedProperties', function () {
  var MarkerY = -0.1363550999999461;
  var MarkerX = 51.5250834;
  var location = "My Location";
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

.factory('ClosePopupService', function($document, $ionicPopup, $timeout){
  var lastPopup;
  return {
    register: function(popup) {
      $timeout(function(){
        var element = $ionicPopup._popupStack.length>0 ? $ionicPopup._popupStack[0].element : null;
        if(!element || !popup || !popup.close) return;
        element = element && element.children ? angular.element(element.children()[0]) : null;
        lastPopup  = popup;
        var insideClickHandler = function(event){
          event.stopPropagation();
        };
        var outsideHandler = function() {
          popup.close();
        };
        element.on('click', insideClickHandler);
        $document.on('click', outsideHandler);
        popup.then(function(){
          lastPopup = null;
          element.off('click', insideClickHandler);
          $document.off('click', outsideHandler);
        });
      });
    },
    closeActivePopup: function(){
      if(lastPopup) {
        $timeout(lastPopup.close);
        return lastPopup;
      }
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

    func.createAppointment = function(uid,thisLocation,datetime,thisDescription,thisDoctor,markerX,markerY){
        ref.child(uid).push({
            location:thisLocation,
            doctor:thisDoctor,
            datetime:datetime,
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

    func.saveCareplan = function(uid, datetime, careplan){
        ref.child(uid).set({
            datetime: datetime,
            careplan: careplan,
        });
    }

    return func;
}])

.factory('Careteam', [function(){
    var ref = firebase.database().ref('careteam');

    var func = {};

    //returns a promise
    func.getContacts = function(uid){
        return ref.child(uid).once('value');
    }

    //returns a promise
    func.getContact = function(uid, id){
        var refUser = firebase.database().ref('careteam/' + uid);
        return refUser.child(id).once('value');
    }

    func.addContact = function(uid, full_name, role, email, phone_number, address, note){
        if(note==null) note=" ";

        ref.child(uid).push({
            full_name: full_name,
            role: role,
            email: email,
            phone_number: phone_number,
            address: address,
            note: note
        });
    }

    func.updateContact = function(uid, id, full_name, role, email, phone_number, address, note){
        var refUser = firebase.database().ref('careteam/' + uid);
        refUser.child(id).update({
            full_name: full_name,
            role: role,
            email: email,
            phone_number: phone_number,
            address: address,
            note: note
        });
    }

    func.removeContact = function(uid, id){
        var refUser = firebase.database().ref('careteam/' + uid);
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

    func.validateSignup = function(email, password, confirmPassword, fullName, gender, nationality, maritalStatus, nhsNumber, gpName, gpSurgery){
        //validate
        var genderChoices = ["Male", "Female", "MALE", "FEMALE", "male", "female"];
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
              message: "can only contain alphabet letters and spaces"
            },
            length: {
              maximum: 100
            }
          },
          gender: {
            presence: true,
            inclusion: genderChoices
          },
          nationality: {
            presence: true,
            format: {
              pattern: "[a-z ]+",
              flags: "i",
              message: "can only contain alphabet letters and spaces"
            }
          },
          maritalStatus: {
            presence: true,
            format: {
              pattern: "[a-z ]+",
              flags: "i",
              message: "can only contain alphabet letters and spaces"
            }
          },
          nhsNumber: {
            presence: true,
            format: {
              pattern: "([0-9]{3}[0-9]{3}[0-9]{4})",
              flags: "i",
              message: "must be a valid NHS number"
            }
          },
          gpName: {
            presence: true,
            format: {
              pattern: "[a-z ]+",
              flags: "i",
              message: "can only contain alphabet letters and spaces"
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

        var validation = validate({email: email, password: password, fullName: fullName, gender: gender, nationality: nationality, maritalStatus: maritalStatus, nhsNumber: nhsNumber, gpName: gpName, gpSurgery: gpSurgery}, constraints);

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
.factory('Ehrscape', ['$http', function($http){

    var func = {};

    var baseUrl = 'https://test.operon.systems/rest/v1';

    var username = "oprn_hcbox";
    var password = "XioTAJoO479";

    var templateId = 'WhatsThePlan.v0';

    var sessionId;

    var ehrId;

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

    var saveComposition = function(compositionData, committer) {
      var queryParams = {
        "ehrId": ehrId,
        templateId: templateId,
        format: 'FLAT',
        committer: committer
      };

      return requestPost("/composition", compositionData);
    }

    var query = function(queryString){
      return requestGet("/query/?aql=" + queryString);
    }

    func.requestPost = function(endpoint, data){
      return $http.post(baseUrl + endpoint, data, headers);
    }

    //this should be called once - when the user logs in or signs up
    func.startSession = function(nhsNumber) {
      return $http.post(baseUrl + "/session?username=" + username + "&password=" + password, {});
    }

    func.retrieveEhrId = function(nhsNumber){
      return requestGet("/ehr/?subjectId=" + nhsNumber + "&subjectNamespace=uk.nhs.nhs_number");
    }

    func.setSessionId = function(session){
      sessionId = session;
      headers = {
        headers: {
          "Ehr-Session": sessionId
        }
      };
    }

    func.setEhrId = function(eid){
      ehrId = eid;
    }

    //this should be called once - when the user logs out
    func.closeSession = function() {
      $http.delete(baseUrl + "/session", headers);
    }

    func.checkPatientExists = function(nhsNumber){
      return requestGet("/demographics/party/query/?uk.nhs.nhs_number=" + nhsNumber);
    }

    func.createPatientEhrId = function(nhsNumber){
      return requestPost("/ehr/?subjectId=" + nhsNumber + "&subjectNamespace=uk.nhs.nhs_number", {});
    }

    func.createPatientDemographics = function(firstNames, lastNames, gender, dateOfBirth, maritalStatus, nhsNumber) {
      //build the party data
      var partyData = {
        "firstNames": firstNames,
        "lastNames": lastNames,
        "gender": gender.toUpperCase(),
        "dateOfBirth": dateOfBirth,
        "partyAdditionalInfo": [
        {
          "key": "uk.nhs.nhs_number",
          "value": nhsNumber
        },
        {
          "key": "maritalStatus",
          "value": maritalStatus
        }
        ]
      };

      return requestPost("/demographics/party", partyData);
    }

    func.getPatientAllergies = function(){
      ehrId = "dabcbf61-94bb-45df-a472-9c7a489a200d"; //test ehrid
      var aql = "select a/uid/value as compositionId, a/context/start_time/value as dateRecorded, b_a/data[at0001]/items[at0002]/value/value as Causative_agent, b_a/data[at0001]/items[at0009]/items[at0011]/value/value as Manifestation from EHR e [a/ehr_id/value = '" + ehrId + "'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.adverse_reaction_list.v1] contains EVALUATION b_a[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1] where a/name/value='Adverse reaction list'";

      return query(aql);
    }

    return func;

}])
