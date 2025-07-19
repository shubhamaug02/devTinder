const validator = require("validator");

function validateData(req) {
    const {firstName, lastName, emailId, password} = req;

    if(!firstName || !lastName) {
        throw new Error("Invalid Name !!!");
    }
    else if(firstName.length<4 || lastName.length>50){
        throw new Error("firstName length should be greater than 4 and less than 50");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email format");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password not strong, provide a strong one");
    }
}

function validateEditData(req) {
    const ALLOWED_EDITS_FIELD = ['firstName', 'lastName', 'skills', 'age', 'gender', 'about', 'imageUrl'];

    const isEditAllowed = Object.keys(req.body).every(key => ALLOWED_EDITS_FIELD.includes(key));

    return isEditAllowed;
}

function validateKeysForPasswordUpdate(req) {

    const NEEDED_FIELDS = ['oldPassword', 'password'];
    const requestKeys = Object.keys(req.body);
    
    const allNeededFieldsPresent = requestKeys.length === NEEDED_FIELDS.length && requestKeys.every(key => NEEDED_FIELDS.includes(key));

    return allNeededFieldsPresent;
}

function validatePasswordIsStrong(password) {
    return validator.isStrongPassword(password);
}


module.exports = {
    validateData,
    validateEditData,
    validateKeysForPasswordUpdate,
    validatePasswordIsStrong
}