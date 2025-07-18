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

module.exports = {
    validateData
}