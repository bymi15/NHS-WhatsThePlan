angular.module('app.controllers', ['ionic', 'firebase'])

.controller('menuCtrl', function ($scope, $stateParams) {
})

.controller('loginCtrl', function ($scope, $state, $ionicHistory, utils, validater) {

    $scope.data = {};

    $scope.signInEmail = function(){
        utils.showLoading();

        var email = $scope.data.email;
        var password = $scope.data.password;

        var validation = validater.validateLogin(email, password);

        if(validation){
            utils.hideLoading();
            if(validation.email){
                utils.showAlert('Error!', 'Invalid email address');
                return;
            }else if(validation.password){
                utils.showAlert('Error!', 'Please enter your password');
                return;
            }
        }

        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            // user successfully logged in
            utils.hideLoading();
            $ionicHistory.clearHistory();
            $state.go("main");
        }).catch(function(error) {
            utils.hideLoading();
            utils.showAlert('Error!', 'Incorrect login details. Please try again.');
        });
    };
})

.controller('signupCtrl', function ($scope, $ionicHistory, $ionicSlideBoxDelegate, $state, utils, validater, User, $filter, Ehrscape) {
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
        utils.showLoading();

        var email = $scope.data.email;
        var password = $scope.data.password;
        var confirmPassword = $scope.data.confirmPassword;
        var fullName = $scope.data.fullName;
        var gender = $scope.data.gender;
        var dateOfBirth = $scope.data.dateOfBirth;
        dateOfBirth = $filter('date')(dateOfBirth, 'dd-MM-yyyy');

        var nationality = $scope.data.nationality;
        var maritalStatus = $scope.data.maritalStatus;
        var nhsNumber = $scope.data.nhsNumber;
        var gpName = $scope.data.gpName;
        var gpSurgery = $scope.data.gpSurgery;


        utils.showLoading();
        var validation = validater.validateSignup(email, password, confirmPassword, fullName, gender, nationality, maritalStatus, nhsNumber, gpName, gpSurgery);

        if(validation){
            utils.hideLoading();

            if(validation.email){
                utils.showAlert('Error!', validation.email);
                return;
            }else if(validation.password){
                utils.showAlert('Error!', validation.password);
                return;
            }else if(validation.confirmPassword){
                utils.showAlert('Error!', validation.confirmPassword);
                return;
            }else if(validation.fullName){
                utils.showAlert('Error!', validation.fullName);
                return;
            }else if(validation.gender){
                utils.showAlert('Error!', validation.gender);
                return;
            }else if(validation.nationality){
                utils.showAlert('Error!', validation.nationality);
                return;
            }else if(validation.maritalStatus){
                utils.showAlert('Error!', validation.maritalStatus);
                return;
            }else if(validation.nhsNumber){
                utils.showAlert('Error!', validation.nhsNumber);
                return;
            }else if(validation.gpName){
                utils.showAlert('Error!', validation.gpName);
                return;
            }else if(validation.gpSurgery){
                utils.showAlert('Error!', validation.gpSurgery);
                return;
            }else{
                utils.showAlert('Error!', "An error has occured. Please try again.");
                return;
            }
        }

        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
            //success

            //add the user entry in firebase
            User.createUser(result.uid, fullName, gender, dateOfBirth, nationality, maritalStatus, nhsNumber, gpName, gpSurgery);

            //create a new ehr session for the user
            var index = fullName.indexOf(" ");
            var firstNames = fullName.substr(0, index);
            var lastNames = fullName.substr(index + 1);
            Ehrscape.startSession();
            Ehrscape.loadPatientEhr(nhsNumber);
            Ehrscape.createPatient(firstNames, lastNames, gender, dateOfBirth.toISOString(), nhsNumber).then(function(res){
                if(res.data.party.action == 'CREATE') {
                  console.log(res.data.party.meta.href);
                }else{
                  console.log(res);
                }
            });

            utils.hideLoading();
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();

            $state.go("main");
        }).catch(function(error) {
            utils.hideLoading();
            utils.showAlert('Error!', error.message);
        });
    };

})

.controller('mainCtrl', function ($scope, $state, User, Ehrscape) {
    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            $state.go("login");
        }
    });

    $scope.logout = function(){
        firebase.auth().signOut();

        Ehrscape.closeSession();

        $state.go("login");
    }
})

.controller('profileCtrl', function ($scope, $state, utils, User) {
    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            User.getUser(user.uid).then(function(snapshot) {
                $scope.userProfile = snapshot.val();

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });
})

.controller('editProfileCtrl', function ($scope, $state, utils, User, $filter) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            User.getUser(user.uid).then(function(snapshot) {
                $scope.userProfile = snapshot.val();

                $scope.data.dateOfBirth = $scope.userProfile.dateOfBirth;
                $scope.data.gender = $scope.userProfile.gender;
                $scope.data.nationality = $scope.userProfile.nationality;
                $scope.data.maritalStatus = $scope.userProfile.maritalStatus;
                $scope.data.gpName = $scope.userProfile.gpName;
                $scope.data.gpSurgery = $scope.userProfile.gpSurgery;

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.updateProfile = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var gender = $scope.data.gender;
            var dateOfBirth = $scope.data.dateOfBirth;
            dateOfBirth = $filter('date')(dateOfBirth, 'dd-MM-yyyy');

            var nationality = $scope.data.nationality;
            var maritalStatus = $scope.data.maritalStatus;
            var gpName = $scope.data.gpName;
            var gpSurgery = $scope.data.gpSurgery;

            User.updateUser(uid, gender, dateOfBirth, nationality, maritalStatus, gpName, gpSurgery);

            utils.hideLoading();

            $state.go("profile");
        }else{
            $state.go("login");
        }
    }
})

.controller('notesCtrl', function ($scope, $state, utils, Notes) {
    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Notes.getNotes(user.uid).then(function(snapshot) {
                $scope.notes = snapshot.val();

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.goViewNote = function(noteID){
        $state.go('viewNote', { id: noteID });
    }

    $scope.removeNote = function(noteID){
        var user = firebase.auth().currentUser;
        Notes.removeNote(user.uid, noteID);
        delete $scope.notes[noteID];
    }
})

.controller('addNotesCtrl', function ($scope, $state, utils, $filter, Notes) {
    $scope.data = {};

    $scope.addNote = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var title = $scope.data.title;
            var consultant = $scope.data.consultant;
            var location = $scope.data.location;
            var datetime = $scope.data.datetime;
            datetime = $filter('date')(datetime, 'dd-MM-yyyy hh:mm a');
            var notes = $scope.data.notes;

            Notes.addNote(uid, title, consultant, location, datetime, notes);
            utils.hideLoading();

            $state.go("notes");
        }else{
            $state.go("login");
        }
    }
})

.controller('viewNoteCtrl', function ($scope, $state, $stateParams, utils, Notes) {
    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Notes.getNote(user.uid, $stateParams.id).then(function(snapshot) {
                $scope.note = snapshot.val();

                $scope.noteID = $stateParams.id;

                $scope.note.notes = $scope.note.notes.replace(/(?:\r\n|\r|\n)/g, '<br>');

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.goEditNote = function(){
        $state.go('editNote', { id: $scope.noteID });
    }
})

.controller('editNoteCtrl', function ($scope, $state, $stateParams, utils, Notes, User, $filter, $ionicHistory) {
    utils.showLoading();

    $scope.goBack = function(){
        $ionicHistory.goBack();
    }

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Notes.getNote(user.uid, $stateParams.id).then(function(snapshot) {
                $scope.note = snapshot.val();

                $scope.note.id = $stateParams.id;

                $scope.data.title = $scope.note.title;
                $scope.data.consultant = $scope.note.consultant;
                $scope.data.location = $scope.note.location;
                $scope.data.datetime = $scope.note.datetime;
                $scope.data.notes = $scope.note.notes;

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.updateNote = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var id = $scope.note.id;

            var title = $scope.data.title;
            var consultant = $scope.data.consultant;
            var location = $scope.data.location;
            var datetime = $scope.data.datetime;
            datetime = $filter('date')(datetime, 'dd-MM-yyyy hh:mm a');
            var notes = $scope.data.notes;

            Notes.updateNote(uid, id, title, consultant, location, datetime, notes);

            utils.hideLoading();

            $state.go('viewNote', { id: id });
        }else{
            $state.go("login");
        }
    }
})


.controller('appointmentsCtrl', function ($scope, $state, utils, User, $filter,$ionicHistory, Appointment, $ionicModal, $ionicPopup, sharedProperties, ClosePopupService) {

    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Appointment.getAppointments(user.uid).then(function(snapshot) {
                $scope.appointments = snapshot.val();
                $scope.currentDate = $filter('date')(new Date(), 'dd MMM yyyy');
                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.removeAppointment = function(id){
        var user = firebase.auth().currentUser;
        Appointment.removeAppointment(user.uid, id);
        delete $scope.appointments[id];
    }

    $scope.createClass = function(name,rules){
        var style = document.createElement('style');
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
        if(!(style.sheet||{}).insertRule){
            (style.styleSheet || style.sheet).addRule(name, rules);
        }else{
            style.sheet.insertRule(name+"{"+rules+"}",0);
        }
    }

    $scope.createClass('.mypopup .popup',"min-width: 90%;height: 90%;background-color: transparent;border-style: solid;");
    $scope.createClass('.mypopup .popup-body',"overflow:inherit; text-align:center;position:relative;background-color: #FFFFFF;height:30em;border-style: solid;border:1px black;");
    $scope.createClass('.mypopup .popup-head',"background-color: #387EF5");
    $scope.createClass('.mypopup .popup-title',"color: #FFFFFF; font-size:20px;");
    $scope.createClass('.mypopup .popup-buttons',"background-color: #387EF5;color:#3FA9F5;border-style: solid;");
    $scope.createClass('.mypopup .popup-buttons.button',"background-color: #3FA9F5;color:#FFFFFF;border-style: solid;");
    $scope.createClass('.mypopup .popup-buttons.row ',"background-color: transparent;display:none;");
    $scope.createClass('.mypopup .popup-footer',"display:none;");

    $scope.showPopup=function(item){
        sharedProperties.setMarkerX(item.markerX);
        sharedProperties.setMarkerY(item.markerY);
        sharedProperties.setLocation(item.location);

        var alertPopup=$ionicPopup.alert({
            title:'Location',
            templateUrl:'templates/mymodal.html',
            cssClass: 'mypopup'
        });
        ClosePopupService.register(alertPopup);
        alertPopup.then(function(res){});
    }

    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
    });

})

.controller('bookAppointmentCtrl', function ($scope, $state, utils, User,$filter, $ionicHistory, Appointment, $ionicLoading, sharedProperties) {

    $scope.data = {};

    $scope.location = { text: sharedProperties.getLocation() };

    var map = new google.maps.Map(document.getElementById('map-canvas'),{
        center:{
            lat:sharedProperties.getMarkerX(),
            lng:sharedProperties.getMarkerY()
        },
        zoom:15
    });

    var marker = new google.maps.Marker({
        position:{
            lat:sharedProperties.getMarkerX(),
            lng:sharedProperties.getMarkerY()
        },
        map:map
    });

    var inputBox = document.getElementById('mapsearch');
    var thisLocation = document.getElementById('thisLocation');

    var searchBox = new google.maps.places.SearchBox(inputBox);

    inputBox.addEventListener('keyup',function(){
        thisLocation.value = inputBox.value;
    });

    google.maps.event.addListener(searchBox,'places_changed',function(){
        var places = searchBox.getPlaces();

        var bounds = new google.maps.LatLngBounds();

        var i,place;
        for(i=0;place=places[i];i++){
            bounds.extend(place.geometry.location);
            marker.setPosition(place.geometry.location);
        }

        map.fitBounds(bounds);
        map.setZoom(15);

        thisLocation.value = inputBox.value;
    });

    google.maps.event.addListener(marker, 'dragend', function (event) {
        document.getElementById("latbox").value = this.getPosition().lat();
        document.getElementById("lngbox").value = this.getPosition().lng();
    });

    //FINISH MAPS
    $scope.addAppointment = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var dateTime = $scope.data.datetime;
            var locationNow = document.getElementById('thisLocation').value;
            var descriptionNow = $scope.data.thisDescription;
            var doctorNow = $scope.data.thisDoctor;
            dateTime = $filter('date')(dateTime, 'dd-MM-yyyy hh:mm a');

            var markerX = marker.getPosition().lat();
            var markerY = marker.getPosition().lng();

            Appointment.createAppointment(uid,locationNow,dateTime,descriptionNow,doctorNow,markerX,markerY);

            utils.hideLoading();
            $state.go("appointments");
        }else{
            $state.go("login");
        }
    }
})

.controller('careplanMenuCtrl', function ($scope, $stateParams) {
})

.controller('careplanCtrl', function ($scope, $state, utils, Careplan) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careplan.getCareplan(user.uid).then(function(snapshot) {
                $scope.careplan = snapshot.val();
                /*$scope.careplan.careplan = $scope.careplan.careplan.replace(/(?:\r\n|\r|\n)/g, '<br>');*/
                $scope.data.careplan = $scope.careplan.careplan;
                $scope.data.datetime = $scope.careplan.datetime;

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });
})

.controller('editCareplanCtrl', function ($scope, $state, utils, Careplan, $filter) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careplan.getCareplan(user.uid).then(function(snapshot) {
                $scope.careplan = snapshot.val();
                $scope.data.careplan = $scope.careplan.careplan;

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.saveCareplan = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var dateTime = new Date();
            var careplan = $scope.data.careplan;

            dateTime = $filter('date')(dateTime, 'dd-MM-yyyy hh:mm a');

            Careplan.saveCareplan(uid, dateTime, careplan);

            utils.hideLoading();

            $state.go("careplan");
        }else{
            $state.go("login");
        }
    }
})

.controller('careteamCtrl', function ($scope, $state, utils, Careteam) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careteam.getContacts(user.uid).then(function(snapshot) {
                $scope.contacts = snapshot.val();

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.goViewContact = function(contactID){
        $state.go('viewContact', { id: contactID });
    }

    $scope.removeContact = function(contactID){
        var user = firebase.auth().currentUser;
        Careteam.removeContact(user.uid, contactID);
        delete $scope.contacts[contactID];
    }
})

.controller('viewContactCtrl', function ($scope, $state, $stateParams, utils, Careteam) {
    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careteam.getContact(user.uid, $stateParams.id).then(function(snapshot) {
                $scope.contact = snapshot.val();

                $scope.contactID = $stateParams.id;

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.goEditContact = function(){
        $state.go('editContact', { id: $scope.contactID });
    }
})

.controller('addContactCtrl', function ($scope, $state, utils, $filter, Careteam) {
    $scope.data = {};

    $scope.addContact = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var full_name = $scope.data.full_name;
            var role = $scope.data.role;
            var email = $scope.data.email;
            var phone_number = $scope.data.phone_number;
            var address = $scope.data.address;
            var note = $scope.data.note;

            Careteam.addContact(uid, full_name, role, email, phone_number, address, note);
            utils.hideLoading();

            $state.go("careteam");
        }else{
            $state.go("login");
        }
    }
})

.controller('editContactCtrl', function ($scope, $state, $stateParams, utils, Careteam, $filter) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careteam.getContact(user.uid, $stateParams.id).then(function(snapshot) {
                $scope.contact = snapshot.val();

                $scope.contact.id = $stateParams.id;

                $scope.data.full_name = $scope.contact.full_name;
                $scope.data.role = $scope.contact.role;
                $scope.data.email= $scope.contact.email;
                $scope.data.phone_number = $scope.contact.phone_number;
                $scope.data.address = $scope.contact.address;
                $scope.data.note = $scope.contact.note;

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.updateContact = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var id = $scope.contact.id;

            var full_name = $scope.data.full_name;
            var role = $scope.data.role;
            var email = $scope.data.email;
            var phone_number = $scope.data.phone_number;
            var address = $scope.data.address;
            var note = $scope.data.note;

            Careteam.updateContact(uid, id, full_name, role, email, phone_number, address, note);

            utils.hideLoading();

            $state.go('viewContact', { id: id });
        }else{
            $state.go("login");
        }
    }
})
