describe('Appointment Service (Firebase)', function(){
    var Appointment;
    //authentic user details
    var email = "test@test.test";
    var password = "testtest";

    //fixtures
    var uid = '0000000001';

    var appointmentID;
    var location = 'UCLH';
    var timestamp = '1487662740000';
    var description = 'Test Appointment 1';
    var doctor = 'Dr Unit Test';
    var markerX = '50';
    var markerY = '45';
    var datetime = '21-02-2017 07:39 AM';

    var appointmentID2;
    var location2 = 'Whiston Hospital';
    var timestamp2 = '1424526120000';
    var description2 = 'Test Appointment 2';
    var doctor2 = 'Dr Test Unit 2';
    var markerX2 = '35';
    var markerY2 = '87';
    var datetime2 = '21-02-2015 01:42 PM';

    beforeEach(module('app.services', 'firebase'));

    beforeEach(inject(function (_Appointment_) {
        Appointment = _Appointment_;
    }));

    beforeEach(function(done){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            done();
        }).catch(function(error) {
            console.info(error);
            done();
        });
    });

    beforeAll(function(done){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            firebase.database().ref('appointments/' + uid).remove();
            done();
        }).catch(function(error) {
            console.info(error);
            done();
        });
    });

    it('expect test to run', function() {
      expect(true).toBe(true);
    });

    it('should exist', function() {
        expect(Appointment).toBeDefined();
    });

    it('can correctly create an appointment', function(done) {
        inject(function(Appointment) {
            Appointment.createAppointment(uid,location,datetime,timestamp,description,doctor,markerX,markerY);

            setTimeout(function() {
                var appointments = [];
                Appointment.getAppointments(uid).once('value', function(snap){
                    snap.forEach(function(ss) {
                        appointments.push(ss.val());
                        if(appointmentID==null){
                            appointmentID = ss.key;
                        }
                    });

                    var keyArr = Object.keys(appointments);
                    var length = keyArr.length;

                    expect(length).toEqual(1);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly create another appointment', function(done) {
        inject(function(Appointment) {
            Appointment.createAppointment(uid,location2,datetime2,timestamp2,description2,doctor2,markerX2,markerY2);

            setTimeout(function() {
                var appointments = [];
                Appointment.getAppointments(uid).once('value', function(snap){
                    snap.forEach(function(ss) {
                        appointments.push(ss.val());
                        if(appointmentID2==null){
                            appointmentID2 = ss.key;
                        }
                    });

                    var keyArr = Object.keys(appointments);
                    var length = keyArr.length;

                    expect(length).toEqual(2);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly retrieve the appointments', function(done) {
        inject(function(Appointment) {
            var appointmentsObj = [];
            Appointment.getAppointments(uid).once('value', function(snap){
                snap.forEach(function(ss) {
                    appointmentsObj.push(ss.val());
                });

                if(appointmentsObj==null){
                    expect(appointmentsObj).not.toBeNull();
                    done();
                }else{
                    var descTest = appointmentsObj[0].description;
                    var descTest2 = appointmentsObj[1].description;

                    expect(descTest === description2 && descTest2 === description).toBeTruthy();
                    done();
                }
            });
        });
    });

    it('can correctly remove an appointment by id', function(done) {
        inject(function(Appointment) {
            Appointment.removeAppointment(uid, appointmentID);

            setTimeout(function() {
                var appointments = [];
                Appointment.getAppointments(uid).once('value', function(snap){
                    snap.forEach(function(ss) {
                        appointments.push(ss.val());
                    });

                    var keyArr = Object.keys(appointments);
                    var length = keyArr.length;

                    expect(length).toEqual(1);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly remove another appointment by id', function(done) {
        inject(function(Appointment) {
            Appointment.removeAppointment(uid, appointmentID2);

            setTimeout(function() {
                var appointments = [];
                Appointment.getAppointments(uid).once('value', function(snap){
                    snap.forEach(function(ss) {
                        appointments.push(ss.val());
                    });

                    var keyArr = Object.keys(appointments);
                    var length = keyArr.length;

                    expect(length).toEqual(0);
                    done();
                });
            }, 1000);
        });
    });

    /*it('can correctly remove old appointments', function(done) {
        inject(function(Appointment) {
            Appointment.removeOldAppointments(uid, 1);

            setTimeout(function() {
                var appointments = [];
                Appointment.getAppointments(uid).once('value', function(snap){
                    snap.forEach(function(ss) {
                        appointments.push(ss.val());
                    });

                    var keyArr = Object.keys(appointments);
                    var length = keyArr.length;

                    expect(length).toEqual(0);
                    done();
                });
            }, 1000);
        });
    });*/
});
