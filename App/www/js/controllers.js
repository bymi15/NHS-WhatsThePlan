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
        var validation = validater.validateSignup(email, password, confirmPassword, fullName, gender, dateOfBirth, nationality, maritalStatus, nhsNumber, gpName, gpSurgery);

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
            }else if(validation.dateOfBirth){
                utils.showAlert('Error!', validation.dateOfBirth);
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

            //create a new ehr
            //Ehrscape.post()

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

.controller('mainCtrl', function ($scope, $state, User) {
    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            $state.go("login");
        }
    });

    $scope.logout = function(){
        firebase.auth().signOut();

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

.controller('appointmentsCtrl', function ($scope, $state, utils, User, $filter,$ionicHistory, Appointment, $ionicModal, $ionicPopup,sharedProperties) {

    utils.showLoading();
$scope.alea = sharedProperties.getLocation();
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

/*
    $ionicModal.fromTemplateUrl('user_photo.html', { // Use Ionic Modal to show user photo
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.showUser = function (user, event){
        if (event){
          event.stopPropagation(); //to prevent calling of showUser() and showPop() functions at same time
        }
        $scope.current_user = user;
        $scope.openModal();
    }*/
    $scope.createClass = function(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule) 
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name+"{"+rules+"}",0);
}

$scope.say = function(){
    console.log("2222");
}




  //$scope.createClass('.GQ',"color: green;width:90%;height:1%;");
  $scope.createClass('.popup',"min-width: 80%;height: 80%;background-color: transparent;border-style: solid;");
  $scope.createClass('.popup-body',"overflow:inherit; text-align:center;position:relative;background-color: #387EF5;height:30em;border-style: solid;border:1px black;");
  $scope.createClass('.popup-head',"background-color: #387EF5;display:none;border-style: solid;");
    $scope.createClass('.popup-sub-title',"background-color: #387EF5;border-style: solid;");
      $scope.createClass('.popup-buttons',"background-color: #387EF5;color:#387EF5;border-style: solid;");
        $scope.createClass('.popup-buttons.row ',"background-color: transparent;display:none;");
    $scope.createClass('.popup-footer',"background-color: #387EF5;display:none;");
   
$scope.getItem = function(item)
{
    
   sharedProperties.setMarkerX(item.markerX);
   sharedProperties.setMarkerY(item.markerY);
   sharedProperties.setLocation(item.location);
   console.log(item.location);
}

    $scope.showPopup=function(item){
        console.log(item);
       
        console.log(item.markerY);
        console.log("jh");
   console.log(item.markerX);
  sharedProperties.setMarkerX(item.markerX);
  console.log(sharedProperties.getMarkerX());
       console.log("kks");

  console.log("kks");
   sharedProperties.setMarkerY(item.markerY);
   sharedProperties.setLocation(item.location);
  
    
     console.log(sharedProperties.getMarkerY());
       console.log("kks");
     console.log(sharedProperties.getLocation());
       console.log("kks");
    ;
        
        //console.log($scope.value.location);
                var alertPopup=$ionicPopup.alert({
           
             templateUrl:'templates/mymodal.html',
             cssClass: 'popup'
        });
           alertPopup.then(function(res){
            console.log('popup');
        });
           $scope.alertPopup = alertPopup;
    }

$scope.closePopup = function(){
    
    console.log("Should be closed");

    
}   ;
    var toggle_visibility = function(id) {
       var e = document.getElementsByName(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
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

.controller('bookAppointmentCtrl', function ($scope, $state, utils, User,$filter, $ionicHistory, Appointment, $ionicLoading,sharedProperties) {
 $scope.data = {};
$scope.data.newLocation = "aaa";
$scope.newLocation = sharedProperties.getLocation();
$scope.newMarkerX = sharedProperties.getMarkerX();
$scope.newMarkerY = sharedProperties.getMarkerY();
$scope.updateLocation = function(){
        $scope.newLocation = sharedProperties.getLocation(); 
        $scope.newMarkerX = sharedProperties.getMarkerX();
        $scope.newMarkerY = sharedProperties.getMarkerY(); 
}

$scope.say = function(){
    console.log("2222");
}
   

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
            var dateNow = $scope.data.thisDate;
            var locationNow = document.getElementById('thisLocation').value;
            var timeNow = $scope.data.thisTime;
            var descriptionNow = $scope.data.thisDescription;
            var doctorNow = $scope.data.thisDoctor;
            dateNow = $filter('date')(dateNow, 'dd/MM/yyyy');
            timeNow = $filter('date')(timeNow,'hh:MM a');

            var markerX = marker.getPosition().lat();
            var markerY = marker.getPosition().lng();

            Appointment.createAppointment(uid,locationNow,timeNow,dateNow,descriptionNow,doctorNow,markerX,markerY);

            utils.hideLoading();
            $state.go("appointments");
        }else{
            $state.go("login");
        }
    }
})


.controller('careplanCtrl', function ($scope, $state, utils, Careplan) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careplan.getCareplan(user.uid).then(function(snapshot) {
                $scope.careplan = snapshot.val();

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });

    $scope.editCareplan = function(){
        utils.showLoading();

        var user = firebase.auth().currentUser;

        if (user != null) {
            var uid = user.uid;
            var dateNow = $scope.thisDate;
            var locationNow = document.getElementById('thisLocation').value;
            var timeNow = $scope.thisTime;
            var descriptionNow = $scope.thisDescription;
            var doctorNow = $scope.thisDoctor;
            dateNow = $filter('date')(dateNow, 'dd/MM/yyyy');
            timeNow = $filter('date')(timeNow,'hh:MM a');

            var markerX = marker.getPosition().lat();
            var markerY = marker.getPosition().lng();

            Appointment.createAppointment(uid, locationNow,timeNow,dateNow,descriptionNow,doctorNow,markerX,markerY);

            utils.hideLoading();
        }else{
            $state.go("login");
        }
    }
})

.controller('editCareplanCtrl', function ($scope, $state, utils, Careplan) {
    utils.showLoading();

    $scope.data = {};

    //Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Careplan.getCareplan(user.uid).then(function(snapshot) {
                $scope.careplan = snapshot.val();

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
            var dateNow = $scope.thisDate;
            var locationNow = document.getElementById('thisLocation').value;
            var timeNow = $scope.thisTime;
            var descriptionNow = $scope.thisDescription;
            var doctorNow = $scope.thisDoctor;
            dateNow = $filter('date')(dateNow, 'dd/MM/yyyy');
            timeNow = $filter('date')(timeNow,'hh:MM a');

            var markerX = marker.getPosition().lat();
            var markerY = marker.getPosition().lng();

            Appointment.createAppointment(uid, locationNow,timeNow,dateNow,descriptionNow,doctorNow,markerX,markerY);

            utils.hideLoading();
        }else{
            $state.go("login");
        }
    }
})

