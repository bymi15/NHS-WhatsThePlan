describe('Care Team / Contacts Service (Firebase)', function(){
    var Careteam;
    //authentic user details
    var email = "test@test.test";
    var password = "testtest";

    //fixtures
    var contactID;
    var uid = '0000000001';
    var full_name = 'Unit Test';
    var role = 'Primary Carer';
    var email = 'unit@test.com';
    var phone_number = '0791231234';
    var address = 'Whiston Hospital';
    var note = 'Unit test note';

    var contactID2;
    var full_name2 = 'Unit Test 2';
    var role2 = 'Secondary Carer';
    var email2 = 'test@unittest.com';
    var phone_number2 = '0700000034';
    var address2 = 'UCLH';
    var note2 = 'Test unit note 2';

    beforeEach(module('app.services', 'firebase'));

    beforeEach(inject(function (_Careteam_) {
        Careteam = _Careteam_;
    }));

    beforeAll(function(done){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            firebase.database().ref('careteam/' + uid).remove();
            done();
        }).catch(function(error) {
            done();
        });
    });

    it('expect test to run', function() {
      expect(true).toBe(true);
    });

    it('should exist', function() {
        expect(Careteam).toBeDefined();
    });

    it('can correctly add a contact', function(done) {
        inject(function(Careteam) {
            Careteam.addContact(uid, full_name, role, email, phone_number, address, note);
            setTimeout(function() {
                Careteam.getContacts(uid).then(function(snapshot) {
                    var contactsObj = snapshot.val();

                    var keyArr = Object.keys(contactsObj);
                    var length = keyArr.length;
                    if(length >= 1){
                        contactID = keyArr[0];
                    }
                    expect(length).toEqual(1);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly add another contact', function(done) {
        inject(function(Careteam) {
            Careteam.addContact(uid, full_name2, role2, email2, phone_number2, address2, note2);
            setTimeout(function() {
                Careteam.getContacts(uid).then(function(snapshot) {
                    var contactsObj = snapshot.val();

                    var keyArr = Object.keys(contactsObj);
                    var length = keyArr.length;
                    if(length >= 1){
                        contactID2 = keyArr[1];
                    }

                    expect(length).toEqual(2);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly retrieve the care team', function(done) {
        inject(function(Careteam) {
            Careteam.getContacts(uid).then(function(snapshot) {
                var contactsObj = snapshot.val();

                if(contactsObj==null){
                    expect(contactsObj).not.toBeNull();
                    done();
                }else{
                    var contactsTest = contactsObj[contactID].full_name;
                    var contactsTest2 = contactsObj[contactID2].full_name;

                    expect(contactsTest === full_name && contactsTest2 === full_name2).toBeTruthy();
                    done();
                }
            });
        });
    });

    it('can correctly retrieve a single contact by id', function(done) {
        inject(function(Careteam) {
            Careteam.getContact(uid, contactID).then(function(snapshot) {
                var contactObj = snapshot.val();
                if(contactObj==null){
                    expect(contactObj).not.toBeNull();
                    done();
                }else{
                    var contactTest = contactObj.full_name;
                    expect(contactTest).toEqual(full_name);
                    done();
                }
            });
        });
    });

    it('can correctly remove a contact by id', function(done) {
        inject(function(Careteam) {
            Careteam.removeContact(uid, contactID);

            setTimeout(function() {
                Careteam.getContact(uid, contactID).then(function(snapshot) {
                    var contactObj = snapshot.val();
                    expect(contactObj).toBeNull();
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly modify a contact by id', function(done) {
        inject(function(Careteam) {
            Careteam.updateContact(uid, contactID2, full_name2, role2, email, phone_number2, address2, note2);
            setTimeout(function() {
                Careteam.getContact(uid, contactID2).then(function(snapshot) {
                    var contactObj = snapshot.val();
                    expect(contactObj.email).toEqual(email);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly remove another contact by id', function(done) {
        inject(function(Careteam) {
            Careteam.removeContact(uid, contactID2);

            setTimeout(function() {
                Careteam.getContact(uid, contactID2).then(function(snapshot) {
                    var contactObj = snapshot.val();
                    expect(contactObj).toBeNull();
                    done();
                });
            }, 1000);
        });
    });
});
