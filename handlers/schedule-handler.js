const AWS = require('aws-sdk');
const { ScheduleService } = require('../services/schedule.service');

AWS.config.setPromisesDependency(require('bluebird'));
const service = new ScheduleService(AWS);

module.exports.get = async (event) => {
    return service.get(event);
};

module.exports.getAll = async (event) => {
    return service.getAll();
};

module.exports.insert = async (event) => {
    return service.insert(event);
};

