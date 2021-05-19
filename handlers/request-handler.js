const { RequestService } = require('../services/request.service');
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const service = new RequestService(AWS);

module.exports.get = async (event) => {
    const id = event.pathParameters.id;
    return service.get(id);
};

module.exports.getAll = async (event) => {
    return service.getAll();
};

module.exports.insert = async (event) => {
    return service.insert(event);
};

module.exports.confirm = async (event) => {
    return service.confirm(event);
};

module.exports.cancel = async (event) => {
    return service.cancel(event);
};

