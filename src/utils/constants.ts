import { error } from "node:console";

export const APP_CONFIG = {
    baseurl: "https://www.saucedemo.com/",
    timeout: {
        short: 5000,
        medium: 10000,
        long: 30000
    },
    userCredentials: {
        standardUser: 'standard_user',
        lockedOutUser: 'locked_out_user',
        password: 'secret_sauce'
    },
    errorMessages: {
        lockedOutUser: 'Epic sadface: Sorry, this user has been locked out.'
    }
} as const;