const { ScheduleService } = require('../services/schedule.service');

const service = new ScheduleService();

module.exports.get = async (event) => {
    return service.get(event);
};

module.exports.getAll = async (event) => {
    return service.getAll();
};

module.exports.insert = async (event) => {
    return service.insert(event);
};

