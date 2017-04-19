angular.module('app.controllers', ['ionic', 'firebase', 'ngCordova'])

.controller('loginCtrl', function ($scope, $state, $ionicHistory, utils, validater, User, Ehrscape, $rootScope) {

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $state.go("main");
        }
    });

    $scope.data = {};

    //for testing
    $scope.data.email = "test@test.test";
    $scope.data.password = "testtest";

    $scope.signInEmail = function(){
        utils.showLoading();

        var email = $scope.data.email;
        var password = $scope.data.password;

        /*var validation = validater.validateLogin(email, password);

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
*/
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            // user successfully logged in

            //start the openEHR session
            User.getUser(firebase.auth().currentUser.uid).then(function(snapshot) {
                var nhsNumber = snapshot.val().nhsNumber;

                // create an openehr session
                Ehrscape.startSession().then(function(res){
                    Ehrscape.setSessionId(res.data.sessionId);
                    Ehrscape.retrieveEhrId(nhsNumber).then(function(res){
                        $rootScope.ehrId = res.data.ehrId;
                    });
                    $rootScope.sessionId = res.data.sessionId;
                });
            });

            utils.hideLoading();
            $ionicHistory.clearHistory();
            $state.go("main");
        }).catch(function(error) {
            utils.hideLoading();
            utils.showAlert('Error!', 'Incorrect login details. Please try again.');
        });
    };
})

.controller('signupCtrl', function ($scope, $ionicHistory, $ionicSlideBoxDelegate, $state, utils, validater, User, $filter, Ehrscape, $rootScope) {
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
        var isoDateOfBirth = $filter('date')(dateOfBirth, 'yyyy-MM-ddTHH:mm:ss.sss') + 'Z';
        dateOfBirth = $filter('date')(dateOfBirth, 'dd-MM-yyyy');

        var nationality = $scope.data.nationality;
        var maritalStatus = $scope.data.maritalStatus;
        var nhsNumber = $scope.data.nhsNumber;
        var gpName = $scope.data.gpName;
        var gpSurgery = $scope.data.gpSurgery;

        /*var validation = validater.validateSignup(email, password, confirmPassword, fullName, gender, nationality, maritalStatus, nhsNumber, gpName, gpSurgery);

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
        }*/

        var index = fullName.indexOf(" ");
        var firstNames = fullName.substr(0, index);
        var lastNames = fullName.substr(index + 1);

        //check if email already exists:
        firebase.auth().fetchProvidersForEmail(email).then(function(result){
            if(result.length > 0){
                console.log("The email address already exists. Please try a different one.");
                throw("The email address already exists. Please try a different one.");
            }else{
                //create a new ehr session for the user
                return Ehrscape.startSession();
            }
        }).then(function(res){
            if(res.data.sessionId == null){
                console.log("EhrScape returned a NULL session ID");
                throw("EhrScape returned a NULL session ID");
            }else{
                Ehrscape.setSessionId(res.data.sessionId);
                $rootScope.sessionId = res.data.sessionId;

                return Ehrscape.checkPatientExists(nhsNumber);
            }
        }).then(function(res){
            //patient doesn't already exist
            if(res.status==204){
                return Ehrscape.retrieveEhrId(nhsNumber).then(function(res){
                    //ehr id doesn't exist - needs to be created
                    if(res.status==204){
                        return Ehrscape.createPatientEhrId(nhsNumber).then(function(res){
                            if(res.status==201){
                                $rootScope.ehrId = res.data.ehrId;
                                Ehrscape.setEhrId(res.data.ehrId);
                                console.log("ehr id created successfully: " + res.data.ehrId);

                                return Ehrscape.createPatientDemographics(firstNames, lastNames, gender, isoDateOfBirth, maritalStatus, nhsNumber);
                            }else{
                                console.log(JSON.stringify(res));
                                throw("Error! Could not create ehr id for NHS Number: " + nhsNumber);
                            }
                        });
                    }else{
                        $rootScope.ehrId = res.data.ehrId;
                        Ehrscape.setEhrId(res.data.ehrId);

                        return Ehrscape.createPatientDemographics(firstNames, lastNames, gender, isoDateOfBirth, maritalStatus, nhsNumber);
                    }
                });
            }else{
                console.log("A user with NHS number: " + nhsNumber + " already exists on the OpenEHR system");
                throw("A user with NHS number: " + nhsNumber + " already exists on the OpenEHR system")
            }
        }).then(function(res){
            if(res.data.action == 'CREATE') {
                //success
                console.log("ehr create patient success!");

                return firebase.auth().createUserWithEmailAndPassword(email, password);
            }else{
                //failure
                console.log("An error has occured while creating the user demographics party");
                throw("An error has occured while creating the user demographics party");
            }
        }).then(function(res){
            //add the user entry in firebase
            User.createUser(res.uid, fullName, gender, dateOfBirth, nationality, maritalStatus, nhsNumber, gpName, gpSurgery);
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            utils.hideLoading();
            $state.go("main");

        }).catch(function(error){
            utils.hideLoading();
            utils.showAlert('Error!', error);
        });

    };

})

.controller('mainCtrl', function ($scope, $state, User, Ehrscape, $rootScope, utils) {

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            $state.go("login");
        }else{
            //check if ehr session is still active
            if($rootScope.sessionId == null || $rootScope.ehrId == null){
                utils.showLoading();
                console.log("refreshing ehr session");
                User.getUser(firebase.auth().currentUser.uid).then(function(snapshot) {
                    var userProf = snapshot.val();
                    if(userProf == null) return;
                    var nhsNumber = userProf.nhsNumber;
                    // create an openehr session
                    Ehrscape.startSession().then(function(res){
                        Ehrscape.setSessionId(res.data.sessionId);
                        Ehrscape.retrieveEhrId(nhsNumber).then(function(res){
                            $rootScope.ehrId = res.data.ehrId;
                            utils.hideLoading();
                        });
                        $rootScope.sessionId = res.data.sessionId;
                    });
                });
            }
        }
    });

    $scope.logout = function(){
        firebase.auth().signOut();

        Ehrscape.setSessionId($rootScope.sessionId);
        Ehrscape.closeSession();

        //reset the rootscope
        for (var prop in $rootScope) {
            if (prop.substring(0,1) !== '$') {
                delete $rootScope[prop];
            }
        }

        $state.go("login");
    }
})

.controller('profileCtrl', function ($scope, $state, utils, User, Ehrscape, $rootScope) {
    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            User.getUser(user.uid).then(function(snapshot) {
                $scope.userProfile = snapshot.val();

                console.log($rootScope.sessionId + " | " + $rootScope.ehrId);

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

                $scope.data.fullName = $scope.userProfile.fullName;
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
            var fullName = $scope.data.fullName;
            var gender = $scope.data.gender;
            var dateOfBirth = $scope.data.dateOfBirth;
            dateOfBirth = $filter('date')(dateOfBirth, 'dd-MM-yyyy');

            var nationality = $scope.data.nationality;
            var maritalStatus = $scope.data.maritalStatus;
            var gpName = $scope.data.gpName;
            var gpSurgery = $scope.data.gpSurgery;

            User.updateUser(uid, fullName, gender, dateOfBirth, nationality, maritalStatus, gpName, gpSurgery);

            utils.hideLoading();

            $state.go("profile");
        }else{
            $state.go("login");
        }
    }
})

.controller('notesCtrl', function ($scope, $state, utils, Notes, $filter) {
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
            datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');
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

                if($scope.note != null){
                    $scope.note.notes = $scope.note.notes.replace(/(?:\r\n|\r|\n)/g, '<br>');
                }

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

.controller('editNoteCtrl', function ($scope, $state, $stateParams, utils, Notes, User, $filter) {
    utils.showLoading()

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
            datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');
            var notes = $scope.data.notes;

            Notes.updateNote(uid, id, title, consultant, location, datetime, notes);

            utils.hideLoading();

            $state.go('viewNote', { id: id });
        }else{
            $state.go("login");
        }
    }
})


.controller('appointmentsCtrl', function ($scope, $state, utils, User, $filter, Appointment, $ionicModal, $ionicPopup, sharedProperties, ClosePopupService) {

    utils.showLoading();

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //clear out old appointments past 2 hours from the current time
            Appointment.removeOldAppointments(user.uid, 2);

            //retrieve the appointments from firebase
            $scope.appointments = {};

            Appointment.getAppointments(user.uid).once('value', function(snap){
                snap.forEach(function(ss) {
                    var val = ss.val();
                    $scope.appointments[ss.key] = val;
                });

                $scope.currentDate = $filter('date')(new Date(), 'dd MMM yyyy');
                $scope.appointmentsLength = Object.keys($scope.appointments).length;
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

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

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

.controller('bookAppointmentCtrl', function ($scope, $state, utils, User,$filter, Appointment, $ionicLoading, sharedProperties) {

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
            var timestamp = (new Date(dateTime)).getTime();
            dateTime = $filter('date')(dateTime, 'hh:mm a - dd MMM yyyy');

            var markerX = marker.getPosition().lat();
            var markerY = marker.getPosition().lng();

            Appointment.createAppointment(uid,locationNow,dateTime,timestamp,descriptionNow,doctorNow,markerX,markerY);

            utils.hideLoading();
            $state.go("appointments");
        }else{
            $state.go("login");
        }
    }
})

.controller('appointmentModalCtrl', function ($scope, sharedProperties) {

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
})

.controller('careplanMenuCtrl', function ($scope, $stateParams) {
})

.controller('careplanCtrl', function ($scope, $state, utils, Careplan, $cordovaCamera, CareplanPhotos, $filter, $ionicActionSheet) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.currentUID = user.uid;
            Careplan.getCareplan(user.uid).then(function(snapshot) {
                $scope.careplan = snapshot.val();
                /*$scope.careplan.careplan = $scope.careplan.careplan.replace(/(?:\r\n|\r|\n)/g, '<br>');*/
                if($scope.careplan != null){
                    $scope.data.careplan = $scope.careplan.careplan;
                    $scope.data.datetime = $scope.careplan.datetime;
                }

                CareplanPhotos.getImages(user.uid).then(function(ss){
                    $scope.images = ss.val();
                    utils.hideLoading();
                });
            });
        }else{
            $state.go("login");
        }
    });

    $scope.takePhoto = function(){
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 450,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData){
            var dateTime = new Date();
            dateTime = $filter('date')(dateTime, 'dd-MM-yyyy hh:mm a');

            CareplanPhotos.uploadImage($scope.currentUID, dateTime, "data:image/jpeg;base64," + imageData);

            $state.go($state.current, {}, {reload: true});

        }, function(err){
            console.log(err)
        });
    }

    $scope.choosePhoto = function () {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 450,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            var dateTime = new Date();
            dateTime = $filter('date')(dateTime, 'dd-MM-yyyy hh:mm a');

            CareplanPhotos.uploadImage($scope.currentUID, dateTime, "data:image/jpeg;base64," + imageData);

            $state.go($state.current, {}, {reload: true});

        }, function (err) {
            console.log(err)
        });
    }

     $scope.deleteImage = function (imageID) {
        $ionicActionSheet.show({
          destructiveText: 'Delete <i class="icon ion-trash-b">',
          cancelText: 'Cancel',
          cancel: function() {
            return true;
          },
          destructiveButtonClicked: function() {
            var result = confirm("Are you sure you wish to delete this photo?");
            if (result) {
                CareplanPhotos.deleteImage($scope.currentUID, imageID);
                $state.go($state.current, {}, {reload: true});
                alert("The photo has been deleted.");
            }
            return true;
          }
        });
     }
})

.controller('editCareplanCtrl', function ($scope, $state, utils, Careplan, $filter) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careplan.getCareplan(user.uid).then(function(snapshot) {
                $scope.careplan = snapshot.val();

                if($scope.careplan != null){
                    $scope.data.careplan = $scope.careplan.careplan;
                }

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

.controller('addContactCtrl', function ($scope, $state, utils, Careteam) {
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

.controller('editContactCtrl', function ($scope, $state, $stateParams, utils, Careteam) {
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

.controller('medicalRecordsCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
})

.controller('allergiesCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
    utils.showLoading();

    Ehrscape.setSessionId($rootScope.sessionId);
    Ehrscape.setEhrId($rootScope.ehrId);

    Ehrscape.getPatientAllergies().then(function(res){
        $scope.allergies = res.data.resultSet;
        //console.log(JSON.stringify(res));
        utils.hideLoading();
    });
})


.controller('medicationsMenuCtrl', function ($scope, $stateParams) {
})

.controller('medicationsCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
    utils.showLoading();

    Ehrscape.setSessionId($rootScope.sessionId);
    Ehrscape.setEhrId($rootScope.ehrId);

    Ehrscape.getPatientMedications().then(function(res){
        $scope.medications = res.data.resultSet;
        $rootScope.medications = $scope.medications;
        //console.log(JSON.stringify(res));
        utils.hideLoading();
    });

    $scope.goViewMedication = function(medID){
        $state.go('viewMedication', { id: medID });
    }
})

.controller('viewMedicationCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
    utils.showLoading();

    var key = $stateParams.id;
    $scope.medication = $rootScope.medications[key];

    utils.hideLoading();
})

.controller('medicationReminderCtrl', function ($scope, $state, utils, MedicationReminder, LocalNotification, $rootScope) {
    utils.showLoading();

    $scope.removeReminder = function(id){
        var notificationID = $scope.reminders[id].remId;

        var user = firebase.auth().currentUser;
        MedicationReminder.removeReminder(user.uid, id);

        delete $scope.reminders[id];

        if($rootScope.notificationSupported){
            LocalNotification.cancel(notificationID);
        }
    }

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.reminders = {};
            MedicationReminder.getReminders(user.uid).once('value', function(snap){
                snap.forEach(function(ss) {
                    var val = ss.val();
                    $scope.reminders[ss.key] = val;
                });

                $scope.remindersLength = (Object.keys($scope.reminders)).length;

                //automatically remove reminders that are expired
                if($rootScope.notificationSupported){
                    LocalNotification.getAll(function (notifications) {
                        for(var key in $scope.reminders){
                            var remId = $scope.reminders[key].remId;
                            var found = false;

                            for(var nKey in notifications){
                                var nRemId = notifications[nKey].id;
                                if(remId == nRemId){
                                    found = true;
                                }
                            }

                            if(!found){
                                MedicationReminder.removeReminder(user.uid, key);
                                delete $scope.reminders[key];
                            }
                        }
                        utils.hideLoading();
                    });
                }

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });
})

.controller('addReminderCtrl', function ($scope, $state, utils, $filter, MedicationReminder, LocalNotification, $ionicPlatform, $rootScope) {
    $scope.data = {};

    $scope.data.repeatEvery = 'hour';

    $scope.addReminder = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var medication = $scope.data.medication;
            var dosage = $scope.data.dosage;
            var repeatEvery = $scope.data.repeatEvery;
            var datetime = $scope.data.datetime;
            var datetimeObject = new Date($scope.data.datetime);
            var datetimeFull = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');
            var timestamp = datetimeObject.getTime();

            MedicationReminder.generateId(user.uid, function(err, committed, ss){
                if(err) {
                    utils.showAlert('An error has occured!', err);
                    utils.hideLoading();
                }else if(committed) {
                    var remId = ss.val();

                    MedicationReminder.addReminder(uid, remId, medication, dosage, datetimeFull, repeatEvery, timestamp);

                    if($rootScope.notificationSupported){
                        if(repeatEvery === 'none'){
                            LocalNotification.schedule(remId, "It's time to take your medication!", "Take " + dosage + " of " + medication, datetimeObject);
                        }else{
                            LocalNotification.scheduleEvery(remId, "It's time to take your medication!", "Take " + dosage + " of " + medication, datetimeObject, repeatEvery);
                        }
                    }

                    utils.hideLoading();

                    $state.go("medicationReminder");
                }
            });

        }else{
            $state.go("login");
        }
    }
})


.controller('labTestsCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope, _, $filter) {
    utils.showLoading();

    Ehrscape.setSessionId($rootScope.sessionId);
    Ehrscape.setEhrId($rootScope.ehrId);

    Ehrscape.getLabTestResults().then(function(res){
        var i = 0;
        var testsArr = [];
        var foundArr = [];

        var labTests = res.data.resultSet;
        for(var key in labTests){
            var datetime = labTests[key].sample_time;
            labTests[key].datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');

            var found = foundArr.includes(labTests[key].test_name_code);
            if(!found){
                foundArr.push(labTests[key].test_name_code);
                testsArr[i] = labTests[key];
                i++;
            }
        }

        $scope.labTests = testsArr;
        $scope.labTestsGrouped = _.groupBy(labTests, "test_name_code");
        //console.log(JSON.stringify($scope.labTestsGrouped));

        $rootScope.labTestsGrouped = $scope.labTestsGrouped;
        //console.log(JSON.stringify(res));
        utils.hideLoading();
    });

    $scope.goViewLabTest = function(testID){
        $state.go('viewLabTest', { id: testID });
    }
})


.controller('viewLabTestCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
    utils.showLoading();

    var testID = $stateParams.id;

    $scope.testGroup = $rootScope.labTestsGrouped[testID];

    utils.hideLoading();
})


.controller('diagnosisCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope, $filter) {
    utils.showLoading();

    Ehrscape.setSessionId($rootScope.sessionId);
    Ehrscape.setEhrId($rootScope.ehrId);

    Ehrscape.getPatientDiagnosis().then(function(res){
        $scope.diagnosis = res.data.resultSet;

        for(var key in $scope.diagnosis){
            var datetime = $scope.diagnosis[key].onset_date;
            $scope.diagnosis[key].datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');
        }

        $rootScope.diagnosis = $scope.diagnosis

        //console.log(JSON.stringify(res));
        utils.hideLoading();
    });


    $scope.goViewDiagnosis = function(diagnosisID){
        $state.go('viewDiagnosis', { id: diagnosisID });
    }
})


.controller('viewDiagnosisCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
    utils.showLoading();

    var diagnosisID = $stateParams.id;

    $scope.diagnosis = $rootScope.diagnosis[diagnosisID];

    utils.hideLoading();
})

.controller('surgeriesCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope, $filter) {
    utils.showLoading();

    Ehrscape.setSessionId($rootScope.sessionId);
    Ehrscape.setEhrId($rootScope.ehrId);

    Ehrscape.getPatientSurgeries().then(function(res){
        $scope.surgeries = res.data.resultSet;

        for(var key in $scope.surgeries){
            var datetime = $scope.surgeries[key].procedure_datetime;
            $scope.surgeries[key].datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');
        }

        $rootScope.surgeries = $scope.surgeries

        //console.log(JSON.stringify(res));
        utils.hideLoading();
    });


    $scope.goViewSurgery = function(surgeryID){
        $state.go('viewSurgery', { id: surgeryID });
    }
})


.controller('viewSurgeryCtrl', function ($scope, $state, $stateParams, utils, Ehrscape, $rootScope) {
    utils.showLoading();

    var surgeryID = $stateParams.id;

    $scope.surgery = $rootScope.surgeries[surgeryID];

    utils.hideLoading();
})

.controller('exportDataCtrl', function ($scope, $state, utils, Notes, User, Careplan, Ehrscape, $filter, $rootScope) {
    utils.showLoading();

    $scope.data = [];
    $scope.data.notes = true;
    $scope.data.careplan = false;
    $scope.data.diagnosis = false;
    $scope.data.surgeries = false;
    $scope.data.medications = false;
    $scope.data.allergies = false;

    $scope.goBack = function(){
        $state.go("main");
    }

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Ehrscape.setSessionId($rootScope.sessionId);
            Ehrscape.setEhrId($rootScope.ehrId);

            Promise.all([Notes.getNotes(user.uid).then(function(snapshot){return snapshot.val();}), Careplan.getCareplan(user.uid).then(function(snapshot){return snapshot.val();}), Ehrscape.getPatientDiagnosis().then(function(res){return res.data.resultSet;}), Ehrscape.getPatientSurgeries().then(function(res){return res.data.resultSet;}), Ehrscape.getPatientMedications().then(function(res){return res.data.resultSet;}), Ehrscape.getPatientAllergies().then(function(res){return res.data.resultSet;})]).then(function(results) {

                $scope.notes = results[0];
                $scope.careplan = results[1];
                $scope.diagnosis = results[2];
                $scope.surgeries = results[3];
                $scope.medications = results[4];
                $scope.allergies = results[5];

                console.log(results);

                utils.hideLoading();
            }, function(err) {
                alert(err);
                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.export = function(){
        utils.showLoading();

        var htmlStart = "<html><head></head><body>";
        var htmlEnd = "</body></html>";
        var htmlInner = "<h2 style='text-decoration:underline;text-align:center;'>What's The Plan - Export Data</h2>";

        if(!$scope.data.notes && !$scope.data.careplan && !$scope.data.diagnosis && !$scope.data.surgeries && !$scope.data.medications && !$scope.data.allergies){
            alert("Please select at least one");
            return;
        }

        if($scope.data.notes){
            var notesHtml = "<h3 style='text-decoration:underline;'>Consultation Notes</h3>";
            for(var key in $scope.notes){
                $scope.notes[key].notes = $scope.notes[key].notes.replace(/(?:\r\n|\r|\n)/g, '<br>');

                var note = "<div>";
                note = note + "<p><span style='font-weight:bold'>Title: </span>" + $scope.notes[key].title + "</p>";
                note = note + "<p><span style='font-weight:bold'>Date/Time: </span>" + $scope.notes[key].datetime + "</p>";
                note = note + "<p><span style='font-weight:bold'>Consultant: </span>" + $scope.notes[key].consultant + "</p>";
                note = note + "<p><span style='font-weight:bold'>Location: </span>" + $scope.notes[key].location + "</p>";
                note = note + "<p><span style='font-weight:bold'>Notes: </span><br>" + $scope.notes[key].notes + "</p>";
                note = note + "</div><br>"

                notesHtml = notesHtml + note;
            }

            htmlInner = htmlInner + notesHtml;
        }

        if($scope.data.careplan){
            $scope.careplan.careplan = $scope.careplan.careplan.replace(/(?:\r\n|\r|\n)/g, '<br>');

            var careplanHtml = "<h3 style='text-decoration:underline;'>Careplan</h3>";
            careplanHtml = careplanHtml + "<div><p><span style='font-weight:bold'>Date/Time: </span>" + $scope.careplan.datetime + "</p>";
            careplanHtml = careplanHtml + "<p>" + $scope.careplan.careplan + "</p></div>";

            htmlInner = htmlInner + careplanHtml;
        }

        if($scope.data.diagnosis){
            var diagnosisHtml = "<h3 style='text-decoration:underline;'>Diagnosis</h3>";
            for(var key in $scope.diagnosis){
                var datetime = $scope.diagnosis[key].onset_date;
                $scope.diagnosis[key].datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');

                var diagnosis = "<div>";
                diagnosis = diagnosis + "<p><span style='font-weight:bold'>Problem: </span>" + $scope.diagnosis[key].problem + "</p>";
                diagnosis = diagnosis + "<p><span style='font-weight:bold'>Diagnosed on: </span>" + $scope.diagnosis[key].datetime + "</p>";
                diagnosis = diagnosis + "<p><span style='font-weight:bold'>Author: </span>" + $scope.diagnosis[key].author + "</p>";
                diagnosis = diagnosis + "</div><br>"

                diagnosisHtml = diagnosisHtml + diagnosis;
            }

            htmlInner = htmlInner + diagnosisHtml;
        }

        if($scope.data.surgeries){
            var surgeriesHtml = "<h3 style='text-decoration:underline;'>Surgeries</h3>";
            for(var key in $scope.surgeries){
                var datetime = $scope.surgeries[key].procedure_datetime;
                $scope.surgeries[key].datetime = $filter('date')(datetime, 'hh:mm a - dd MMM yyyy');

                var surgery = "<div>";
                surgery = surgery + "<p><span style='font-weight:bold'>Surgery Name: </span>" + $scope.surgeries[key].procedure_name + "</p>";
                surgery = surgery + "<p><span style='font-weight:bold'>Surgery Date/Time: </span>" + $scope.surgeries[key].datetime + "</p>";
                surgery = surgery + "<p><span style='font-weight:bold'>Performer: </span>" + $scope.surgeries[key].performer + "</p>";
                surgery = surgery + "<p><span style='font-weight:bold'>Procedure Notes: </span>" + $scope.surgeries[key].procedure_notes + "</p>";
                surgery = surgery + "<p><span style='font-weight:bold'>Procedure Step: </span>" + $scope.surgeries[key].procedure_step + "</p>";
                surgery = surgery + "</div><br>"

                surgeriesHtml = surgeriesHtml + surgery;
            }

            htmlInner = htmlInner + surgeriesHtml;
        }

        if($scope.data.medications){
            var medicationsHtml = "<h3 style='text-decoration:underline;'>Medications</h3>";
            for(var key in $scope.medications){
                var medication = "<div>";
                medication = medication + "<p><span style='font-weight:bold'>Medication: </span>" + $scope.medications[key].Medication_item + "</p>";
                medication = medication + "<p><span style='font-weight:bold'>Status: </span>" + $scope.medications[key].Course_status + "</p>";
                medication = medication + "<p><span style='font-weight:bold'>Clinical Indication: </span>" + $scope.medications[key].Clinical_indication + "</p>";
                medication = medication + "<p><span style='font-weight:bold'>Overall Directions: </span>" + $scope.medications[key].Overall_directions_description + "</p>";
                medication = medication + "<p><span style='font-weight:bold'>Additional Instructions: </span>" + $scope.medications[key].Additional_instruction + "</p>";
                medication = medication + "</div><br>"

                medicationsHtml = medicationsHtml + medication;
            }

            htmlInner = htmlInner + medicationsHtml;
        }

        if($scope.data.allergies){
            var allergiesHtml = "<h3 style='text-decoration:underline;'>Allergies</h3>";
            for(var key in $scope.allergies){
                var allergy = "<div>";
                allergy = allergy + "<p><span style='font-weight:bold'>Allergen: </span>" + $scope.allergies[key].Causative_agent + "</p>";
                allergy = allergy + "<p><span style='font-weight:bold'>Symptoms: </span>" + $scope.allergies[key].Manifestation + "</p>";
                allergy = allergy + "</div><br>"

                allergiesHtml = allergiesHtml + allergy;
            }

            htmlInner = htmlInner + allergiesHtml;
        }

        var htmlOutput = htmlStart + htmlInner + htmlEnd;
        //console.log(htmlOutput);

        if($rootScope.exportSupported) {
            cordova.plugins.printer.print(htmlOutput, 'WhatsThePlan');
            utils.hideLoading();
            $state.go("main");
        } else {
            alert("Exporting is not available on device");
            utils.hideLoading();
            $state.go("main");
        }
    }
})
