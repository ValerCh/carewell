const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = {
    validateClockIn(data) {
        let errors = {};

        return {
            errors,
            isValid: isEmpty(errors)
        };
    },

    validateClockOut(data) {
        let errors = {};

        return {
            errors,
            isValid: isEmpty(errors)
        };
    }
};