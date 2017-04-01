describe('User Service (Firebase)', function(){
    var User;
    //authentic user details
    var email = "test@test.test";
    var password = "testtest";

    //fixtures
    var uid = '0000000001';
    var nhsNumber = '5675675677';
    var fullName = 'Unit Test';
    var dateOfBirth = '11-11-1911';
    var gender = 'Male';
    var gpName = 'Dr Unit';
    var gpSurgery = 'Dr Unit';
    var maritalStatus = 'Single';
    var nationality = 'Unit';

    beforeEach(module('app.services', 'firebase'));

    beforeEach(inject(function (_User_) {
        User = _User_;
    }));

    beforeEach(function(done){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            console.info("User Service authenticated with firebase!");
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
        expect(User).toBeDefined();
    });

    it('can correctly create a test user', function(done) {
        inject(function(User) {
            User.createUser(uid, fullName, gender, dateOfBirth, nationality, maritalStatus, nhsNumber, gpName, gpSurgery);
            setTimeout(function() {
                User.getUser(uid).then(function(snapshot) {
                    var user = snapshot.val();
                    expect(user).not.toBeNull();
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly retrieve test user NHS number', function(done) {
        inject(function(User) {
            User.getUser(uid).then(function(snapshot) {
                var user = snapshot.val();
                if(user==null){
                    expect(user).not.toBeNull();
                    done();
                }else{
                    var nhsNumberTest = user.nhsNumber;
                    expect(nhsNumberTest).toEqual(nhsNumber);
                    done();
                }
            });
        });
    });

    it('can correctly retrieve test user full name', function(done) {
        inject(function(User) {
            User.getUser(uid).then(function(snapshot) {
                var user = snapshot.val();
                if(user==null){
                    expect(user).not.toBeNull();
                    done();
                }else{
                    var fullNameTest = user.fullName;
                    expect(fullNameTest).toEqual(fullName);
                    done();
                }
            });
        });
    });


    it('can correctly remove a test user', function(done) {
        inject(function(User) {
            User.removeUser(uid);

            setTimeout(function() {
                User.getUser(uid).then(function(snapshot) {
                    var user = snapshot.val();
                    expect(user).toBeNull();
                    done();
                });
            }, 1000);
        });
    });
});
