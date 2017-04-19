describe('Validater Service', function(){
    var validater;

    beforeEach(module('app.services'));

    beforeEach(inject(function (_validater_) {
        validater = _validater_;
    }));

    it('expect test to run', function() {
      expect(true).toBe(true);
    });

    it('should exist', function() {
        expect(validater).toBeDefined();
    });

    it('can correctly validate login - invalid email', function() {
        var validation = validater.validateLogin("notanemail", "test");
        expect(validation.email).not.toBeNull();
    });

    it('can correctly validate login - empty password', function() {
        var validation = validater.validateLogin("test@test.test", null);
        expect(validation.password).not.toBeNull();
    });

    it('can correctly validate login - valid details', function() {
        var validation = validater.validateLogin("test@test.test", "test");
        expect(validation).not.toBeDefined();
    });

    it('can correctly validate signup - invalid details', function() {
        var validation = validater.validateSignup("email", "password", "confirmPassword", "fullName", "gender", "nationality", "maritalStatus", "nhsNumber", "gpName", "gpSurgery");
        expect(validation).toBeDefined();
    });

    it('can correctly validate signup - invalid NHS number', function() {
        var validation = validater.validateSignup("test@test.test", "password", "password", "fullName", "Male", "nationality", "maritalStatus", "0000", "gpName", "gpSurgery");
        expect(validation).toBeDefined();
    });

    it('can correctly validate signup - valid details', function() {
        var validation = validater.validateSignup("test@test.test", "password", "password", "fullName", "Male", "nationality", "maritalStatus", "0000000000", "gpName", "gpSurgery");
        expect(validation).not.toBeDefined();
    });

    it('can correctly validate profile - invalid details', function() {
        var validation = validater.validateProfile("fullName", "gender", "dateOfBirth", "nationality", "maritalStatus", "gpName", "gpSurgery");
        expect(validation).toBeDefined();
    });

    it('can correctly validate profile - valid details', function() {
        var validation = validater.validateProfile("fullName", "Male", "12-06-2014", "nationality", "maritalStatus", "gpName", "gpSurgery");
        expect(validation).not.toBeDefined();
    });

    it('can correctly validate notes - invalid fields', function() {
        var validation = validater.validateNote("title", "consultant", null, "datetime", "notes");
        expect(validation).toBeDefined();
    });

    it('can correctly validate notes - valid fields', function() {
        var validation = validater.validateNote("title", "consultant", "location", "12-07-2014 5:00 pm", "notes");
        expect(validation).not.toBeDefined();
    });

    it('can correctly validate appointments - invalid fields', function() {
        var validation = validater.validateAppointment("locationNow",null,345435,null,"doctorNow",50,45);
        expect(validation).toBeDefined();
    });

    it('can correctly validate appointments - valid fields', function() {
        var validation = validater.validateAppointment("locationNow","12-05-2011 6:00 am",345435,"descriptionNow","doctorNow",50,45);
        expect(validation).not.toBeDefined();
    });

    it('can correctly validate contacts - invalid fields', function() {
        var validation = validater.validateContact("full_name", "role", "email", null, "address", "note");
        expect(validation).toBeDefined();
    });

    it('can correctly validate contacts - valid fields', function() {
        var validation = validater.validateContact("test test", "role", "test@test.test", "012-1212-122", "address", "note");
        expect(validation).not.toBeDefined();
    });

    it('can correctly validate reminders - invalid fields', function() {
        var validation = validater.validateReminder("medication", null, "datetime", "none");
        expect(validation).toBeDefined();
    });

    it('can correctly validate reminders - valid fields', function() {
        var validation = validater.validateReminder("medication", "dosage", "17-01-2017 2:30 pm", "day");
        expect(validation).not.toBeDefined();
    });
});
