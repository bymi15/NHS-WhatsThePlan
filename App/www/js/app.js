angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.directives','app.services', 'firebase', 'ion-datetime-picker', 'underscore'])

.config(function($ionicConfigProvider, $sceDelegateProvider){


  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

  $ionicConfigProvider.backButton.previousTitleText(false).text('');

})

.run(function($ionicPlatform, $state, $rootScope) {
  $rootScope.notificationSupported = false;

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.cordova && window.cordova.plugins.notification) {
      alert("notifications are supported by this device!");

      $rootScope.notificationSupported = true;

      // Set default options.
      cordova.plugins.notification.local.setDefaults({
        autoCancel: false,
        badge: 1
      });

      // Ask for permission to display notifications.
      cordova.plugins.notification.local.registerPermission();


      if(device.platform === "iOS") {
        window.plugin.notification.local.promptForPermission();
      }

      // Listen for click event.
      cordova.plugins.notification.local.on('click', function (notification, state) {

      });

      // Listen for trigger event.
      cordova.plugins.notification.local.on('trigger', function (notification, state) {

      });

      // Listen for schedule event.
      cordova.plugins.notification.local.on('schedule', function (notification, state) {
        alert("scheduled: " + notification.id);
      });

      // To add a notification.
      cordova.plugins.notification.local.schedule({
        id: 1,
        title: "hello",
        text: "suppppppppp",
        at: new Date()
      });

    }
  });

  //stateChange event
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    firebase.auth().onAuthStateChanged(function(user) {
      if (toState.authRequired && !user){
          // User is not authenticated
          $state.transitionTo("login");
          event.preventDefault();
      }
    });
  });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });

      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});
