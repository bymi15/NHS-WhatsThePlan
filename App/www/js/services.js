angular.module('app.services', ['firebase'])

.factory('User', [function(){

}])

// custom Auth factory that handles firebase user authentication
.factory('Auth', function($scope, $firebaseAuth, $firebaseArray){
    var ref = new Firebase("https://whatstheplan-47a75.firebaseio.com/");
    return {
        loginWithEmail: function login(userEmail, userPassword) {
          return auth.$authWithPassword({
                email: userEmail,
                password: userPassword
            });
        },
        createUser: function createUser(userEmail, userPassword) {
          return auth.$createUser({
                email: userEmail,
                password: userPassword
            });
        },
        removeUser: function removeUser(userEmail, userPassword) {
          return auth.$removeUser({
                email: userEmail,
                password: userPassword
            });
        },
        getAuth: function getAuth() {
            return auth.$getAuth();
        },
        logout: function logout() {
            auth.$unauth();
        },
        onAuth: function onLoggedIn(callback) {
          auth.$onAuth(function(authData) {
            $timeout(function() {
                callback(authData);
            });
          });
        }
    };
})

.service('BlankService', [function(){

}]);
