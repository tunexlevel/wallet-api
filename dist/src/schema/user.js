"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateMessage = exports.login = exports.createAccount = void 0;
const createAccount = () => {
    return {
        first_name: {
            exists: {
                errorMessage: 'The first name is required',
            },
        },
        last_name: {
            exists: {
                errorMessage: 'The last name is required',
            },
        },
        email: {
            exists: {
                errorMessage: 'The email is required',
            },
            isEmail: {
                bail: true,
            },
        },
        password: {
            isLength: {
                errorMessage: 'Password should be at least 7 chars long',
                options: { min: 7 },
            },
        },
    };
};
exports.createAccount = createAccount;
const login = () => {
    return {
        email: {
            exists: {
                errorMessage: 'The email is required',
            },
            isEmail: {
                bail: true,
            },
        },
        password: {
            isLength: {
                errorMessage: 'Password should be at least 7 chars long',
                options: { min: 7 },
            },
        },
    };
};
exports.login = login;
const templateMessage = () => {
    return {
        phone_no: {
            exists: {
                errorMessage: 'The phone number is required',
            },
        },
        message: {
            exists: {
                errorMessage: 'The message is required',
            },
        },
        name: {
            exists: {
                errorMessage: 'The template name is required',
            },
        },
    };
};
exports.templateMessage = templateMessage;
