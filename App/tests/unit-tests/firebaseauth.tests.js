describe('Firebase Auth', function(){
    //fixtures
    var email = 'unit@test.com';
    var password = 'unittest';

    var invalidEmail = 'asddo@asdasd.asdasd';
    var invalidPassword = 'asdasdasdasd';

    beforeEach(module('app.services', 'firebase'));

    it('expect test to run', function() {
      expect(true).toBe(true);
    });

    it('can correctly create a test user', function(done) {
        inject(function(User) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(res){
                expect(res.uid).not.toBeNull();
                done();
            });
        });
    });

    it('can correctly authenticate a test user', function(done) {
        inject(function(User) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
                expect(true).toBe(true);
                done();
            }).catch(function(error) {
                expect(false).toBe(true);
                done();
            });
        });
    });

    it('can deny access to an invalid user', function(done) {
        inject(function(User) {
            firebase.auth().signInWithEmailAndPassword(invalidEmail, invalidPassword).then(function(){
                expect(false).toBe(true);
                done();
            }).catch(function(error) {
                expect(true).toBe(true);
                done();
            });
        });
    });

    it('can deny access to a valid user but invalid password', function(done) {
        inject(function(User) {
            firebase.auth().signInWithEmailAndPassword(email, invalidPassword).then(function(){
                expect(false).toBe(true);
                done();
            }).catch(function(error) {
                expect(true).toBe(true);
                done();
            });
        });
    });

    it('can correctly remove a test user', function(done) {
        inject(function(User) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
                var user = firebase.auth().currentUser;
                user.delete().then(function() {
                    expect(true).toBe(true);
                    done();
                }, function(error) {
                    expect(false).toBe(true);
                    done();
                });
            });
        });
    });
});
