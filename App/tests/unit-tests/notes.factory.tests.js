describe('Notes Service (Firebase)', function(){
    var Notes;
    //authentic user details
    var email = "test@test.test";
    var password = "testtest";

    //fixtures
    var noteID;
    var uid = '0000000001';
    var title = 'Test Consultation Notes';
    var consultant = 'Dr Test';
    var location = 'UCLH';
    var datetime = '21-02-2017 04:34 AM'
    var notes = 'Unit test notes';

    var noteID2;
    var title2 = 'Test Consultation Notes 2';
    var consultant2 = 'Dr Test 2';
    var location2 = 'Test Hospital';
    var datetime2 = '21-02-2016 02:30 PM'
    var notes2 = 'Unit test notes 2';

    beforeEach(module('app.services', 'firebase'));

    beforeEach(inject(function (_Notes_) {
        Notes = _Notes_;
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
            firebase.database().ref('notes/' + uid).remove();
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
        expect(Notes).toBeDefined();
    });

    it('can correctly create a consultation note', function(done) {
        inject(function(Notes) {
            Notes.addNote(uid, title, consultant, location, datetime, notes);
            setTimeout(function() {
                Notes.getNotes(uid).then(function(snapshot) {
                    var notesObj = snapshot.val();

                    var keyArr = Object.keys(notesObj);
                    var length = keyArr.length;
                    if(length >= 1){
                        noteID = keyArr[0];
                    }
                    expect(length).toEqual(1);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly create another consultation note', function(done) {
        inject(function(Notes) {
            Notes.addNote(uid, title2, consultant2, location2, datetime2, notes2);
            setTimeout(function() {
                Notes.getNotes(uid).then(function(snapshot) {
                    var notesObj = snapshot.val();

                    var keyArr = Object.keys(notesObj);
                    var length = keyArr.length;
                    if(length >= 1){
                        noteID2 = keyArr[1];
                    }

                    expect(length).toEqual(2);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly retrieve the consultation notes', function(done) {
        inject(function(Notes) {
            Notes.getNotes(uid).then(function(snapshot) {
                var notesObj = snapshot.val();

                if(notesObj==null){
                    expect(notesObj).not.toBeNull();
                    done();
                }else{
                    var notesTest = notesObj[noteID].notes;
                    var notesTest2 = notesObj[noteID2].notes;

                    expect(notesTest === notes && notesTest2 === notes2).toBeTruthy();
                    done();
                }
            });
        });
    });

    it('can correctly retrieve a single consultation note by id', function(done) {
        inject(function(Notes) {
            Notes.getNote(uid, noteID).then(function(snapshot) {
                var noteObj = snapshot.val();
                if(noteObj==null){
                    expect(noteObj).not.toBeNull();
                    done();
                }else{
                    var noteTest = noteObj.notes;
                    expect(noteTest).toEqual(notes);
                    done();
                }
            });
        });
    });

    it('can correctly remove a consultation note by id', function(done) {
        inject(function(Notes) {
            Notes.removeNote(uid, noteID);

            setTimeout(function() {
                Notes.getNote(uid, noteID).then(function(snapshot) {
                    var noteObj = snapshot.val();
                    expect(noteObj).toBeNull();
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly modify a consultation note by id', function(done) {
        inject(function(Notes) {
            Notes.updateNote(uid, noteID2, title2, consultant2, location2, datetime, notes2);
            setTimeout(function() {
                Notes.getNote(uid, noteID2).then(function(snapshot) {
                    var noteObj = snapshot.val();
                    expect(noteObj.datetime).toEqual(datetime);
                    done();
                });
            }, 1000);
        });
    });

    it('can correctly remove another consultation note by id', function(done) {
        inject(function(Notes) {
            Notes.removeNote(uid, noteID2);

            setTimeout(function() {
                Notes.getNotes(uid).then(function(snapshot) {
                    var notesObj = snapshot.val();

                    expect(notesObj).toBeNull();
                    done();
                });
            }, 1000);
        });
    });
});
