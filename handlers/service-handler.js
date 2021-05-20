const { ServiceService } = require('../services/service.service');
const { DB } = require('../db/db');
let faunaDB;

let cachedDB = faunaDB ? faunaDB : new DB();
faunaDB = faunaDB ? faunaDB : cachedDB;

const service = new ServiceService(cachedDB);
module.exports.getService = async (event) => {
    return service.get(event);
};

module.exports.getAllServices = async (event) => {
    return service.getAll();
};

module.exports.insertService = async (event) => {
    return service.insert(event);
};

