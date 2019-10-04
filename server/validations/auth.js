const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = {
    validateRegisterInput(data) {
        let errors = {};

        // Convert empty fields to an empty string so we can use validator functions
        data.username = !isEmpty(data.username) ? data.username : "";
        data.password = !isEmpty(data.password) ? data.password : "";
        data.password2 = !isEmpty(data.password2) ? data.password2 : "";

        if (Validator.isEmpty(data.role_id)) {
            errors.role_id = "Role id field is required";
        }

        // Name checks
        if (Validator.isEmpty(data.username)) {
            errors.username = "Name field is required";
        }

        // Password checks
        if (Validator.isEmpty(data.password)) {
            errors.password = "Password field is required";
        }

        if (Validator.isEmpty(data.password2)) {
            errors.password2 = "Confirm password field is required";
        }

        if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
            errors.password = "Password must be at least 6 characters";
        }

        if (!Validator.equals(data.password, data.password2)) {
            errors.password2 = "Passwords must match";
        }

        return {
            errors,
            isValid: isEmpty(errors)
        };
    },

    validateLoginInput(data) {
        let errors = {};

        // Convert empty fields to an empty string so we can use validator functions
        data.username = !isEmpty(data.username) ? data.username : "";
        data.password = !isEmpty(data.password) ? data.password : "";

        // Username checks
        if (Validator.isEmpty(data.username)) {
            errors.username = "Username field is required";
        }
        // Password checks
        if (Validator.isEmpty(data.password)) {
            errors.password = "Password field is required";
        }

        return {
            errors,
            isValid: isEmpty(errors)
        };
    }
};