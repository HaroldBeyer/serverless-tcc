const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const { ServiceService } = require('../services/service.service');

const service = new ServiceService(AWS);

module.exports.getService = async (event) => {
    return service.get(event);
};

module.exports.getAllServices = async (event) => {
    return service.getAll();
};

module.exports.insertService = async (event) => {
    return service.insert(event);
};

