/*******Configuration variables */

//Environments object
let environments = {};

//Staging environment
environments.staging = {
    port:3000,
    envName : 'staging'
};

//Production environment
environments.production = {
    port:5000,
    envName : 'production'
};


let currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let envToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//export
module.exports = envToExport;