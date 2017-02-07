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

.controller('signupCtrl', function ($scope, $ionicHistory, $ionicSlideBoxDelegate, $state, utils, validater, User, $filter) {
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

    $scope.goViewNote = function(val){
        console.log(val + " <<,");
        $state.go('viewNote', { id: val });
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

                utils.hideLoading();
            });
        }else{
            $state.go("login");
        }
    });
})

