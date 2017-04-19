angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl',
    authRequired: true
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl',
    cache: false,
    authRequired: true
  })

  .state('editProfile', {
    url: '/editProfile',
    templateUrl: 'templates/editProfile.html',
    controller: 'editProfileCtrl',
    authRequired: true
  })

  .state('notes', {
    url: '/notes',
    templateUrl: 'templates/notes.html',
    controller: 'notesCtrl',
    cache: false,
    authRequired: true
  })

  .state('addNote', {
    url: '/addNote',
    templateUrl: 'templates/addNote.html',
    controller: 'addNotesCtrl',
    authRequired: true
  })

  .state('editNote', {
    url: '/editNote/:id',
    templateUrl: 'templates/editNote.html',
    controller: 'editNoteCtrl',
    authRequired: true
  })

  .state('viewNote', {
    url: '/viewNote/:id',
    templateUrl: 'templates/viewNote.html',
    controller: 'viewNoteCtrl',
    cache: false,
    authRequired: true
  })

  .state('appointments', {
    url: '/appointments',
    templateUrl: 'templates/appointments.html',
    controller: 'appointmentsCtrl',
    cache: false,
    authRequired: true
  })

  .state('bookAppointment', {
    url: '/bookAppointment',
    templateUrl: 'templates/bookAppointment.html',
    controller: 'bookAppointmentCtrl',
    authRequired: true
  })

  .state('careplanMenu', {
    url: '/careplanMenu',
    templateUrl: 'templates/careplanMenu.html',
    controller: 'careplanMenuCtrl',
    authRequired: true
  })

  .state('careteam', {
    url: '/careteam',
    templateUrl: 'templates/careteam.html',
    controller: 'careteamCtrl',
    cache: false,
    authRequired: true
  })

  .state('viewContact', {
    url: '/viewContact/:id',
    templateUrl: 'templates/viewContact.html',
    controller: 'viewContactCtrl',
    cache: false,
    authRequired: true
  })

  .state('addContact', {
    url: '/addContact',
    templateUrl: 'templates/addContact.html',
    controller: 'addContactCtrl',
    authRequired: true
  })

  .state('editContact', {
    url: '/editContact/:id',
    templateUrl: 'templates/editContact.html',
    controller: 'editContactCtrl',
    authRequired: true
  })

  .state('careplan', {
    url: '/careplan',
    templateUrl: 'templates/careplan.html',
    controller: 'careplanCtrl',
    cache: false,
    authRequired: true
  })

  .state('editCareplan', {
    url: '/editCareplan',
    templateUrl: 'templates/editCareplan.html',
    controller: 'editCareplanCtrl',
    cache: false,
    authRequired: true
  })

  .state('medicalRecords', {
    url: '/medicalRecords',
    templateUrl: 'templates/medicalRecords.html',
    controller: 'medicalRecordsCtrl',
    cache: true,
    authRequired: true
  })

  .state('allergies', {
    url: '/allergies',
    templateUrl: 'templates/allergies.html',
    controller: 'allergiesCtrl',
    cache: false,
    authRequired: true
  })

  .state('medicationsMenu', {
    url: '/medicationsMenu',
    templateUrl: 'templates/medicationsMenu.html',
    controller: 'medicationsMenuCtrl',
    cache: true,
    authRequired: true
  })

  .state('medications', {
    url: '/medications',
    templateUrl: 'templates/medications.html',
    controller: 'medicationsCtrl',
    cache: false,
    authRequired: true
  })

  .state('viewMedication', {
    url: '/viewMedication/:id',
    templateUrl: 'templates/viewMedication.html',
    controller: 'viewMedicationCtrl',
    cache: false,
    authRequired: true
  })

  .state('medicationReminder', {
    url: '/medicationReminder',
    templateUrl: 'templates/medicationReminder.html',
    controller: 'medicationReminderCtrl',
    cache: false,
    authRequired: true
  })

  .state('addReminder', {
    url: '/addReminder',
    templateUrl: 'templates/addReminder.html',
    controller: 'addReminderCtrl',
    cache: false,
    authRequired: true
  })

  .state('labTests', {
    url: '/labTests',
    templateUrl: 'templates/labTests.html',
    controller: 'labTestsCtrl',
    cache: false,
    authRequired: true
  })

  .state('viewLabTest', {
    url: '/viewLabTest/:id',
    templateUrl: 'templates/viewLabTest.html',
    controller: 'viewLabTestCtrl',
    cache: false,
    authRequired: true
  })

  .state('diagnosis', {
    url: '/diagnosis',
    templateUrl: 'templates/diagnosis.html',
    controller: 'diagnosisCtrl',
    cache: false,
    authRequired: true
  })

  .state('viewDiagnosis', {
    url: '/viewDiagnosis/:id',
    templateUrl: 'templates/viewDiagnosis.html',
    controller: 'viewDiagnosisCtrl',
    cache: false,
    authRequired: true
  })

  .state('surgeries', {
    url: '/surgeries',
    templateUrl: 'templates/surgeries.html',
    controller: 'surgeriesCtrl',
    cache: false,
    authRequired: true
  })

  .state('viewSurgery', {
    url: '/viewSurgery/:id',
    templateUrl: 'templates/viewSurgery.html',
    controller: 'viewSurgeryCtrl',
    cache: false,
    authRequired: true
  })

  .state('exportData', {
    url: '/exportData',
    templateUrl: 'templates/exportData.html',
    controller: 'exportDataCtrl',
    cache: false,
    authRequired: true
  })

  $urlRouterProvider.otherwise(function($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("main");
  });
});
