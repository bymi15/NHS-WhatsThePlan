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


.factory('LocalNotification', [function(){
    var func = {};

    func.schedule = function(id, title, text, datetime){
      cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        text: text,
        data: {id: id},
        at: datetime
      });
    }

    func.scheduleEvery = function(id, title, text, datetime, every){
      cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        text: text,
        data: {id: id},
        firstAt: datetime,
        every: every
      });
    }

    func.getAll = function(callback){
      cordova.plugins.notification.local.getAll(callback);
    }

    //returns a promise
    func.cancel = function(id){
      cordova.plugins.notification.local.cancel(id);
    }

    return func;
}])

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

    func.removeUser = function(uid){
        ref.child(uid).remove();
    }

    func.updateUser = function(uid, fullName, gender, dateOfBirth, nationality, maritalStatus, gpName, gpSurgery){
        ref.child(uid).update({
            fullName: fullName,
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
        return ref.child(uid).orderByChild('timestamp');
    }

    func.createAppointment = function(uid,location,datetime,timestamp,description,doctor,markerX,markerY){
        ref.child(uid).push({
            location:location,
            doctor:doctor,
            datetime:datetime,
            timestamp:timestamp,
            description:description,
            markerX:markerX,
            markerY:markerY
        });
    }

    func.removeAppointment = function(uid, id){
        var refUser = firebase.database().ref('appointments/' + uid);
        refUser.child(id).remove();
    }

    //removes appointments past certain number of hours from current time
    func.removeOldAppointments = function(uid, hours){
        var refUser = firebase.database().ref('appointments/' + uid);
        var now = Date.now();
        var cutoff = now - hours * 60 * 60 * 1000;
        var old = refUser.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
        old.on('child_added', function(snapshot) {
            snapshot.ref.remove();
        });
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

.factory('CareplanPhotos', [function(){
    var ref = firebase.database().ref('careplanphotos');

    var func = {};

    //returns a promise
    func.getImages = function(uid){
        return ref.child(uid).once('value');
    }

    func.uploadImage = function(uid, datetime, data){
        ref.child(uid).push({
            datetime: datetime,
            data: data,
        });
    }

    func.deleteImage = function(uid, id){
        var refUser = firebase.database().ref('careplanphotos/' + uid);
        refUser.child(id).remove();
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

.factory('MedicationReminder', [function(){
    var ref = firebase.database().ref('medicationreminder');

    var func = {};

    //returns a promise
    func.getReminders = function(uid){
        return ref.child(uid).orderByChild('timestamp');
    }

    //returns the id
    func.addReminder = function(uid, remId, medication, dosage, datetime, repeatEvery, timestamp){
      ref.child(uid).push({
        remId: remId,
        medication: medication,
        dosage: dosage,
        datetime: datetime,
        repeatEvery: repeatEvery,
        timestamp: timestamp
      });
    }

    //returns a promise
    func.generateId = function(uid, callback){
      var refCounter = firebase.database().ref('reminderCounter');
      return refCounter.child(uid).transaction(function(counter) {
        return (counter || 0) + 1; //increment the counter
      }, callback);
    }

    func.removeReminder = function(uid, id){
        var refUser = firebase.database().ref('medicationreminder/' + uid);
        refUser.child(id).remove();
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

    func.validateSignup = function(email, password, confirmPassword, fullName, gender, nationality, maritalStatus, nhsNumber, gpName, gpSurgery){
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
            format: {
              pattern: "Male|Female|MALE|FEMALE|male|female|M|F|m|f",
              flags: "i",
              message: "is invalid"
            },
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

    func.validateProfile = function(fullName, gender, dateOfBirth, nationality, maritalStatus, gpName, gpSurgery){
        //validate
        var constraints = {
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
            format: {
              pattern: "Male|Female|MALE|FEMALE|male|female|M|F|m|f",
              flags: "i",
              message: "is invalid"
            },
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

        var validation = validate({fullName: fullName, gender: gender, nationality: nationality, maritalStatus: maritalStatus, gpName: gpName, gpSurgery: gpSurgery}, constraints);

        return validation;
    }

    func.validateNote = function(title, consultant, location, datetime, notes){
        //validate
        var constraints = {
          title: {
            presence: true,
            length: {
              maximum: 100
            }
          },
          consultant: {
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
          location: {
            presence: true
          },
          datetime: {
            presence: true
          },
          notes: {
            presence: true
          }
        };

        var validation = validate({title: title, consultant: consultant, location: location, datetime: datetime, notes: notes}, constraints);

        return validation;
    }

    func.validateAppointment = function(locationNow,dateTime,timestamp,descriptionNow,doctorNow,markerX,markerY){
        //validate
        var constraints = {
          Description: {
            presence: true
          },
          Doctor: {
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
          Date: {
            presence: true
          },
          Location: {
            presence: true
          },
          Timestamp: {
            presence: true
          },
          markerX: {
            presence: true
          },
          markerY: {
            presence: true
          }
        };

        var validation = validate({Location: locationNow,Date: dateTime,Timestamp: timestamp,Description: descriptionNow,Doctor: doctorNow,markerX: markerX,markerY: markerY}, constraints);

        return validation;
    }

    func.validateContact = function(full_name, role, email, phone_number, address, note){
        //validate
        var constraints = {
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
          role: {
            presence: true
          },
          email: {
            presence: true,
            email: true
          },
          phoneNumber: {
            presence: true
          },
          address: {
            presence: true
          }
        };

        var validation = validate({fullName: full_name, role: role, email: email, phoneNumber: phone_number, address: address}, constraints);

        return validation;
    }

    func.validateReminder = function(medication, dosage, datetime, repeatEvery){
        //validate
        var constraints = {
          medication: {
            presence: true
          },
          dosage: {
            presence: true,
          },
          datetime: {
            presence: true
          },
          repeatEvery: {
            presence: true
          }
        };

        var validation = validate({medication: medication, dosage: dosage, datetime: datetime, repeatEvery: repeatEvery}, constraints);

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
    func.startSession = function() {
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

    func.getPatientMedications = function(){
      ehrId = "dabcbf61-94bb-45df-a472-9c7a489a200d"; //test ehrid
      var aql = "select a/uid/value as uid, b_a/activities[at0001]/description[at0002]/items[at0070]/value/value as Medication_item, b_a/activities[at0001]/description[at0002]/items[at0009]/value/value as Overall_directions_description, b_a/activities[at0001]/description[at0002]/items[at0044]/value/value as Additional_instruction, b_a/activities[at0001]/description[at0002]/items[at0018]/value/value as Clinical_indication, b_b/items[at0001]/value/value as Course_status from EHR e [a/ehr_id/value = '" + ehrId + "'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.medication_list.v0] contains ( INSTRUCTION b_a[openEHR-EHR-INSTRUCTION.medication_order.v0] or CLUSTER b_b[openEHR-EHR-CLUSTER.medication_order_summary.v0]) where a/name/value='Medication list'";

      return query(aql);
    }

    func.getLabTestResults = function(){
      ehrId = "dabcbf61-94bb-45df-a472-9c7a489a200d"; //test ehrid
      var aql = "select a/uid/value as uid, a/composer/name as author, a/context/start_time/value as date_created, a_b/data[at0001]/origin/value as sample_time, a_b/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value/value as test_name, a_b/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value/defining_code/code_string as test_name_code, a_b/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value/defining_code/terminology_id/value as test_name_terminology, a_b/data[at0001]/events[at0002]/data[at0003]/items[at0073]/value/value as status, a_b/data[at0001]/events[at0002]/data[at0003]/items[at0057]/value/value as conclusion, a_a/items[at0002]/name/value as Laboratory_result_header, a_a/items[at0002]/items[at0001]/name/value as result_name, a_a/items[at0002]/items[at0001]/name/defining_code/code_string as result_name_code, a_a/items[at0002]/items[at0001]/name/defining_code/terminology_id/value as result_name_terminology, a_a/items[at0002]/items[at0001]/value/magnitude as result_magnitude, a_a/items[at0002]/items[at0001]/value/units as result_units, a_a/items[at0002]/items[at0001]/value/normal_range/lower/magnitude as normal_range_lower, a_a/items[at0002]/items[at0001]/value/normal_range/lower/units as normal_range_lower_units, a_a/items[at0002]/items[at0001]/value/normal_range/upper/magnitude as normal_range_upper, a_a/items[at0002]/items[at0001]/value/normal_range/upper/units as normal_range_upper_units, a_a/items[at0002]/items[at0001]/value/normal_range/lower_included as lower_included, a_a/items[at0002]/items[at0001]/value/normal_range/upper_included as upper_included, a_a/items[at0002]/items[at0001]/value/normal_range/lower_unbounded as lower_unbounded, a_a/items[at0002]/items[at0001]/value/normal_range/upper_unbounded as upper_unbounded from EHR e [a/ehr_id/value = '" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_b[openEHR-EHR-OBSERVATION.laboratory_test.v0] contains CLUSTER a_a[openEHR-EHR-CLUSTER.laboratory_test_panel.v0]";

      return query(aql);
    }

    func.getPatientSurgeries = function(){
      ehrId = "dabcbf61-94bb-45df-a472-9c7a489a200d"; //test ehrid
      var aql = "select a/uid/value as uid, a/composer/name as author, a/context/start_time/value as date_submitted, b_a/description[at0001]/items[at0002]/value/value as procedure_name, b_a/description[at0001]/items[at0002]/value/defining_code/code_string as procedure_code, b_a/description[at0001]/items[at0002]/value/defining_code/terminology_id/value as procedure_terminology, b_a/description[at0001]/items[at0049]/value/value as procedure_notes, b_a/other_participations/performer/name as performer, b_a/time/value as procedure_datetime, b_a/ism_transition/current_state/value as procedure_state, b_a/ism_transition/current_state/defining_code/code_string as procedure_state_code, b_a/ism_transition/current_state/defining_code/terminology_id/value as procedure_state_terminology, b_a/ism_transition/careflow_step/value as procedure_step, b_a/ism_transition/careflow_step/defining_code/code_string as procedure_step_code, b_a/ism_transition/careflow_step/defining_code/terminology_id/value as procedure_step_terminology from EHR e [ehr_id/value = '" + ehrId + "'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.health_summary.v1] contains ACTION b_a[openEHR-EHR-ACTION.procedure.v1] where a/name/value='Procedures list'";

      return query(aql);
    }

    func.getPatientDiagnosis = function(){
      ehrId = "dabcbf61-94bb-45df-a472-9c7a489a200d"; //test ehrid
      var aql = "select a/uid/value as uid, a/composer/name as author, a/context/start_time/value as date_created, b_a/data[at0001]/items[at0002]/value/value as problem, b_a/data[at0001]/items[at0002]/value/defining_code/code_string as problem_code, b_a/data[at0001]/items[at0002]/value/defining_code/terminology_id/value as problem_terminology, b_a/data[at0001]/items[at0009]/value/value as description, b_a/data[at0001]/items[at0077]/value/value as onset_date from EHR e [ehr_id/value = '" + ehrId + "'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.problem_list.v1] contains EVALUATION b_a[openEHR-EHR-EVALUATION.problem_diagnosis.v1] where a/name/value='Problem list'";

      return query(aql);
    }

    return func;

}])
