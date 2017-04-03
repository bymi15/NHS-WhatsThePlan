describe('Careplan Service (Firebase)', function(){
    var Careplan;
    //authentic user details
    var email = "test@test.test";
    var password = "testtest";

    //fixtures
    var uid = '0000000001';
    var careplan = 'test care plan 1';
    var datetime = '21-02-2017 04:34 AM'

    var careplan2 = 'test care plan 2 blah blah';
    var datetime2 = '21-02-2017 02:30 PM'

    beforeEach(module('app.services', 'firebase'));

    beforeEach(inject(function (_Careplan_) {
        Careplan = _Careplan_;
    }));

    beforeAll(function(done){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            firebase.database().ref('careplan/' + uid).remove();
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
        expect(Careplan).toBeDefined();
    });

    it('can correctly enter a care plan', function(done) {
        inject(function(Careplan) {
            Careplan.saveCareplan(uid, datetime, careplan);

            setTimeout(function() {
                Careplan.getCareplan(uid).then(function(snapshot) {
                    var careplanObj = snapshot.val();
                    expect(careplanObj.careplan).toEqual(careplan);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly modify a care plan', function(done) {
        inject(function(Careplan) {
            Careplan.saveCareplan(uid, datetime2, careplan2);

            setTimeout(function() {
                Careplan.getCareplan(uid).then(function(snapshot) {
                    var careplanObj = snapshot.val();
                    expect(careplanObj.careplan).toEqual(careplan2);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly retrieve a care plan', function(done) {
        inject(function(Careplan) {
            Careplan.getCareplan(uid).then(function(snapshot) {
                var careplanObj = snapshot.val();
                expect(careplanObj.careplan).toEqual(careplan2);
                done();
            });
        });
    });
});
