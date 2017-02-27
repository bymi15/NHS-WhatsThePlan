

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
            // user successfully registered
            utils.hideLoading();
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
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
        dateOfBirth = $filter('date')(dateOfBirth, 'dd/MM/yyyy');

        var nationality = $scope.data.nationality;
        var maritalStatus = $scope.data.maritalStatus;
        var nhsNumber = $scope.data.nhsNumber;
        var gpName = $scope.data.gpName;
        var gpSurgery = $scope.data.gpSurgery;


        utils.showLoading();
        var validation = validater.validateSignup(email, password, confirmPassword);
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







.controller('appointmentsCtrl', function ($scope, $state, utils, User,$filter ,$ionicHistory , Appointment,$firebaseArray,$ionicModal,$ionicPopup) {
   // utils.showLoading();


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
}
$scope.showPopup=function(){
      alert('alertpopup');
     var alertPopup=$ionicPopup.alert({
       title:'hey',
       templateUrl:'templates/mymodal.html'
     });
      alertPopup.then(function(res){
        console.log('popup');

      });

}



 var toggle_visibility = function(id) {
       var e = document.getElementsByName(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
    }

    $scope.giveAlert = function(){
        window.alert("sometext");
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

var ref = firebase.database().ref("appointments");
 $scope.appointments = $firebaseArray(ref);

   
   
$scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
   
})


.controller('bookappointmentCtrl', function ($scope, $state, utils, User,$filter ,$ionicHistory ,Appointment,$ionicLoading) {
   // utils.showLoading();
   //MAPS



   $scope.getCurrentU = function(){
     return firebase.auth().currentUser.uid;
     console.log(firebase.auth().currentUser.uid);
   }
var map = new google.maps.Map(document.getElementById('map-canvas'),{
    center:{
      lat:27.72,
      lng:85.36
    },
    zoom:15
  });

  var marker = new google.maps.Marker({
    position:{
      lat:27.72,
      lng:85.36
    },map:map
  });
  var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
  google.maps.event.addListener(searchBox,'places_changed',function(){
    var places = searchBox.getPlaces();

    var bounds =new google.maps.LatLngBounds();

    var i,place;
    for(i=0;place=places[i];i++){
      bounds.extend(place.geometry.location);
      marker.setPosition(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(15);
  });
  
google.maps.event.addListener(marker, 'dragend', function (event) {
    document.getElementById("latbox").value = this.getPosition().lat();
    document.getElementById("lngbox").value = this.getPosition().lng();
    console.log("Numerot 1"+this.getPosition().lat());
});



//FINISH MAPS
   $scope.submit = function(){
    var dateNow = $scope.thisDate;
    var locationNow = "a";
    var timeNow = $scope.thisTime;
    var descriptionNow = $scope.thisDescription;
    var doctorNow = $scope.thisDoctor;
    dateNow = $filter('date')(dateNow, 'dd/MM/yyyy');
    timeNow = $filter('date')(timeNow,'HH:MM');
   console.log(dateNow +  descriptionNow + timeNow + locationNow );

   console.log(marker.getPosition().lat());
    console.log(marker.getPosition().lng());
   var markerX = marker.getPosition().lat();
   var markerY = marker.getPosition().lng();
   Appointment.createAppointment(firebase.auth().currentUser.uid,"Term6",locationNow,timeNow,dateNow,descriptionNow,doctorNow,markerX,markerY);
   





   }
   



$scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
   
})



.controller('MapCtrl', function ($scope, $state, utils, User) {
  var map = new google.maps.Map(document.getElementById('map-canvas'),{
    center:{
      lat:27.72,
      lng:85.36
    },
    zoom:15
  });

  var marker = new google.maps.Marker({
    position:{
      lat:27.72,
      lng:85.36
    },map:map
  });
  var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
  google.maps.event.addListener(searchBox,'places_changed',function(){
    var places = searchBox.getPlaces();

    var bounds =new google.maps.LatLngBounds();

    var i,place;
    for(i=0;place=places[i];i++){
      bounds.extend(place.geometry.location);
      marker.setPosition(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(15);
  });
  
google.maps.event.addListener(marker, 'dragend', function (event) {
    document.getElementById("latbox").value = this.getPosition().lat();
    document.getElementById("lngbox").value = this.getPosition().lng();
    console.log(this.getPosition().lat());
});

 /*
 var options = {timeout: 10000, enableHighAccuracy: true};
  var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

 /*
 
    var latLng = new google.maps.LatLng(37.3000, -120.4833);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };


 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
  google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });      
 
  var infoWindow = new google.maps.InfoWindow({
      content: "Here I am!"
  });
 
 google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
  });
 
});
  /*
var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
google.maps.event.addListener(searchBox, 'places_changed', function(){

  var places = searchBox.getPlaces();
  var bounds = new google.maps.LatLngBounds();

  var i,place;
  for(i=0;place=places[i];i++){
    bounds.extend(place.geometry.location);
    marker.setPosition(place.geometry.location);
  }

  map.fitBounds(bounds);
  map.setZoom(15);
})
*/
 /*
  var uluru = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });



        function saveData() {
  var name = escape(document.getElementById("name").value);
  var address = escape(document.getElementById("address").value);
  var type = document.getElementById("type").value;
  var latlng = marker.getPosition();
  var url = "phpsqlinfo_addrow.php?name=" + name + "&address=" + address +
            "&type=" + type + "&lat=" + latlng.lat() + "&lng=" + latlng.lng();

  downloadUrl(url, function(data, responseCode) {

    if (responseCode == 200 && data.length <= 1) {
      infowindow.close();
      messagewindow.open(map, marker);
    }
  });
}*/
      
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

