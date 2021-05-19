const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const { SchedulePlanService } = require('../services/schedulePlan.service');

const service = new SchedulePlanService(AWS);

module.exports.get = async (event) => {
    return service.get(event);
};

module.exports.getAll = async (event) => {
    return service.getAll();
};

module.exports.insert = async (event) => {
    return service.insert(event);
};

module.exports.insertSchedule = async (event) => {
    return service.insertSchedule(event);
};

