const { ScheduleService } = require('../services/schedule.service');
const { DB } = require('../db/db');
let faunaDB;

let cachedDB = faunaDB ? faunaDB : new DB();
faunaDB = faunaDB ? faunaDB : cachedDB;

const service = new ScheduleService(cachedDB);


module.exports.get = async (event) => {
    return service.get(event);
};

module.exports.getAll = async (event) => {
    return service.getAll();
};

module.exports.insert = async (event) => {
    return service.insert(event);
};

